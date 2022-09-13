---
title: "Porting Curveball to Bun"
date: "2022-09-13 16:30:00 UTC"
geo: [43.647858945982136, -79.38963544544829]
location: "Tiny Garage Office"
cover_image: https://evertpot.com/assets/cover/curveball.png
tags:
  - bun
  - curveball
  - node
  - framework
  - deno
  - express
  - v8
  - javascriptcore
---

[Bun][1] is the hot new server-side Javascript runtime, in the same category
as [Node][2] and [Deno][3]. Bun uses the [JavascriptCore][4] engine from
Webkit, unlike Node and Deno which use [V8][5]. A big selling point is that
it's coming out faster in a many benchmarks, however the things I'm personally
excited about is some of it's quality of life features:

* It parses Typescript and JSX by default (but doesn't type check), which
  means there's no need for a separate 'dist' directory, or a separate tool
  like `ts-node`.
* It loads `.env` files by default.
* It's compatible with NPM, `package.json`, and many built-in Node modules.

I also like that it's 'Hello world HTTP server' is as simple as writing this
file:

```typescript
// http.ts
export default {
  port: 3000,
  fetch(request: Request): Promise<Response> {
    return new Response("Hello world!");
  },
};
```

And then running it with:

```sh
bun run http.ts
```

Bun will recognize that an object with a `fetch` function was default-exported,
and start a server on port 3000. As you can see here, this uses the standard
[Request][6] and [Response][7] objects you use in a browser, and can use
async/await.

These are all things that didn't exist when Node and Express were first
created, but seem like pretty good ideas for something built today. I don't think
using `Request` and `Response` are good for more complex use-cases (streaming
responses, 1xx responses, trailers, upgrading to other protocols, getting tcp
connection metadata like remoteAddr are some that come to mind),
because these objects are designed for clients first.

But in many cases people are just building simple endpoints, and for that it's
great.

Bun supports a ton of the standard Node modules, but it's also missing some
such as support for server-side websockets and the node http/https/https
packages, which for now makes it incompatible with popular frameworks like
Express.

Porting Curveball
-----------------

[Curveball][10] is a Typescript micro-framework we’ve been developing since
mid-2018 as a modern replacement for Express and Koa. A key difference between
Curveball and these two frameworks is that it fully abstracts and encapsulates
the core 'Request' and 'Response' objects Node provides.

This made it very easy to create a lambda integration in the past; instead of
mapping to Node's Request and Response types, All I needed was simple mapping
function for Lambdas idea of what a request and response looks like.

To get Express to run on AWS Lambda the Node `http` stack needs to be emulated, or
a full-blown HTTP/TCP server needs to be started and proxied to. Each of these
workarounds require a ton of code from libraries like [serverless-express][8].

So with Bun up and coming, either the same work would need to be done to emulate
Node's APIs, or Bun would would need to add full compability for the Node `http`
module (which is eventually coming).

But because Curveball abstractions, it was relatively easy to get up and running.
Most of the work was moving the Node-specific code into a new package.

Here's the Curveball 'hello world' on Bun:

```typescript
import { Application } from '@curveball/kernel';

const app = new Application();

// Add all your middlewares here! This should look familiar to Koa users.
app.use( ctx => {
  ctx.response.body = {msg: 'hello world!'}; 
});

export default {
  port: 3000,
  fetch: app.fetch.bind(app)
};
```

It's still a bit experimental, but the following middlewares are tested:

* [router](https://github.com/curveball/router)
* [controller](https://github.com/curveball/controller)
* [cors](https://github.com/curveball/cors)
* [accesslog](https://github.com/curveball/accesslog)
* [bodyparser](https://github.com/curveball/bodyparser)
* [validator](https://github.com/curveball/validator)

And because JSX also just works in Bun, it's relatively easy to use it to
generate HTML:

```typescript
import { Application } from '@curveball/kernel';
import reactMw from '@curveball/react';
import React from 'react';

const app = new Application();

app.use(reactMw());

app.use( ctx => {

  ctx.response.type = 'text/html; charset=utf-8';
  ctx.response.body = <html>
    <body>
      <div>
        <h1>Hello world!</h1>
      </div>
    </body>
  </html>;

});

export default {
  port: 3000,
  fetch: app.fetch.bind(app)
};
```

This is not a full-blown hydration/server-rendering solution, but JSX has
replaced template engines like EJS and Handlebars for us at
[Bad Gateway][11]. JSX lets you do the same things, but you get the advantage
of type checking, it's harder to create XSS bugs and full Javascript access.

Final thoughts on Bun
---------------------

Compared to Deno, It was considerably easier to port Curveball to Bun.
Deno was a much greater challenge, due to it having such a radically
different idea about packages and module loading. This was over a year
ago, so it's worth giving a shot again.

So, I'm curious where all of this goes! Perhaps Bun is the future, or
perhaps we'll see Node get parity with Bun and making it obsolete. Either
way competition is good.

I feel Bun has a better chance than Deno, because it delivers many of
its advantages and features while mostly staying inside with the Node
ecosystem.

Although as it turns out Deno also has changed their tune and also made
it [a new goal][9] to be compatible. I can't help wondering if this was
inspired by Bun's recent success as well.

[1]: https://bun.sh/
[2]: https://nodejs.org/
[3]: https://deno.land/
[4]: https://github.com/WebKit/WebKit/tree/main/Source/JavaScriptCore
[5]: https://v8.dev/
[6]: https://developer.mozilla.org/en-US/docs/Web/API/Request
[7]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[8]: https://curveballjs.org/ 
[7]: https://github.com/curveball/aws-lambda
[8]: https://github.com/vendia/serverless-express
[9]: https://deno.com/blog/changes
[10]: https://curveballjs.org/
[11]: https://badgateway.net/
