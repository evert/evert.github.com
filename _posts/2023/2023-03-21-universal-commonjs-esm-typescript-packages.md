---
title: "Supporting CommonJS and ESM with Typescript and Node"
date: "2023-03-21 17:11:00 UTC"
geo: [43.64793345752491, -79.42044389030917]
location: "Bad Gateway Office"
tags:
  - commonjs
  - esm
  - javascript
  - typescript
  - build
---

I maintain a few dozen Javascript libraries, and recently updated many of them
to support CommonJS and Ecmascript modules at the same time.

The first half of this article describes why and how I did it, and then all the
hoops I had to jump through to make things work.

Hopefully it's a helpful document for the next challenger.

A quick refresher, CommonJS code typically looks like this:

```javascript
const MyApp = require('./my-app');
module.exports = {foo: 5};
```

And ESM like this:

```javascript
import MyApp from './my-app.js';
export default {foo: 5};
```

Except if you use Typescript! Most Typescript uses ESM syntax, but actually
builds to CommonJS. So if your Typescript code looks like the second and
think 'I'm good', make sure you also take a look at the built Javascript
code to see what you actually use.

Why support ESM
---------------

The general vibe is that ESM is going to be the future of Javascript code.
Even though I don't think the developer experience is quite there yet, but
more people will start trying ESM.

If you decided to plunge in with ESM, I want my libraries to feel first-class.

For example, I'd want you to be able to default-import:

```typescript
import Controller from '@curveball/controller';
```

At the same time most people are still on CommonJS, and I want to continue
to support this without breaking backwards compatibility for the forseeable
future.

The general approach
--------------------

My goal is for my packages to 'default' to ESM. From the perspective of a
library maintainer you will be dealing with ESM.

During the build phase steps are being made to generate a secondary CommonJS
build. As a maintainer you might run into CommonJS-specific issues, but
I suspect people will only see those if the CI system reports an issue.

Our published NPM packages will have a directory structure roughly like this:

```
- package.json
- tsconfig.json

- src/     # Typescript source
- cjs/     # CommonJS
- esm/     # ESM
- test/
```

We include the original typescript sources to make step-through debugging work
well, and have a seperate directory for the ESM and CommonJS builds.

If you just want to skip to the end and see an example of a package that has
all this work done, check out my `@curveball/core` package:

* Github source: <https://github.com/curveball/core>
* Published NPM package contents: <https://www.npmjs.com/package/@curveball/core?activeTab=code>


Typescript features we don't use
---------------------------------

### esModuleInterop


We don't use the `esModuleInterop` setting in `tsconfig.json`. This flag
lets you default-import non-ESM packages like this:

```typescript
import path from 'node:path';
```

instead of the more awkward:

```typescript
import * as path from 'node:path';
```

On the surface `esModuleInterop` seems like it would be helpful, but it
has a major problem: if our libraries _use_ `esModuleInterop`, anyone
who uses that  library is forced to also turn it on.

So turning by turning `esModuleInterop` off we don't force anyone
downstream into a specific setting. I generally recommend anyone writing
libraries to turn this off to reduce friction and ironically increase
interopability.

### Path mapping

Typescript lets you map arbitrary paths to specific directories in your
source. This is popular because it lets you do things like:

```typescript
import MyController from '@controllers/my';
```

Instead of being forced to always do relative import

```typescript
import MyController from '../../../controllers/my';
```

This is quite a popular feature for larger code-bases because people find
relative paths annoying.

I'm also not using this feature. A big issue is that only Typescript
is aware of this configuration, so any other tooling that uses your files
may need to be configured separately to also understand this, which
doesn't always work.

So while I don't have an exact list of exact reasons or configurations
where this fails, it's a common enough issue that I've decided to just
avoid this feature altogether, for the sake of reducing magic. If you
do insist on using path mapping, you're on your own.

Configuring package.json
-------------------------

Modern node versions now have [a syntax][1] in `package.json` that lets you
specify both the default CommonJS and ESM files. These are the relevant
lines of one of our packages:

```json
{
  "name": "@curveball/controller",
  "version": "0.5.0",
  "description": "A simple controller pattern for Curveball.js",
  "type": "module",
  "exports": {
    "require": "./cjs/index.js",
    "import": "./esm/index.js"
  },
  "main": "cjs/index.js"
}
```

When specifying your `package.json` this way, Node will automatically load
the correct (cjs/esm) directory depending on what the user needs. This all
happens automatically. Neat!

`main` is no longer used, but I'm keeping it in case of older tooling.


Building with Typescript
------------------------

Before we made this change, we just had a `src/` and `dist/` directory
for Typescript and Javascript files respectively. To do the build, we
could just run `npx tsc`.

This still works, except `npx tsc` now builds to `esm` for the regular
developer flow.

But when we build for creating the NPM package, we need to create both.
We use a `Makefile` for this, but these are roughly the commands to run:

```sh
npx tsc --module commonjs --outDir cjs/
echo '{"type": "commonjs"}' > cjs/package.json

npx tsc --module es2022 --outDir esm/
echo '{"type": "module"}' > esm/package.json
```

As you can also see that both our `cjs` and `esm` packages get a 1-line
`package.json` file with a `type` property.

This is _required_ because Node needs to know wether files with a `.js`
extensions should be interpreted as CommonJS or ESM. It can't figure it
out after opening it.

Node will look at the nearest `package.json` to see if the `type` property
was specified.

It's also possible to use `.cjs` or `.mjs` file extensions, but this
doesn't play well with Typescript as Typescript can't automatically adjust
import paths for you.


Changes we had to make in our code
----------------------------------

I think it's reasonable to say that that vanilla javascript and
javascript modules are slightly different programming languages

They are interopable, but not the same. They have slightly different
syntax and behavior. This is why you also need to tell HTML in advance
what kind of flavour of Javascript you're going to be using:

```html
<script type="module" src="my-module.mjs"></script>
```

So naturally I expected to have to make some changes to write code in
a way that works identical in both targets.

An obvious example is top-level `await` which only works in ESM. Here
are all the things I ran into:

### Extensions in imports

All our (local) typescript imports had to change from:

```typescript
import Foo from './foo';
```

to:

```typescript
import Foo from './foo.js';
```

ESM _requires_ extensions, whereas in CommonJS it's not needed. Here's a `sed`
command I used to change all these in bulk (probably not perfect, so you'll
really want to be able to roll this back):

```sh
find . -name "*.ts" | xargs -n1 sed -i "s/from '\(.*\)';/from '\\1.js'/g"
```

So the strange thing with all this is that your code will have statements
like: 

```typescript
import Foo from './foo.js';
```

But actually the file in that directory is called `./foo.ts` (`.ts` not `.js`)
yes, this is confusing and annoying.

I don't really want a future contributor of my library to have to understand
the build chain, so it's a leaky abstraction and a limitation of Typescript.

I hope this is rectified in the future. I understand the philosophy of wanting
to avoid magic as much as possible, but *just* give me a setting to globally
rewrite a `.ts` to `.js` when generating the `.js` files.

I secretly suspect that despite Typescript explicitly not supporting this,
this might still happen later anyway. Maybe they don't want to commit to
building this before they have a good plan how 🤞.


### Directory imports

In CommonJS in node you can import a directory, and if a `index.js` exists
in that directory, it will open that. ESM requires exact paths, so your

```typescript
import * from './controllers'
```

Now has to be:

```typescript
import * from './controllers/index.js'
```

### `__dirname` and `__filename`

Node defines 2 useful very variables in every CommonJS file, probably borrowed
from PHP.

`__dirname` is a reference to the path the _current_ file is in, and
`__filename` is the whole path + filename.

I used these to load in non-javascript assets from relative paths. For
example, I had a snippet like this to get the version of the current
package:

```typescript
import * as fs from 'node:fs';

const pkg = JSON.parse(
  fs.readFileSync(
     __dirname + '../package.json'
  )
);

console.log(pkg.version);
```

Unfortunately, these variables no longer exist in ESM. Instead we have
`import.meta`. In Node, this is an object looking like this:

```
{
  url: 'file:///home/evert/src/curveball/controller/test.mjs'
}
```

So instead of a filesystem path, we get a `file://` url with the location. So to
write the equivalent in ESM we get something like this:


```typescript
import * as fs from 'node:fs';
import * as url from 'node:url';

const pkg = JSON.parse(
  await fs.readFile(
    url.fileURLToPath(url.resolve(import.meta.url, './package.json')),
    'utf-8',
  )
);

console.log(pkg.version);
```

The challenge is writing this code in a way that will work with both. The
'crazy' way to solve this is to take an `Error` object, and get the path
from the string that appears in the stack trace. This means parsing the
stacktrace :(

```typescript
import * as url from 'node:url';
import * as path from 'node:path';

function getDirName() {

  const err = new Error()
  console.log(err.stack?.split('\n')[1]);
  const fileUrl = err.stack?.split('\n')[1].match(/at .* \((file:.*):\d+:\d+\)$/);

  if (!fileUrl) throw new Error('This misrable idea failed');

  return path.dirname(url.fileURLToPath(fileUrl[1]));

}

console.log(getDirName());
```

I don't believe that the exact format of the stack trace is stable or even
the same across different interpreters, so this seems like a bad idea.

The problem is that the more obvious approach doesn't work:

```typescript
import * as path from 'node:path';
import * as url from 'node:url';

/** @ts-ignore CommonJS/ESM fun */
const dirname = 
  typeof __dirname !== 'undefined' ?
  __dirname :
  /** @ts-ignore CommonJS/ESM fun */
  path.dirname(url.fileURLToPath(import.meta.url));
```

The above code creates a new `dirname` variable. While
this works for ESM, it breaks for CommonJS on Node. The reason is that
`import` is not a regular object, it's syntax and even if the branch with
`import.meta` never gets run, Node will error while parsing:

```
/home/evert/src/curveball/controller/cjs/dirname.js:9
    path.dirname(url.fileURLToPath(import.meta.url));
                                          ^^^^

SyntaxError: Cannot use 'import.meta' outside a module
```

Sadness!

I don't have a satisfying solution for this yet. I've worked around this in
some of my packages by avoiding this altogether, or rewriting certain files
after running them. `eval('import.meta.url')` causes the ESM build to fail
because technically things running in `eval` is no longer in a module scope.

### Importing CommonJS modules with 'default exports'

Some of our packages rely on 3rd party dependencies that are written in
plain Javascript and use CommonJS.

In CommonJS dependencies you can 'default' export things like:

```javascript
module.exports = function foo(a, b) { a+b; };
```

If we were to use this library in Typescript (CJS build) we could use it
this way:

```typescript
import * as WebSocket from 'ws';
const ws = new WebSocket('ws://localhost:8000');
```

But if we are in ESM land in Typescript, this doens't work. We actually
get an object with a property named `.default`. For these modules, this
is the approach I've come up with:

```typescript
import * as WebSocketImp from 'ws';

// ESM shenanigans
const WebSocket = 'default' in WebSocketImp ? (WebSocketImp.default as any) : WebSocketImp;
```

Yep! It's a pain. I've had to do this for `websocket`, `chai-as-promised`,
`ajv`, `raw-body`, `accepts` and `http-link-header`. In case you haven't
figured it out, I'm building a [framework](https://curveball.js/).

Testing
-------

To have confidence in both builds, I want to write tests that run against
both. My tests are written using Mocha. My tests are _also_ written in
Typescript. By default, they only run against the ESM build, and I expect
myself and other developers to be in this mode during the main 'development
loop.

To make Mocha understand Typescript, we need to install the `ts-node` package,
and add the following properties to the _root_ `package.json`:

```json
"mocha": {
  "loader": [
    "ts-node/esm"
  ],
  "recursive": true,
  "extension": [
    "ts",
    "js",
    "tsx"
  ]
}
```

This all works perfectly well, but what about CommonJS? For this I had 2
approaches: Either reconfigure mocha to use the CommonJS Typescript
loader instead of the ESM typescript loader, but this was too much of
a pain to get right with writing configuration files on the fly.

Instead, I decided to just ask Typescript to build the entire project
including tests in a separate directory and then just run Mocha on
the javascript files.

```sh
mkdir -p cjs-test
cd test; npx tsc --module commonjs --outdir ../cjs-test
echo '{"type": "commonjs"}' > cjs-test/package.json
cd cjs-test; npx mocha --no-package
```

This required a separate `tsconfig.json` in our `test` directory.

Conclusion
----------

So this is a fairly large amount of annoyances to work through, some without
a solution. Would I recommend this?

I think if you're in my position where:

* You're doing this for a library.
* You consider ESM the future, but want to continue to support CommonJS users.
* The experience of users of your library is far more important than your own experience.

Then, I think this is a good idea. If you don't want this hassle and want just
one target, I think CommonJS will still give you the best experience.

ESM will probably catch up at some point, but right now I think we're still in the
awkward phase.

[1]: https://nodejs.org/api/packages.html#exports 
