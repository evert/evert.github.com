---
title: "Building awaitable and fluent interfaces in javascript"
date: "2019-10-28 23:06:14 UTC"
tags:
  - javascript
  - promise
  - typescript
  - async
---

Most of the Javascript code I write heavily depends on promises and
async/await.

One of the issues I ran into, is that I would like to offer users of my
library a fluent interface, but do so with async/await.

To give an example, consider the following function:

```javascript
async function getArticles() {
  const response = await fetch('https://api.example.org');
  const json = await response.json();
  return json;
}
```

A user of this function might call this function as follows:

```javascript
const articles = await getArticles();
```

I wanted to give users the ability to add custom HTTP headers to this call.

The easy way to do this would simply be to add an optional `headers` argument
to `getArticles()`. In most cases this is probably the right choice.

In my case though, HTTP headers is not the only optional someone might need,
and I didn't want to change the interface to become incredibly complicated.

What I really wanted is a fluent interface, and specifically the ability
to call the function in the following 2 ways:

```javascript
const articles = await getArticles();
const articles = await getArticles().withHeader('X-Foo', 'Bar');
```

This was a bit of a rabbithole, and it took me a while to figure out how I can
make this work. I thought I would share it here for the benefit of others.

I needed to figure out how to return something from that function that behaves
like a promise, but also can have custom functions added to it.

As it turns out, objects don't need to be a global `Promise` object to be
usable with promises or async/await. All they need is a `then()` function
that behaves the same as a Promise's then function.

I finally landed on this solution:

```javascript
class HeaderPromise {

  constructor(uri) {

    this.uri = uri;
    this.headers = {};

  }

  withHeader(key, value) {

    this.headers[key] = value;
    return this;

  }

  then(onResolved, onRejected) {
    return this.getInnerPromise().then(onResolved, onRejected);
  }

  getInnerPromise() {
    if (!this.innerPromise) {
      this.innerPromise = (async() => {
        const response = await fetch(this.uri, {
          headers: this.headers
        });
        const json = await response.text();
        return json;
      })();
    }
    return this.innerPromise;

  }

}

function getArticles() {

  return new HeaderPromise('https://api.example/');

}
```

The changes I made was that `getArticles` is no longer `async`, but it returns
an object that `await` will treat as a `Promise`.

Lets go over each class function:


```javascript
  constructor(uri) {

    this.uri = uri;
    this.headers = {};

  }
```

We need to pass all the relevant information to the constructor. This means
that if you want to provide an API like this, it might mean that for every
single API function that returns a fluent-promise interface, it might need
a custom class.

```javascript
  withHeader(key, value) {

    this.headers[key] = value;
    return this;

  }
```

`withHeader` updates the list of headers, and to make sure it's fluent,
it always returns itself.

This allows this function to be called multiple times, and eventually
allows the promise-like object to be awaited.


```javascript
  then(onResolved, onRejected) {
    return this.getInnerPromise().then(onResolved, onRejected);
  }
```

The `then` function does all the 'promise work'. It really just delegates
its functionality to a real promise, instead of implementing all the promise
logic (which is hard!).

```javascript
  getInnerPromise() {
    if (!this.innerPromise) {
      this.innerPromise = (async() => {
        const response = await fetch(this.uri, {
          headers: this.headers
        });
        const json = await response.text();
        return json;
      })();
    }
    return this.innerPromise;

  }
```

`getInnerPromise` is the function that does all the work. An important nuance
is that if it's called multiple times, it will only do the work once.

This is important, because if you call `then()` on a promise twice, it
shouldn't do the work twice. After the promise does the work, it should store
its result and return it for future uses of `then()`.

Anyway, that's it! This is _complicated_ and my general advice would be to
avoid this pattern until you can't.

Using this pattern will make your implementation much more complicated, but
the potential benefit is a nicer interface. Interface is more important than
implementation, but there's a line... be careful to not exceed it.

### Typescript

Lastly, here's the Typescript equivalent

```typescript
class HeaderPromise<T> implements PromiseLike<T> {

  uri: string;
  headers: { [key: string]: string };
  innerPromise: Promise<T>;

  constructor(uri: string) {

    this.uri = uri;
    this.headers = {};

  }

  withHeader(key: string, value: string): this {

    this.headers[key] = value;
    return this;

  }
  
  then<TResult1 = any, TResult2 = never>(onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
    return this.getInnerPromise().then(onfulfilled, onrejected);
  }

  getInnerPromise() {
    if (!this.innerPromise) {
      this.innerPromise = (async() => {
        const response = await fetch(this.uri, {
          headers: this.headers
        });
        const json = await response.json();
        return json;
      })();
    }
    return this.innerPromise;

  }

}



function getArticles(): HeaderPromise<any> {

  return new HeaderPromise('https://api.example/');

}
```
