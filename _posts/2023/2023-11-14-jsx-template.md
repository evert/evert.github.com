---
title: "Using JSX on the server as a template engine"
date: "2023-11-14 12:10:55 UTC"
location: "Nijega, NL"
geo: [53.140006, 6.032090]
draft: true
tags:
    - jsx
    - ejs
    - node
    - templates
    - handlebars
    - mustache
    - javascript
    - typescript
---

The React/Next.js ecosystem is spinning out of control in magic and complexity.
The stack has failed to stay focused and simple, and it's my belief
that that software stacks that are too complex and magical must eventually fail,
because as sensibilities around software design change they will be unable to
adapt to those changes without abandonding their existing userbase.

So while React/Next.js may be relegated to the enterprise and legacy systems in
a few years, I believe [JSX][1] is set up to be it's own thing and it may be able to
avoid that fate.

I've been using JSX as a template engine to replace template engines like
[EJS][11] and [Handlebars][12], and more than once people were surprised this was
possible. I thought it might be nice to write some stuff down about this.

So in this article I'm digging into what JSX is, where it comes from and how one
might go about using it as a simple server-side HTML template engine.


What is JSX?
------------

JSX an extension to the Javascript language, and was introduced with React.
It usually has a `.jsx` extension and it needs to be compiled *to* Javascript.
Most build tools people already use, like ESbuild, Babel, Vite, etc. all
support this natively or through a plugin.
Typescript also natively supports it, so if you use Typescript you can just start
using it without adding another tool.

It looks like this:

```jsx
const foo = <div>
  <h1>Hello world!</h1>
  <p>Sup</p>
</div>;
```

As you can see here, some HTML is directly embbedded into Javascript, without
quotes. It's all syntax. It lets you use the full power of Javascript, such
as variables and loops:

```jsx
const user = 'Evert';
const todos = [
  'Wash clothes',
  'Do dishes',
];

const foo = <div>
  <h1>Hello {evert}</div>
  <ul>
    {todos.map( todo => <li>todo</li>)}
  </ul>
</div>;
```

It has a convention to treat tags that start with a lowercase character such
as `<h1>` as output, but if the tag starts with an uppercase character,
it's a component, which usually is represented by a function:

```jsx
function HelloWorldComponent(props) {

  return <h1>Hello <span>{props.name}</span></h1>

}

const foo = <section>
  <HelloWorldComponent name="Evert" />
</section>;
```

Anyway, if you're reading this you likely knew most of this but it's important
to state that this are all JSX features, not React.

#Inspo
------

JSX probably has it's roots in [E4X][2] (and more directly [XHP][4]). E4X was a
way to embed XML in Javascript. E4X has been supported in Firefox for years, and
was a part of ActionScript 3 onwards, but there's a major conceptual difference
between E4X and JSX.

With E4X you embed XML documents as data, similar to
defining a JSON object in a Javascript file. After defining the XML document
you can manipulate it. A fictional transpiler for E4X could (as far as I can
tell) just take the XML structure, turn it into a string and pass it to
[`DOMParser.parseFromString()`][3]. There's no variables, functions, components,
or logic. Similar to how a Regular expression is part of the JS language.

JSX is quite different. It's fully integrated in the language and it effectively
compiles down to nested function definitions. These functions are don't get turned
into HTML until they are called by [some render function][5]. Before this they are
defined but not evaluated.

So while E4X and JSX share that they both make XML/HTML first-class citizens
in the language, the goals and features are wildly different. JSX really is a
[DSL][19].

JSX Transpiled
--------------

Lets turn the previous example into Typescript, and see what Typescript does with
it:

```jsx
function HelloWorldComponent(props: { name: string }) {

  return <h1>Hello <span>{props.name}</span></h1>

}

const foo = <section>
  <HelloWorldComponent name="Evert" />
</section>;
```


By default, Typescript will turn it into this:


```javascript
function HelloWorldComponent(props) {
    return React.createElement("h1", null,
        "Hello ",
        React.createElement("span", null, props.name));
}
const foo = React.createElement("section", null,
    React.createElement(HelloWorldComponent, { name: "Evert" }));
```


Now, there's definitely a react dependency here, but in recent versions of
Typescript, we can configure it to use a different 'factory' for JSX. By
setting the [jsx][6] and [jsxFactory][7] settings in `tsconfig.json`, we
can get Typescript to output more generic code:

```javascript
function HelloWorldComponent(props) {
    return _jsxs("h1", { children: ["Hello ", _jsx("span", { children: props.name })] });
}
const foo = _jsx("section", { children: _jsx(HelloWorldComponent, { name: "Evert" }) });
```

So what's `_jsx`? This is a 'jsx factory' function that can be provided by
React, but also a number of other libraries such as [Preact][8] or
[Solid.js][9]. It's also relatively easy to [create your own][10].

What's interesting then about JSX is that while it's syntax, it's not
always clear what this yields:


```javascript
const foo = <h1>Sup!</h1>
```

Because what's in `foo` depends on what JSX Factory was used during
transpiling. This is frustrating because it requires out of band information
and external configuration, but also a benefit because it opens the doors
to alternative implementations.


Using JSX as a template engine
------------------------------

When generating HTML on the server with Node, it's pretty common to use
template engines such as [EJS][11] or [Handlebars][12]. When building a
new (multi-page) web application, it occured to me that neither are quit
as good as JSX.

JSX has deep IDE integration because it's syntax and not strings. It also
has native Typescript support, enforces correct nesting and by default
correctly escapes output (for security).

This had me wonder, can keep standard server-side microframeworks such
as [Koa][13], [Fastify][14] or [Express][15] but instead of string-based
template parsers and get all the benefits of JSX?

Turns out the answer is, yes! It's not only pretty simple to implement,
it works exceedingly well.

I've implemented this pattern 3 times now for different frameworks, here's
some sample code that works:

### Koa

Here's an example of a small controller:

```typescript
import Router from 'koa-router';

const router = new Router();

router.get('/foo.html', ctx => {

  ctx.response.body = <h1>Hello world with JSX in Koa!</h1>;

});
```

As you can see here we can set JSX straight on the body property. A middelware
ensures this gets tranformed into HTML.

### Fastify

Similar to Koa, we can use JSX instead where otherwise HTML strings would be
used:

```typescript
import { FastifyInstance } from 'fastify'

export function routes(fastify: FastifyInstance) {

  fastify.get('/hello-world', request => <h1>Sup Fastify!</h1>);

}
```

How does this magic work?
-------------------------

For both of these I used the React library. Despite it's ecosystem being
rather bulky, a standalone React library is still pretty lean.

For both of these frameworks, I simply created a middleware that checks if
the body is a React node, and if so use React's  [renderToStaticMarkup][16] to do
the transformation before the response is sent.

### Koa middleware

```typescript
import { renderToStaticMarkup } from 'react-dom/server';
import { isValidElement } from 'react';
import { Context, Middleware, Next } from 'koa';

export const jsx: Middleware = async(ctx: Context, next: Next) => {

  await next();

  if (isValidElement(ctx.response.body)) {
    ctx.response.body = '<!DOCTYPE html>\n' + renderToStaticMarkup(
      ctx.response.body
    );
    ctx.response.type = 'text/html; charset=utf-8';
  }

};
```

This is how it's used:

```typescript
const application = new Koa();
application.use(jsx);
```

### Fastify hooks

This one needed a few more hacks, but the result is worth it:

```typescript
import { onSendHookHandler, preSerializationHookHandler } from 'fastify';
import { isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * The preserialization hook lets us transform the response body
 * before it's json-encoded.
 *
 * We use this to turn React components into an object with a ___jsx key
 * that has the serialized HTML.
 */
export const preSerialization: preSerializationHookHandler<unknown> = async (_request, reply, payload: unknown) => {

  if (isValidElement(payload)) {
    reply.header('Content-Type', 'text/html');
    return {
      ___jsx: '<!DOCTYPE html>\n' + renderToStaticMarkup(payload as any)
    };
  } else {
    return payload;
  }

};

/**
 * The onSendHookHandler lets us transform the response body (as a string)
 * We detect the ___jsx key and unwrap the HTML.
 */
export const onSend: onSendHookHandler<unknown> = async (_request, _reply, payload: unknown) => {

  if (typeof payload==='string' && payload.startsWith('{"___jsx":"')) {
    return JSON.parse(payload).___jsx;
  }
  return payload;

};
```

To use the hook:

```typescript
const fastify = Fastify();

// These 2 hooks allow us to render React/jsx tags straight to HTML
fastify.addHook('preSerialization', jsxRender.preSerialization);
fastify.addHook('onSend', jsxRender.onSend);
```

Limitations to this approach
----------------------------

Users of React and other frameworks may be used to pulling in data
asynchronously and updating their document. This approach only allows
for a single pass, so this means that all dynamic data to your JSX
templates needs to be fetched in advanced and passed down as props.

This means no hooks or state.

To me this is an advantage because the paradigm it replaces is regular
templates, and with those the data is typically also passed in 'at the
top'.

It would certainly be possible to implement Suspend and allow for
asynchronous data fetching or wait for other singles, but this is a
choice I have not made.

Frequently asked question: How do you do routes?
------------------------------------------------

The short answer is: you don't. Routing is already handled by your
framework, and each route/endpoint/controller is responsible for rendering
it's entire page.

To re-use things like the global layout, you use components. A slightly
fictionalized example of a page for us looks like this:


```typescript
ctx.body = <PublicLayout>

  <div>
    <h1>Welcome back!</h1>
  </div>
  <form method="post" action="/login">

    <label>
      <span>Email</span>
      <input type="email" name="email" required minLength={10} />
    </label>
    <label>
      <span>Password</span>
      <input type="password" name="password" required minLength={4} />
    </label>
    <button type="submit">Log In</button>

  </form>
</PublicLayout>;
```

This in effect 'inherits' from `PublicLayout`, which looks like this:

```typescript
type Props = {
  children: JSX.Element[]|JSX.Element;
  className: string;
}

/**
 * This is the main application wrapper, shared by all HTML pages.
 */
export function PublicLayout(props: Props) {

  return <html>
    <head>
      <title>Sprout Family</title>
      <link href="/css/main.css" rel="stylesheet" type="text/css" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script src="/js/utils.js"></script>
    </head>
    <body className={props.className}>
      { props.children }
    </body>

  </html>;

}
```

Anyway
------

Hope this was interesting. If there's interest in turning my Koa and Fastify
code into real NPM packages, let me know! Happy to do it if there's a non-0
number of users.

You can respond to this post by replying to this [Mastodon post][18].


[1]: https://en.wikipedia.org/wiki/JSX_(JavaScript)
[2]: https://en.wikipedia.org/wiki/ECMAScript_for_XML
[3]: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString
[4]: https://docs.hhvm.com/hack/XHP/introduction
[5]: https://legacy.reactjs.org/docs/rendering-elements.html#rendering-an-element-into-the-dom "Rendering an Element into the DOM"
[6]: https://www.typescriptlang.org/tsconfig#jsx
[7]: https://www.typescriptlang.org/tsconfig#jsxFactory
[8]: https://preactjs.com/
[9]: https://www.solidjs.com/
[10]: https://lwebapp.com/en/post/custom-jsx "Custom JSX Factory Function"
[11]: https://ejs.co/
[12]: https://handlebarsjs.com/
[13]: https://koajs.com/
[14]: https://fastify.dev/
[15]: https://expressjs.com/
[16]: https://react.dev/reference/react-dom/server/renderToStaticMarkup
[17]: https://indieweb.social/@evert
[18]: about:blank
[19]: https://en.wikipedia.org/wiki/Domain-specific_language
