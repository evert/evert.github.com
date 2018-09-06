---
title: "Curveball - a TypeScript micro-framework"
date: 2018-09-06 16:00:00 +0200
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
location: Nijega, NL
---

I’ve been doing Node.js development for a little while, and I wanted to try my hand at writing a framework. It’s probably a rite of passage to do this, although it’s not really my first.

By releasing it today, I want to see if this is worth investing time in in the future, or if I should focus my energy elsewhere.

The project is called Curveball, and these are it’s differentiating features:

Project goals
-------------

I'm a big fan of micro-frameworks. [Express][1] was great when it came out, but
it now feels a little dated. [Koa][2] was written by the team behind express.
Koa makes a lot more sense in codebases that are Promise-, rather than
callback-oriented, and that's not the only improvement. The team waited with
releasing a stable version, until the very moment Node.js released a stable
`async`/`await` support.

I would recommend everyone to check it out. I doubt you'll want to go back to
Express after using Koa for a bit.

Koa has been my framework of choice for a while, but there were a few things I
would have liked. I thought it would be an interesting to to write something
that checks those boxes.

1. Curveball is a very minimal, like Koa.
2. It largely follows Koa architecture and API design, with some subtle
   changes. Middlewares will look very familiar.
3. It's completely written in Typescript.
4. It embraces modern HTTP features, it has built-in support for HTTP/2 Push,
   and `103 Early Hints` and integrates these in a way that feel like they are
   a native part of the framework.
5. It's easy to do 'mock' HTTP requests inside the framework, without having to go
   through a real HTTP stack.

Points 3-5 are something I missed from other frameworks I've looked at, and why
I think it might be useful to others.

Some examples:

### Hello world

```typescript
import { Application, Context } from '@curveball/core';

const app = new Application();
app.use((ctx: Context) => {

  ctx.response.body = 'Hello world! You used the following HTTP method: '  + ctx.request.method;

});
app.listen(4000);
```

### A router

```typescript
import { Application } from '@curveball/core';
import router from '@curveball/router';

app.use(router('/contact', ctx => {

  ctx.response.body = 'Contact us!';

});
app.listen(4000);
```

### HTTP/2 Push

Whenever you have access to the `Context` object, you can also push. Push will
be ignored for HTTP/1 connectinons.

```typescript
app.use(ctx => async {

  ctx.response.body = 'Hello world!'
  await ctx.response.push( pushCtx => {

    // This function is not called unless the client indicated they support
    // push.
    // You get a special Context object that has a request and response.
    pushCtx.request.path = '/assets/foo.css';
    pushCtx.response.type = 'text/css';
    pushCtx.response.body =  'body { background: blue; }';

  });

});
```

The above example allows you to programatically generate pushes, which allows you to
make certain optimizations that are hard to do with HTTP/2 push implementations that
are based on intercepting the `Link:` header.

However, if you want to push a request and response that goes through the entire
middleware stack, you can do that with a sub-request:

```typescript
app.use(ctx => async {

  ctx.response.body = 'Hello world!'
  await ctx.response.push( pushCtx => {

    pushCtx.request.path = '/assets/foo.css';
    // Handle does an internal sub request and calls every middleware.
    return app.handle(pushCtx);

  });

});
```

### Sending a 103 Early Hints response

```typescript
app.use(ctx => async {

  ctx.response.body = 'Hello world!'
  ctx.response.sendInformational(103, {
    'Link' : [
      '</style.css> rel="prefetch" as="style"',
      '</script.js> rel="prefetch" as="script"',
    ]
  });

});
```

### Middleware upgrades

If you're coming from Express, you're also getting all the benefits that Koa
would have given you too. So this is not really a selling point for just
Curveball.

Try to write the following middleware with express:

```typescript
app.use( async (ctx, next) => {

  // Let the entire middleware stack run
  await next();
  
  // HTML encode JSON responses if the client was a browser.
  if (ctx.accepts('text/html') && ctx.response.type ==== 'application/json') {
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>JSON source</h1><pre>' + JSON.stringify(ctx.response.body) + '</pre>';
  }

});
```

Where to get Curveball
----------------------

You can find it on [Github project page][3].

What can I do?
--------------

If I'm the only user, the project is dead in the water and I'll probably stop
working on it and convert my projects back to Koa.

If you think this is worth maintaining, I would love to know. [DM me on
twitter][4], or write me an email!

If you're interested in helping, there's lots to do. I would love to not be
the single point of failure.

Thanks for making it all the way to the bottom!

[1]: https://expressjs.com/
[2]: https://koajs.com/
[3]: http://github.com/curveballjs/core
[4]: https://twitter.com/evertp
