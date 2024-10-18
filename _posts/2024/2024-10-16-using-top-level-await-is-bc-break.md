---
title: "In the future using top-level await might be a BC break in Node"
date: "2024-10-16 13:44:00 UTC"
geo: [43.663961, -79.333157]
location: "Leslieville, Toronto, ON, Canada"
tags:
  - node
  - await
  - async
  - javascript
  - backwards compatibility
draft: true
---

[Node 23][1] was released this week, and the hot ticket item probably is the
fact that you can now `require()` files that use ESM (`import`/`export`).

This is helpful because ESM and CommonJS (`require`/`module.exports`) are kind
of different worlds and before this change if you wanted to use a "module"
from your CommonJS file, you would need to do something like:

```javascript
const theThing = await import('some/module/file.mjs');
```

This is called a [dynamic import][2] and it's extra annoying, because you
can't just put this at the top of your file. It returns a Promise, so you
can only import these modules 'asynchronously' or in functions. The reason
is that you can only `await` inside functions in CommonJS files. So this
syntax prevents importing a "module" and immediately using it. To use a
module in CommonJS, you'll need some kind of initialization logic.

Many Javascript packages resort to [shipping both a 'CommonJS' and a 'ESM'
version of their code][3] to reduce this kind of annoyance, but not everyone
does.

## The Node 23 change

Node 23 makes it possible to load ESM modules transparently via `require()`.
This means that the above example can be rewritten to:

```javascript
const theThing = require('some/module/file.mjs');
```

The important part here is not the usage of `require`, but the absense of
`await`. This allows ESM modules to be loaded without this kind of
initialization logic.

But there's a big caveat:

This _only_ works if the module you loaded in is not using top-level await.
"Top level await" means awaiting things outside of (async) functions, which
is possible in modules (but not CommonJS).

If a top-level await _was_ used, a `ERR_REQUIRE_ASYNC_MODULE` error will be
thrown. But the important thing to note is that this doesn't just apply to
the file you are directly importing/requiring. It also applies to any files
loaded by that file, at any level in either your project or any dependency or
sub-dependencies.

## Using top-level await is now a BC break

Typically when we think of backwards compatibility breaks that require a major
new version in semver, you might think of functions changing, or removing or
arguments no longer being supported.

Before this change in Node, if your project was fully switched to ESM you might
not think of placing a top-level `await` anywhere in your code as a backwards
compatibility break, but if it's the first `await` you might now inadvertently
break Node.js users, if they used `require()` to bring in your module.

This means that the first top-level `await` in your project (or any of your
dependencies) might now constitute a new major version if you follow [semver][4].

### 1. Tell your users you don't support require()

You could effectively tell them if they use `require()` they're on their own.
Chances are that your users won't read this and do it anyway, but arguably they
should read the readme of a package they bring in.

### 2. Add a dummy await

Do you think you or your dependencies might use a top-level await in the
future, but you don't yet? You could add this line to your source to reserve
the right to do it later:

```javascript
await "Good things come to those that support await"
```

### 3. Explictly break CommonJS

Packages can provide both CommonJS and ESM support via the [`exports`][6] key
in `package.json`. It could be an option to export a single CommonJS file that
just throws an error to warn CommonJS users they shouldn't use this package.


Out of these 3 options, I kind of like 2 because if Node.js ever changes
behavior and _does_ support loading modules that use top-level await in
CommonJS files it will one day just start working.

Regardless. it does feel important to me that package maintainers that only
ship ESM, or ship CommonJS and intend to use this new feature have a
strategy, because it's bound to blow up if not.

## How do other runtimes do it?

In Bun you can use [`import` and `require`][5] in the same file, so there's
fewer trade-offs to make. But if you do use `require()` to import a module
with top-level await it still has the same issue. There's just fewer reasons
in Bun to even want to do this.

Deno [doesn't support CommonJS][5] so it doesn't have that problem.

## Does the issue exists when importing CommonJS files into modules?

Importing CommonJS files into modules was always possible via the standard
`import` syntax, and because CommonJS can't asynchronously export this
problem doesn't exist there.

## What should I do as a user?

Most of this article was about the effects for package maintainers, but not every
package will do this well so as a user you're still potentially exposed to this
issue.

In order of preference, consider the following:

1. Stop using CommonJS. Start using ESM everywhere. This issue only exists in
   CommonJS files using ESM, not the reverse. ESM is the future. You're working
   with dead-end technology.
2. Have some testing in place that at the very least loads the entirely of your
   code-base. If all (top-level, not-dynamic) `requires()` are ran/resolved,
   any changes in depndencies should just blow up your CI environment and
   application.
3. Find out if your dependencies are ESM-only, and never `require()` them.
   This protects you from issues with direct dependencies, but statistically
   it's more likely this issue will pop up in a sub-dependency though.


[1]: https://nodejs.org/en/blog/release/v23.0.0
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[3]: https://evertpot.com/universal-commonjs-esm-typescript-packages/
[4]: https://semver.org/
[5]: https://docs.deno.com/runtime/tutorials/cjs_to_esm/
[6]: https://nodejs.org/api/packages.html#exports
