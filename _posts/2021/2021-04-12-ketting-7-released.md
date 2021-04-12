---
title: "Ketting 7 released"
date: "2021-04-12 16:30:00 UTC"
tags:
  - ketting
  - hypermedia
  - rest
  - http
  - typescript
  - hateoas
cover_image: https://evertpot.com/assets/cover/ketting.png
---

We just released version 7 of [Ketting][1]. Ketting is a generic HATEOAS
client for Javascript.

A whole bunch of features have been added since September. We've been
testing Ketting 7 in beta since January, so I'm excited to get this out
the door.

I've been working on this project since 2016. Normally, I would expect a
project like this to get a little stale. For me personally, the opposite
has been true and using Ketting (especially with React) is starting to feel
a bit like a paradigm shift.

Read on to see what's new!

What is Ketting?
----------------


In short: Ketting is a generic REST client for Javascript. You can use it for
pushing JSON objects via HTTP, but the richer your API is in terms of best
practices and standard formats, the more it can automatically do for you.

It has support for Hypermedia formats such as HAL, Siren, Collection+JSON,
JSON:API and can even understand and follow links from HTML.

In the past it was not uncommon to hear that HATEOAS is lacking a good generic
client. If you are a Javascript/Typescript user this is no longer true.

More information can be found on the [Github][1] page.


What's new?
-----------

### Better HAL-Forms support

[HAL-Forms][5] is an extension of [HAL][6], and adds support for 'actions' or
'forms', similar to what the `<form>` tag is to HTML.

Since the start of the year HAL-Forms has seen major updates, which was a
collaborative effort by several people from projects in the HAL community
(including [Spring HATEOAS][8] and yours truly) and lead by it's author
[Mike Amudsen][7].

Spring HATEOAS [released][9] its HAL-Forms updates in version 1.3 M2 (unclear
if this is a stable release or not), and Ketting follows today.

Major new features in HAL-Forms include:

* Support for lookups
  * Example use-case is rendering dropdowns/comboboxes.
  * The list of possible options can either be provided in-line or via an
    external resource.
  * JSON and `text/csv` is support for external resources.
* Support for most of the HTML5 input types, such as `checkbox`, `color`,
  `tel`, `email`, `textarea`, etc.
* Support for many of the field attributes that also exist in HTML5 form
  fields, such as `placeholder`, `min`, `max`, `step`, `cols`, `rows`, and
  others.
* Support for a form `target`. Previously this could also be supplied via
  the URI.
* Support for multiple forms per document.

### React bindings: `<RequireLogin>`

(note: all of the new react-ketting features were backported to Ketting 6)

[react-ketting][12] now has a `RequireLogin` component, that can be use to handle
the OAuth2 `authorization_code` flow in React applications.

Example usage:

```typescript
function MyApp() {

  return <RequireLogin
    clientId="my-oauth2-client-id"
    authorizeEndpoint="https://..."
    tokenEndpoint="https://..">

    You are now logged in!
  </RequireLogin>;

}
```

### React-bindings: `useCollection`

A `useCollection` hook was added to easily render a collection on a server.

Example usage:

```typescript
import { useCollection, useResource } from 'react-ketting';
import { Resource } from 'resource';

type Article = {
  title: string;
  body: string;
}

function ArticleList() {

  const { loading, items } = useCollection<Article>('/articles');

  if (loading) return <div>Loading...</div>;

  return <section>
    <h1>Articles!</h1>

    {items.map( item => <ArticleItem key={item.uri} resource={item} /> ) }
  </section>;

}

function ArticleItem({resource}: { resource: Resource<Article> }) {

  const { loading, data } = useResource(resource);

  if (loading) return <div>Loading...</div>;

  return <div>
    <h2>{data.title}</h2>
    <p>{data.body}
  </div>

}
```

### React-bindings: `refreshOnStale`

Both `useResource` and `useCollection` got a `refreshOnStale` flag, that will
cause Ketting to automatically ask the server for a new resource state if the
cache is marked stale for a resource.

This can have a pretty magical effect when you (for example) use a `POST`
request on a collection to add a new member.

If you also used a `useCollection` hook on the same page to show the
collection, that collection will automatically refresh it's own list.

The _first_ fetch of `useCollection` will include a `Prefer-Transclude` HTTP
header, telling the user to (ideally) embed every item of the collection in
the response, but subsequent refreshes will not.

This means the first time we only need 1 HTTP request, but for refreshes
only the collection itself (and not it's members) need to be returned.

If your 'create' operation also returned `Content-Location`, you can remove
one more HTTP request from that list.

Similarly this can be used for `DELETE` requests of members of the collection,
as long as your response includes `Link: </parent-collection>; rel="invalidates"`,
the collection will also automatically re-render with the deleted item removed.

For one application we took this a step further, and used Websockets to emit
'stale' events from the server. With virtually no modifications to the frontend,
we were able to turn a single-user web application into an application that
could reflect changes in real-time from other users who were using the
application at the same time. This really felt like an emerging property of
a well designed system (standing on the shoulders of decades of Hypermedia,
HTTP and REST research).

Personally I'm very hyped about this feature, and I can't wait to demo this
on a meetups or a conferences (if my talk proposals ever get accepted!?).


### Deprecation warnings

Ketting 7 will now emit warnings when it encounters a `Deprecation` or `Sunset`
header, or when a link contains the `status: "deprecated"` hint.

For more information about this feature, read [my previous article][10] about
this feature.

### Removed support for Prefer-Push

HTTP/2 Push support in browsers is [effectively dead][11]. To reduce drag,
I've removed the `Prefer-Push` feature from Ketting.

### Smarter caching of newly created resoures.

If you use Ketting to create a new resource (for example with `POST`), and
the server returns a `Content-Location` header in its response, it will
store the response body with the new URI in it's cache.

This can potentially reduce roundtrips. `Content-Location` is a way for a
server to say: 'The response body is the representation of the resource
this URI'.

This is another great example of a HTTP caching feature in Ketting that goes
beyond what Web Browsers typically do.

Other examples of this is being able to tease apart transcluded/embedded
responses, allowing servers to invalidate caches for entries with an
`invalidates` link and exposing cache-related events to the user.

### `State` objects now have a `.follow()` and `.followAll()` function.

A `State` object is returned when you (for example) call `resource.get()`,
`resource.patch()`, etc.

This object represents an 'Entity' or 'State' returned from the server, which
really is a fancy way of saying 'the body' + headers that directly pertain
to the body.

It also provides direct access to hypermedia features such as links and
actions. The new addition lets you follow hypermedia links straight from
any HTTP response.

```typescript
const response = await myResource.post({
  data: {
     param1: 'value1'
  }
});

// If response contained a HAL, Siren, HTML link or HTTP Link header,
// we can follow it!
const newResource = response.follow('more-info');
```


Upgrading
---------

Upgrading should be relatively pain-free for most users, except if you extend
Ketting with custom format parsers.

If you run:

```
npm i ketting@7
npm i react-ketting@2 # React users only
```

And typescript _doesn't_ complain, chances are that everything will work just
as before.

Ketting 7 has been in development and used by us in production since January.


Future plans
----------------

Long-term Ketting plans include

* Better documentation and educational resources.
* More React support, including a library of components for automatically
  rendering Hypermedia Forms/Actions and automatic paging of collections.
* Bindings to other frontend-frameworks.
* An official Websocket add-on, to enable real-time multiuser collaboration and
  bi-direction state updates.


[1]: https://github.com/badgateway/ketting/
[2]: https://tools.ietf.org/html/draft-cedik-deprecation-header
[3]: https://tools.ietf.org/html/draft-nottingham-link-hint-02 HTTP Link Hints
[4]: https://evertpot.com/ketting-6/
[5]: http://rwcbook.github.io/hal-forms/
[6]: https://tools.ietf.org/html/draft-kelly-json-hal-08
[7]: https://twitter.com/mamund
[8]: https://spring.io/projects/spring-hateoas "Spring HATEOAS"
[9]: https://spring.io/blog/2021/02/19/spring-hateoas-1-3-m2-released "Spring HATEOAS 1.3 M2 released"
[10]: https://evertpot.com/ketting-7-deprecation-warnings/ "Ketting support for deprecation warnings"
[11]: https://evertpot.com/http-2-push-is-dead/
[12]: https://github.com/badgateway/react-ketting
