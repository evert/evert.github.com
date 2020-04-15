---
title: "A generic middleware pattern in Typescript"
date: "2020-04-15 16:00:00 UTC"
tags:
  - javascript
  - node
  - middleware
  - typescript
geo: [43.660773, -79.429926]
location: "Bloor St W, Toronto, Canada"
---

I just realized this is the third time I'm writing async middleware invoker,
I thought I would share the generic pattern for the benefit of others.

I'm not sure if this is interesting enough for a NPM package, so I'll leave
it here for inspiration.

The specific middleware pattern I am implementing, is similar to Express,
Koa or [Curveball][1].

We're working off a `context`, and we are running a chain of middlewares
in order with this context as an argument.

We're also passing an `next` function. If this `next` function is called,
the next middleware in the list will be called. If not, the chain will be
broken.

Furthermore, (unlike Express, but like Koa) middlewares can be `async`
function or return a promise. If it is, we want to await it.

The setup
---------

Lets start with the setup, describing the middleware:

```typescript
/**
 * 'next' function, passed to a middleware
 */
type Next = () => void | Promise<void>;

/**
 * A middleware
 */
type Middleware<T> =
  (context: T, next: Next) => Promise<void> | void;
```

`Middleware` is the actual async/non-async middleware function. I made a
type for `Next` so I don't need to write it out more than once.


How we want to use it
---------------------

This would be the 'getting started' section of the documentation.

The idea here is that we have an 'app', a set of middlewares and a context
we want to operate on.

The following code would be written by the user of this framework:

```typescript
/**
 * The context type of the application.
 *
 * In 'koa' this object would hold a reference to the 'request' and 'response'
 * But our context just has a single property.
 */
type MyContext = {
  a: number;
}

/**
 * Creating the application object
 */
const app = new MwDispatcher<MyContext>();

/**
 * A middleware
 */
app.use((context: MyContext, next: Next) => {

  context.a += 1;
  return next();

});

/**
 * An async middleware
 */
app.use(async (context: MyContext, next: Next) => {

  // wait 2 seconds
  await new Promise(res => setTimeout(res, 2000));
  context.a += 2;
  return next();

});
```

Running this application
------------------------

```typescript
const context: MyContext = {
  a: 0,
}

await app.dispatch(context);
console.log(context.a); // should emit 3
```

The implementation
-------------------

Making this all work is surprisingly terse: 


```typescript
/**
 * A middleware container and invoker
 */ 
class MwDispatcher<T> {

  middlewares: Middleware<T>[];

  constructor() {
    this.middlewares = [];
  }

  /**
   * Add a middleware function.
   */
  use(...mw: Middleware<T>[]): void {

    this.middlewares.push(...mw);

  }

  /**
   * Execute the chain of middlewares, in the order they were added on a
   * given Context. 
   */
  dispatch(context: T): Promise<void> {
     return invokeMiddlewares(context, this.middlewares)
  }

}

/**
 * Helper function for invoking a chain of middlewares on a context.
 */
async function invokeMiddlewares<T>(context: T, middlewares: Middleware<T>[]): Promise<void> {

  if (!middlewares.length) return;

  const mw = middlewares[0];

  return mw(context, async () => {
    await invokeMiddlewares(context, middlewares.slice(1));
  })

}
```

[1]: https://curveballjs.org/
