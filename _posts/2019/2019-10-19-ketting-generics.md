---
title: "Better typing with Ketting"
date: "2019-10-21 13:26:46 UTC"
tags:
  - ketting
  - rest
  - hypermedia
  - typescript
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

[Ketting][1] is a generic hypermedia client that supports HAL, HTML, JSON-API,
and HTTP Links (and soon also [Siren][2]).

Version 5 is currently in development, and one of the major new features is
much deeper support for Typescript typing.

Here's how it works.

Normally to get to a resource, you start with a bookmark and follow links
(by `rel`), and perform some http method on them:

```typescript
import Ketting from 'ketting';

const bookmark = 'https://api.example.org/home';
const ketting = new Ketting(bookmark);

const authorResource = await ketting
  .follow('article')
  .follow('item')
  .follow('author');

const authorBody = await authorResource.get();
console.log(authorBody);
```

In this example, the Typescript type for `authorResource` is `Resource<any>`,
and `authorBody` is `any`.

If you know what the shape of the object is that you're receiving via `GET`,
you can specify this on the relevant `follow()` function:

```typescript
type Author = {
  firstName: string,
  lastName: string,
};

// Will have type Resource<Author>
const authorResource = await ketting
  .follow('article')
  .follow('item')
  .follow<Author>('author');

// Will have type Author
const author = await author.get();
```

This same feature also exists on other functions that return resources.

```typescript
// Returns Resource<Author>[] 
const resources = await resource.followAll<Author>('item');

// Returns Resource<Author>
const resource = await recource.go<Author>('?relative-link');
```

Furthermore, once a resource is typed, it has a few more effects. It also
causes the `put()` request to require the same type:

```typescript
// Throws error due to missing 'lastName'.
authorResource.put({
  firstName: 'Foo',
});
```

It also assumes that the type for the `patch()` method is `Partial<Author>`,
meaning that the assumption is that the HTTP Patch method takes a a JSON
object that's a subset of 'Author'.

Not every API will take that approach with Patch, so it's also always possible
to override the type for patch.

```typescript
type Author = {
  // ...
};

type SomeFancyPatchFormat = {
  // ...
};

const res:Resource<Author, SomeFancyPatchFormat> = await otherRes.follow('...');
```

Lastly, if your API creates new resources with `POST`, and the server returns
`201 Created` and a `Location` header, the `post()` function returns a resource
of the same type.

```typescript

const authorCollection = await res.follow('author-collection');

const newAuthor:Author = {
  firstName: 'Ursula',
  lastName: 'Le Guin',
};

const newAuthorResource = await authorCollection.post(newAuthor);

// newAuthorResource will now be typed as Resource<Author>
```

This feature does not have stable release, but you can the alpha now:

    npm i ketting@5.0.0.alpha.0

If you have any feedback, let us know via a [Github Issue][3].

[1]: https://github.com/evert/ketting
[2]: https://github.com/kevinswiber/siren
[3]: https://github.com/evert/ketting/issues
