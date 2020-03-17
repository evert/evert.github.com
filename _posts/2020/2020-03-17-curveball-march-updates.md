---
title: "Curveball - March updates"
date: "2020-03-17 21:48:32 UTC"
tags:
  - http2
  - hypermedia
  - api
  - rest
  - push
  - hal
  - curveball
  - typescript
  - microframework
  - koa
  - expressjs
  - nodejs
  - javascript
  - lambda
cover_image: https://evertpot.com/assets/cover/curveball.png
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

<a href="https://github.com/curveball">
  <img src="/assets/img/curveball.svg" style="float: left; padding: 0 10px 10px 0" alt="Curveball" width="150px" />
</a>

Curveball is the freshest new microframework for Typescript.

Since the last [big announcement][1], there's been a number new curveball
users, and also a few framework changes.

I thought it would be nice to list some of the things we've been working on
this month.

Starter template
----------------

Probably the most significant, curveball now has a [starter template][10].
This template is designed to be as minimal as possible, but just enough to
get a working Curveball application in a few minutes.

The golden path looks like this:

```sh
git clone https://github.com/curveball/starter.git <project_name>
cd <project_name>
npm i
npm run build
npm start
```


Website updates
---------------

We've made some progress on the [website][2]. It's actually something we're
happy to share now. Thank you [LFO Industries][3] for the great design. They
also made our logo and brand identity!

In the future, the website needs to host a solid tutorial and documentation
for all the core plugins. Watch this space.

Accesslog plugin uses ANSI colors
---------------------------------

The [accesslog][4] has two main purposes: to emit useful logging for production
systems, and for a developer to be able to see what's going on their console.

For the latter case, the `accesslog` middleware now detects if it's running in
a terminal, and emit colors, making it easier to spot errors.

<figure>
  <img src="https://raw.githubusercontent.com/curveball/accesslog/master/screenshots/v0.2.0.png" alt="Accesslog screenshot" />
</figure>


Conditional request helpers
---------------------------

The [core][5] package now has a number of helper functions for conditional
requests.

These helpers make it easier to evaluate conditions for `If-Match`,
`If-None-Match`, `If-Modified-Since` and `If-Unmodified-Since`.

```typescript
import { checkConditional } from '@curveball/core';
const result = checkConditional(ctx.request, lastModifiedDate, eTag);
```

The `result` variable will contain either [`200`][6], [`304`][7] or [`412`][8],
which is a suggestion for what status code you might want to return.

In the future this utility will be used to automate conditional requests
further using the [controller][9].


[1]: https://evertpot.com/curveball-typescript-framework-update/
[2]: https://curveballjs.org/
[3]: https://www.lfo-industries.com/
[4]: https://github.com/curveball/accesslog
[5]: https://github.com/curveball/core
[6]: https://evertpot.com/http/200-ok "200 OK"
[7]: https://evertpot.com/http/304-not-modified "304 Not Modified"
[8]: https://evertpot.com/http/412-precondition-failed "412 Precondition Failed"
[9]: https://github.com/curveball/controller
[10]: https://github.com/curveball/starter

