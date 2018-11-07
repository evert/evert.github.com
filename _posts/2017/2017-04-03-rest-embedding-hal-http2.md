---
date: 2017-04-03 10:19:25 -0400
layout: post
title: "The problems with embedding in REST today and how it might be solved with HTTP/2"
tags:
   - rest
   - hypermedia
   - hal
   - http
   - http2
   - api
   - featured
location: "Stafford St, Toronto, ON, CA"
geo: [43.643724, -79.411468]
---

When looking at REST, the underlying theory, and various interpretations and
even HTTP, you'll find that REST is about singular resources and transferring
state of those resources.

There's very little supporting information about the concept of a collection
of resources. Almost every REST API out there will have a need for them, but
there doesn't seem to be a clear definition for them, or an accepted way to
technically handle them.

[Fielding's dissertation on REST says:][1]

> The key abstraction of information in REST is a resource. Any information
> that can be named can be a resource: a document or image, a temporal service
> (e.g. "today's weather in Los Angeles"), a collection of other resources, a
> non-virtual object (e.g. a person), and so on. In other words, any concept
> that might be the target of an author's hypertext reference must fit within
> the definition of a resource. A resource is a conceptual mapping to a set of
> entities, not the entity that corresponds to the mapping at any particular
> point in time. 

This paragraph is the only place where the word 'collection' appears, and it
basically says that it's just another resource. This is good, because it tells
us that collections are not a separate concept from other resources and should
abide by the same constraints. 

However, REST gives us an architecture, we still have to impose our own further
contstraints and meaning on top of it. So how do we treat a collection of
resources?

Well, when you look at any of the common hypermedia formats, you'll find that
each of them has a slightly different idea about it. However, each of these
formats tends to have something in common: they treat items in a collection as
a sort of 'sub-resource' inside a 'resource'.


What is a collection, really?
-----------------------------

Before we go into some examples, I think it's worthwhile to discuss this. A
collection is a set of resources. Resources may 'belong' to a collection in
some cases, but resources may also appear in multiple collections.

For example, if my REST API represents blog posts, the same article may appear
in a collection that represents all posts from 2017, and all posts written
by me.

You might think of a collection as a database table, but I kind of think that
that's not the right analogy. I think a collection is more like a directory
on a modern filesystem. The filesystem directory only contains links to files
and their position on the filesystem (inode). You could say that a directory
has references to files, but you can't really say that a directory IS a
collection of those files.

Files can appear in multiple directories using hardlinks too.

So knowning that, we can translate this to REST terms. A collection is a set
of hyperlinks to other resources.

If you're using [HAL][2], you can express this using:

```json
{
  "_links" : {
     "self" : { "href" : "/articles/byyear/2017" },
     "item" : [
        { "href" : "/articles/1" },
        { "href" : "/articles/2" },
        { "href" : "/articles/3" }
     ]
  }
}
```

There you have it. In HAL the top-level property names in the `_links` object
are [link relations][3], and the `item` link relation was standardized by
[Mike Amundsen][4] as [RFC6573][5].


This is great, but unpractical
------------------------------

The problem with the linked approach is that very often, a REST client will
want to receive the details of every item in a collection. In the last example
this would mean an extra HTTP GET request for each of the items in the
collection.

This is not acceptable for many real-world REST services out there, so we need
a solution. HAL (and virtually every other hypermedia format) solves this by
embedding the resources in the collection. 

To demonstrate, here is the same collection again.


```json
{
  "_links" : {
     "self" : { "href" : "/articles/byyear/2017" }
  },
  "_embedded" : {
     "item" : [
        { 
            "_links" : {
              "self" : { "href" : "/articles/1" }
            },

            "title" : "..",
            "pubDate" : "..",
            "content" : ".."
        },
        { 
            "_links" : {
              "self" : { "href" : "/articles/2" }
            },

            "title" : "..",
            "pubDate" : "..",
            "content" : ".."
        },
        { 
            "_links" : {
              "self" : { "href" : "/articles/3" }
            },

            "title" : "..",
            "pubDate" : "..",
            "content" : ".."
        }
     ]

  }
}
```

Two things happened here. Each individual item in the collection now appears
in `_embedded`. They have their own sets of links, including a `self` link,
referring to the uri of the resource we just embedded. We also removed the
items from `_links`.

The way we look at `_embedded` is that things that appear in `_embedded` are:

* Link relations, equal to items appearing in `_links`.
* The data you _would_ receive, if you did a `GET` request on the target of
  the link.

This is important, because a good HAL-based REST client should ideally
consider things appearing in `_embedded` and `_links` as the exact same thing.
The only difference is that because an item appears in `_embedded`, it's no
longer needed to perform that `GET` request. The client should cache it.

If a client is built around this core concept, another benefit is that the
client becomes adaptable to changes to the server. You might for example see
over time that a HAL client very often might follow a certain link and almost
always will want the data for it.


### An example

Here's a real-world example from our API. Our API has a document on the root
of the API that the client uses to discover all the other resources. It
contains a link to a resource that has information about the current user:

```json
{
  "_links" : {
     "self" : { "href" : "/" },
     "current-user" : { "href" : "/user/1356" },
     "support" : { "href": "mailto:support@example.org" }
  }
}
```

We noticed that all clients _always_ request the current users' information
after logging in. It always follows up this initial `GET` to a `GET` to
whatever the `current-user` relation points at.

Knowing this, we can change our API to simply assume this and
pre-emptively send that resource over:


```json
{
  "_links" : {
     "self" : { "href" : "/" },
     "support" : { "href": "mailto:support@example.org" }
  },
  "_embedded" : {
     "current-user" : {
        "_links" : {
            "self" : { "href" : "/user/1356" }
        },
        "firstName" : "...",
        "lastName" : "...",
        "email" : "..."
     }
  }
}
```

A good HAL client would need 0 changes, and simply adapt to this new situation
and skip the second GET request.


A few problems with this
------------------------

One of the biggest advantages and promises that REST typically gives us, is
by using the functionality HTTP, we get all the benefits from HTTP. The usual
example of this is being able to use the rich caching features from HTTP.

However, HTTP caches will not be aware of embedded resources. In the last
example, the cache doesn't know that `/user/1356` was embedded and cached, and
it does not know it can skip a future `GET` request to that resource.

Also, if we did a real cached `GET` request, but later on we issue a `PUT` on
that same resource, a HTTP client 'knows' that since a `PUT` was issued, the
local cache is no longer valid.

So typically, a HAL client that wants to be adaptable to this needs it's own
cache. What we'll ideally want to do, is something like this (in
pseudo-code)

```js
var api = new API('/'); // Referring to the root.
var currentUserResource = await api.follow('current-user');
console.log(await currentUserResource.get());
```

I hope the source makes some sense, but the general idea is that once we
'follow' the `current-user` link and get its representation, we only need the
extra `GET` request, if it wasn't embedded. This should be a seamless
experience.

To implement this in browsers today, it means that the API client will need
to:

* Understand `_embedded`
* Take items from `_embedded`, treat them the same as links
* Store them into a some kind of local cache.
* Use that local cache when the user wants to do a `GET` request.
* Invalidate that local cache when `PUT`, `DELETE` or another non-safe HTTP
  request is issued on that same resource.

So while we can still use HTTP semantics, we now have two caching layers which
may conflict.


Fetch: A future solution to this problem
----------------------------------------

The [Fetch API][6] is the future of doing HTTP requests in browsers. It's a
much nicer api than XMLHTTPRequest, but also has another really cool feature:
Once it lands it gives us direct access to the browsers' HTTP cache.

The specific thing to look for is [Cache.put()][7]. This API should allow us to
directly add things to the browser cache. A HAL client in this case could parse
out everything that appears in `_embedded` and directly add it to this cache.

A future `GET` request will then simply directly be taken from this cache, and
the `GET` request is avoided. This is huge.

What's interesting about this API is that it does not just take a URL and the
thing you want to store, you actually store a HTTP request and a HTTP response.

This is important, because a HTTP cache is not just URL-based. A single `GET`
request to a single url might have different responses based on HTTP request
headers like:

* `Accept`
* `Accept-Language`
* `Authorization`

Or even other custom headers. A HTTP server can indicate to a client how the
client should store responses in the cache based on the `Vary` header. For
example, if a response to a `GET` request has the `Vary: X-Foo` header, the
http client knows that depending on the value of the `X-Foo` header in the 
HTTP Request (Not the response, this is important!) the server might emit
a different response.

What's also important to know, is that the HTTP client cache will store and
expire the cache for any given resource based on instructions the server gives
in headers such as `Cache-Control` and `Expires`. 

In HAL we have none of that information available in `_embedded`, so we sort
of need to make these values up, and that's not great.


A suggested proposal to improve HAL
-----------------------------------

Conceptually I feel that HAL's `_embedded` is not strictly for specifying
collections and/or sub-resources. It's core feature is really
means to prepopulate the HTTP cache to avoid future `GET` requests.

Knowing that, I believe `_embedded` is not the best format to achieve this
goal. We're missing crucial information to do this as correct as possible.

Here's a format I would like to see instead:

```json
{
  "_links" : {
     "self" : { "href" : "/" },
     "current-user" : { "href" : "/user/1356" },
     "support" : { "href": "mailto:support@example.org" }
  },
  "_push" : [
    {
      "request" : {
        "method" : "GET",
        "uri" : "/user/1356",
        "headers" : {
          "accept" : "application/hal+json"
        }
      },
      "response" : {
        "headers" : {
            "vary": "Accept",
            "cache-control" : "private; max-age=3600; no-revalidate",
            "content-type" : "application/hal+json",
            "etag" : "\"foo-bar\""
        },
        "body" : {
          "_links" : {
            "self" : { "href" : "/user/1356" }
          },
          "firstName" : "...",
          "lastName" : "...",
          "email" : "..."
        }
      }

  ]
}
```

Changed from `_embedded` are:

* I added HTTP request and response headers and the request method.
* I'm no longer indexing things in `_embedded` by their relation type, it's
  just an array of requests and response pairs.
* I'm no longer removing items from `_links`. The link just stays there.
* `_push` is not nested. It only appears in the top and it's really just a
  'transport-level' feature instead of a part of the data-structure.

The drawback? If you're not interesed in developing an an advanced HAL
client/server, and just want to build a 'dumb' parser of collections, there's
more data and a higher cognitive load.

However, even if this is a better way to push resources to a client, it's only
really needed for HTTP/1.1. HTTP/2 makes this obsolete.


HTTP/2
------

Those aware of what's going on with HTTP/2 might recognize `_push`. HTTP/2
has a very similar feature.

HTTP/2 actually introduces a protocol-level push and it works in the exact
same way. HTTP/2 Push can be used to preemptively populate the browser cache
if the server knows the client will likely want to do certain `GET` requests
in the future.

A HTTP/2 push message always contains BOTH the HTTP response, but also the
HTTP Request that the browser _would_ send if they did have to do the `GET`
request.

And now there's a new feature under development that makes this especially
cool: [HTTP/2 cache digest][8].

HTTP/2 cache digests is an extension to the HTTP/2 protocol that will allow
a client to send a small summary of the cache a browser has for the server.

This is really the missing key, because the biggest thing we were missing
with HTTP/2 push is that the server doesn't know in advance which resources
the client already knows. This results in unneeded pushes.

This is identical to a HAL server always adding resources to `_embedded`.
The server doesn't know if the client cared for them, or if it already had
an up-to-date copy.

It would be easy for a HTTP/2 HAL client to add a HTTP header to `GET`
requests such `X-Please-Push: current-user` to automatically push
request/response pairs for a `current-user` relationship and only if the
client didn't already have an up-to-date copy of it.

For this reason I think that my `_push` proposal doesn't make all that much
sense. It's only really useful to provide a HTTP/2-like push feature to
HTTP/1.1. It's a stopgap.

And since we no longer really need `_embedded`, it might make sense to also
ditch `_links` and just move the information to the [HTTP Link][9] header,
which also means all this REST linking logic is no longer restricted to JSON
or XML-based formats.


Conclusion
----------

In HAL and REST we currently have an awkward and poor fit for embedding
resources. The only reason we need this in the first place, is because clients
doing many GET requests is expensive. Technical limitations of HTTP.

This causes problems because these resources are not easily cached and simply
don't fit well within the HTTP design. We need to create layers on top of HTTP
just to work around this.

HTTP/2 and cache digests might offer a great solution, in that we can completely
avoid embedding resources and preemptively send resources that the client
will probably want and doesn't already have an up-to-date copy for.

This will make REST much more practical and alleviate some of the largest
isues people have with it today. I think it eventually makes formats like HAL
completely obsolete, because we're moving the hard stuff to the protocol
layer.

[1]: https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
[2]: https://tools.ietf.org/html/draft-kelly-json-hal-08
[3]: http://www.iana.org/assignments/link-relations/link-relations.xhtml
[4]: https://twitter.com/mamund
[5]: https://tools.ietf.org/html/rfc6573
[6]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[7]: https://developer.mozilla.org/en-US/docs/Web/API/Cache/put
[8]: https://tools.ietf.org/html/draft-kazuho-h2-cache-digest-01
[9]: https://tools.ietf.org/html/rfc5988 "Web linking"
