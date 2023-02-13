---
title: "Building a simple CLI tool with modern Node.js"
date: "2023-02-13 19:05:14 UTC"
location: "Mexico City, Mexico"
geo: [19.4085058, -99.1708821]
tags:
  - node
  - cli
  - changelog
  - testing
  - esm
---

I'm a maintainer of several dozen open source libraries. One thing I've
always done is maintain a hand-written changelog.

Here's an example from [a12n-server][1]

```markdown
0.22.0 (2022-09-27)
-------------------

Warning note for upgraders. This release has a database migration on the
`oauth2_tokens` table. For most users this is the largest table, some
downtime may be expected while the server runs its migrations.

* #425: Using a `client_secret` is now supported with `authorization_code`,
  and it's read from either the request body or HTTP Basic Authorization
  header.
* The service now keeps track when issuing access tokens, whether those tokens
  have used a `client_secret` or not, which `grant_type` was used to issue them
  and what scopes were requested. This work is done to better support OAuth2
  scopes in the future, and eventually OpenID Connect.
* Fixed broken 'principal uri' in introspection endpoint response.
* OAuth2 service is almost entirely rewritten.
* The number of tokens issued is now displayed on the home page.
* Large numbers are now abbreviated with `K` and `M`.
* #426: Updated to Curveball 0.20.
* #427: Typescript types for the database schema are now auto-generated with
  `mysql-types-generator`.
```

These are all written in Markdown. You might think: isn't Git also a log? Why
bother hand-writing these?

The reason is that the audience for these is a bit different. I want to bring
attention to the things that are the most important for the end-user, and
focus on the impact of the change to the user.

I thought it would be handy to write a CLI tool that makes it a bit easier to
maintain these. [So, I did!][7]. If you are curious what kind of technology
choices went into this, read on.


Goals and features
------------------

The tool should be able to do the following:

* Reformat changelogs (a bit like prettify) (`changelog format`)
* Add an entry via the command line (`changelog add --minor -m "New feature"`).
* Automatically set the release date (`changelog release`)
* Pipe a log of a specific version to STDOUT, so it can be used by other tools
  (like integrating with github releases).

I also had a bunch of a non-functional requirements:

* Use the latest Node features.
* Use up to date Javascript standards and features (ESM).
* Avoid dependendencies unless it's unreasonable to do so.
* Make it low maintanance.

Want to find the finished tool right now? It's open source so just go to [Github][7].


The implementation
-------------------

### ESM & Typescript

Ecmascripts modules worked really well here. It's a small change of habits,
but the general recommendation I would have is to just save your files
as `.mjs` and start using it.

Here's the first few lines of `parse.mjs`:

```javascript
// @ts-check
import { Changelog, VersionLog } from "./changelog.mjs";
import { readFile } from 'node:fs/promises';

/**
 * @param {string} filename
 * @returns {Promise<Changelog>}
 */
export async function parseFile(filename) {

  return parse(
    await readFile(filename, 'utf-8')
  );

}
```

The CommonJS -> ESM transition is not without pain, but for an new project
like this it's really the ideal choice. (top level `await` 🎉)

I've also made the choice to not write my code in Typescript, but use JSDoc
annotations instead (These are the `@param` and `@returns` comments).

Not everyone knows that you don't need to write .ts files to benefit from
Typescript. Typescript can also check your Javascript files quite strictly,
and there's a lot of work still being done in adding new features to this
syntax.

This has the benefit of not needing a build phase. You don't even need
Typescript during development which reduces the barrier to entry.

Here's my minimal `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "rootDir": "./",
    "allowJs": true,
    "checkJs": true,

    "moduleResolution": "node",
     
    "noEmit": true,
    "strict": true,
    "useUnknownInCatchVariables": false,
  
  }
}
```

The Typescript documentation has a [page detailing the JSDoc annotations they
support][8], if you'd like to learn more.


### Command line parsing

CLI tools need to be able to parse command line options. Since Node 18.3
(backported to Node 16.17) Node comes with a built-in options parser.

Here's a sample of the code:

```javascript
import { parseArgs } from 'node:util';

const { positionals, values } = parseArgs({
  options: {
    help: {
      type: 'boolean',
      short: 'h',
      default: false,
    },
    all: {
      type: 'boolean',
      default: false,
    },
    message: {
      type: 'string',
      short: 'm'
    },
    patch: { type: 'boolean' },
    minor: { type: 'boolean' },
    major: { type: 'boolean' },
  },
  allowPositionals: true,
});
```

This confguration adds flags like `--major`, lets you specify a message
with `--message "hello!"` or use a short-hand alternative like `-m "Hi"`.

Does it do everything? No! There's packages out there that are more
sophisticated, use colors, automatically create help screens but they
also ship with large dependency trees.

In my case, this was good enough.

Check out the [Node docs][2] for more info.

### Testing

Most people probably use Jest or Mocha as their test framework, but since
Node 18 (also backported to 16) Node has a built-in test-runner.

It has an API similar to Mocha and Jest with keywords like `it`, `test`,
`describe`, `before`, etc.

Here's a sample of one of my tests:

```javascript
// @ts-check
import { test } from 'node:test';
import { parse } from '../parse.mjs';
import * as assert from 'node:assert';

test('Parsing changelog metadata', async () => {

  const input = `Time for a change
=========

0.2.0 (????-??-??)
------------------

* Implemented the 'list' command.
* Added testing framework.

0.1.0 (2023-02-08)
------------------

* Implemented the 'help' and 'init' commands.
*
`;

  const result = await parse(input);

  assert.equal('Time for a change', result.title);
  assert.equal(2, result.versions.length);
  
  assert.equal(null, result.versions[0].date);
  assert.equal('0.2.0', result.versions[0].version);
  assert.equal('2023-02-08', result.versions[1].date);
  assert.equal('0.1.0', result.versions[1].version);

});
```

To run the tests, just run `node --test`. No configuration needed, it will
discover tests following directory and filename conventions.

The Node 18 test output is a bit rough, it's the TAP format and looks like this:

```
TAP version 13
# Subtest: /home/evert/src/changelog-tool/test/parse.mjs
    # Subtest: Parsing changelog metadata
    ok 1 - Parsing changelog metadata
      ---
      duration_ms: 1.713409
      ...
    # Subtest: Parsing changelog entries
    ok 2 - Parsing changelog entries
      ---
      duration_ms: 0.2595
      ...
    # Subtest: Preface and postface
    ok 3 - Preface and postface
      ---
      duration_ms: 0.193591
      ...
    1..3
ok 1 - /home/evert/src/changelog-tool/test/parse.mjs
  ---
  duration_ms: 70.901055
  ...
1..1
# tests 1
# pass 1
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 81.481441
```

In Node 19 new test reporters will be shipped, but I haven't tested this yet.

Frankly, after using this I don't know if would use Mocha anymore. I've been
using probably over a decade, and it has some nice features and benefits,
for the kinds of tests I write (and I write a lot), I think there's anything
I need beyond what Node is offering here.

Some links:

* [node:test package][3].
* [node:assert package][5].
* [Mocking in node][6].

package.json, annotated
-----------------------

I wanted to end this article with how I've set up my `package.json`, so you
can see how it all ties together. (If only `npm` [supported JSON5][4] so I
could keep my comments right in the package 😭).


```json
{
  // The name of the package, and how it's published on NPM
  "name": "changelog-tool",

  // Package version!
  "version": "0.5.0",

  // This will show up in NPM searches
  "description": "A CLI tool for manipulating changelogs",

  // This tells Node to assume this is an ESM package. Not strictly needed
  // if we use the .mjs extension everywhere though.
  "type": "module",

  // If you use this package programmatically (not on CLI), this file is
  // where all 'exports' are for this package.
  "main": "index.mjs",

  "scripts": {
    // Test runner!
    "test": "node --test",

    // I like to keep Typescript running in the terminal to insta-warn me of
    // of any issues.
    "watch": "tsc --watch"
  },

  // This helps people discover the package on npmjs.org
  "keywords": [
    "changelog",
    "markdown"
  ],

  // It's me!
  "author": "Evert Pot (https://evertpot.com/)",

  // Do (almost) anything you want
  "license": "MIT",

  "engine": {
    // Warn people if they haven't upgraded yet
    "node": ">16"
  },

  "bin": {
    // When people install this package, this makes `npx changelog` work. If
    // you installed this package globally, you now have a `changelog` command
    // at your disposal.
    "changelog": "./cli.mjs"
  },
  "devDependencies": {
    // The only 2 dependencies. You don't even really need these if you just want
    // use or hack the package. Github actions will run Typescript as well.
    "@types/node": "^18.11.19",
    "typescript": "^4.9.5"
  }
}
```

Conclusion
----------

I love building new things and being deliberate about every choice.

The result is that I'm more likely to end up with something minimal,
low-maintance and I gain a deeper understanding of the tools I use.

In the near future I would probably make all these choices again. The Node test
runner is fast and low-cruft, ESM is great when it works and not needing a build
step feels right for a project this size.

I hope this inspires someone in the future to start their next project from
an empty directory instead of copying a large boilerplate project.

[changelog-tool project on Github][7].

[1]: https://github.com/curveball/a12n-server/ "An awesome lightweight OAuth2 server"
[2]: https://nodejs.org/api/util.html#utilparseargsconfig "Parsing arguments with Node"
[3]: https://nodejs.org/api/test.html "Node Test Runner"
[4]: /json5/
[5]: https://nodejs.org/api/assert.html "Assertion Testing"
[6]: https://nodejs.org/api/test.html#mocking "Mocking in Node tests"
[7]: https://github.com/evert/changelog-tool "The changelog tool!"
[8]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html "JSDoc support in Typescript"
