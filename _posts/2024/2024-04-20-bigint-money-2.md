---
title: Moving on from Mocha, Chai and nyc.
date: "2024-04-21 03:00:00 UTC"
geo: [43.663961, -79.333157]
location: "Leslieville, Toronto, ON, Canada"
tags:
  - open source
  - node
  - testing
  - mocha
  - nyc
  - chai
---

I'm a maintainer of several small open-source libraries. It's a fun activity.
If the scope of the library is small enough, the maintenance burden is
typically fairly low. It does this thing, and I occasionally just need to
answer a few questions per year, and do the occasional release to bring it
back up to the current 'meta' of the ecosystem.

Also even though it's 'done', in use by a bunch of people and well tested,
it's also good to do a release from time to time to not give the impression
of abandonment.

This weekend I released a 2.0 version of my [bigint-money][1] library, which
is a fast library for currency math.

I originally wrote this in 2018, so the big BC break was switching everything
over to [ESM][3]. For a while I [tried to support both CommonJS and ESM][2]
builds for my packages, but only a year after all that effort it frankly no
longer feels needed. Fow a while I was worried the ecosystem was going to
split, but people stuck on (unsupported) versions of Node that don't
support ESM aren't going proactively keep their other dependencies updated,
so CommonJS is for (and many others) in the past now. (yay!)

Probably _the single best way_ to keep maintenance burden for packages low is
to have few dependencies. Many of packages have 0 dependencies.

Reducing `devDependencies` also helps. If you didn't know, `node` now has a
built-in testrunner. I've been using [Mocha][4] + [Chai][5] for many many
years. They were awesome and want to thank the maintainers, but `node --test`
is pretty good now and has pretty output.

It also:

* Is much faster (about twice as fast with Typescript and code coverage
  reporting, but I suspect the difference will grow with larger code bases).
* Easier to configure (especially when you're also using Typescript. Just use `tsx --test`).
* It can output test coverage with (`--experimental-test-coverage`).

<video src="/assets/video/node-test.webm" class="fill-width" controls loop></video>

Furthermore, while [node:assert][6] doesn't have all features of Chai, it has
the important ones (deep compare) and adds better Promise support.

All in all this reduced my `node_modules` directory from a surprising 159M
to 97M, most of which is now Typescript and ESLint, and my total dependency
count from 335 to 141 (almost all of which is ESLint).

Make sure that Node's test library, coverage and assertion library is right
for you. It may not have all the features you expect, but I keep my testing
setup relatively simple, so the switch was easy.

[1]: https://github.com/evert/bigint-money
[2]: https://evertpot.com/universal-commonjs-esm-typescript-packages/
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules "JavaScript modules"
[4]: https://mochajs.org/
[5]: https://www.chaijs.com/
[6]: https://nodejs.org/api/assert.html
