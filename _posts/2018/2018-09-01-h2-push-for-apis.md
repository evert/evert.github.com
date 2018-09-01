---
title: "HTTP/2 Push for APIs"
date: 2018-09-01 14:38:22 +0200
tags:
  - http2
  - hypermedia
  - api
  - rest
  - push
  - hal
location: Nijega, NL
---

HTTP/2 brought us the ability to push resources from server to client, before
client knows they need it.

HTTP/2 push has had mixed success, up to a point where Chrome developers are
[thinking of experimenting with disabling it alltogether][11]. I think this
would be a huge loss for APIs, so I shared my thoughts on the [IETF HTTP-WG
mailing list][12].

I copied it in full here (slightly reformatted):


From: Evert Pot  
To: ietf-http-wg@w3.org  
Subject: Another PUSH defense: APIs  

Hi everyone,

I wanted to chime into the discussion and share a different use-case for
h2 push.

My background is mostly API development. In the last few years I've
developed a number of REST-flavored services, most recently using the
[HAL][1] format.

When looking at various hypermedia formats, they all tend to have
something in common, the need to embed resources.

What this generally means, is that if you do a `GET` request on a
'collection', the response typically gives you information about the
collection, but also every entry inside of it. If effectively embeds the
representation you would have gotten if you had done a `GET` request
directly on individual item in the collection.

Every one of those embedded GET responses has their own url, their own
contents and their own list of links.

* HAL does this with `_embedded`.
* [Atom][2] does this with the `<item>` element.
* [Collection+JSON][3] does this with the `items` JSON property.
* [Siren][4] does this with the `entities` JSON property.
* [JSON API][5] does this via the `relationships` property.

Here's an generic example of a fictional collection in a fictional
hypermedia format.

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  links: [
     { href: '/collection/1', rel: 'item' },
     { href: '/collection/2', rel: 'item' },
     { href: '/collection/3', rel: 'item' },
     { href: '/collection/4', rel: 'item' },
     { href: '/collection/5', rel: 'item' },
     { href: '/collection/6', rel: 'item' },
  ],
  total: 6,
  embedded: {
    '/collection/1' : {
       links: { ... },
       ...other properties
    },
    '/collection/2' : {
       links: { ... },
       ...other properties
    },
    '/collection/3' : {
       links: { ... },
       ...other properties
    },
  }
}
```

Chances are that for a given 'hypermedia' format, you will find some
mechanism to embed resources.

To me, all of this is an anti-pattern, to work around a limitation of
HTTP. It's cheaper to do a single `GET` request and get _many_ HTTP
responses embedded in one, than doing many GET requests for each item in
a collection. It's a sane design for HTTP/1.1.

The HAL draft has a good explanation of this. The section is titled
["Hypertext cache pattern"][6].

The problem is also apparent in non-hypermedia formats. GraphQL for
example cites on their [website][7] the following 2 main advantages over
using resource-oriented architectures:

1. Ask for what you need, get exactly that
2. Get many resources in a single request

In particular selling point #2 is interesting. Not many people would
care about 'getting many resources in a single request' or even
intuitively think that getting multiple answers to a single question is
a good thing if it weren't for the fact that we're conditioned that less
HTTP requests has been a good thing.

However, doing many `GET` requests is semantically better. Some of the
issues with getting collections of embedded responses are:

* HTTP caches completely ignore them. It's not uncommon for client
  implementations of API specifications to re-create their own userland
  cache that's only ware of 1 specific format.
* This also means that HTTP caches for individual items don't
  automatically invalidate when receiving a new version of an embedded
  resource.
* It's typically not possible to embed items that are of a different
  media types than their parent. If your parent resource is encoded as
  JSON chances are the embedded item probably must too.
* Even though embedded items represent 'what you would have gotten if
  you did a GET request directly on the item', they typically miss
  HTTP response headers.
* It's often unclear how applications should behave when receiving
  embedded resources from other origins.

So taken all these things into consideration, I wondered if it was
possible to create a generic format for embedding resources in other
(JSON resources). I realized that this format would need to at least
have the following properties:

* Be generic enough so it can be used for different API specifications.
* Embed HTTP response headers for each item.
* Embed some HTTP request headers for each item, so a generic cache
  could pick this up. See [RFC7234, section 4.1 "Secondary cache
  keys"][8].
* Have defined semantics for cross-origin embeds.

When I listed these requirements it occurred me that HTTP/2 already has
a protocol-level facility for this: PUSH and the [ORIGIN][9] frame.

My hope for the future of REST apis is this:

1. When HTTP requests are cheaper, entities can be smaller.
2. Instead of non-semantically nesting HTTP responses in HTTP
   responses, related resources can be pushed.
3. The ORIGIN frame is used for pushing resources from a collection
   of other (controlled) origins.
4. [Cache Digests][10] and ETags are used to only push resources the
   client needs.

Cache Digest really makes this the killer feature, because it doesn't
just make this incrementally better, it actually will have major
performance benefits. Then if developers can stop building their own
caches, you get a lot of speed for free.

So my plea to you is to don't kill push just yet. We're still missing
some of the building blocks (cache digests), but with the right
framework in place, I think we can see a new wave of API designs that
weren't viable before.

Evert

[1]: http://stateless.co/hal_specification.html
[2]: https://tools.ietf.org/html/rfc4287
[3]: http://amundsen.com/media-types/collection/format/
[4]: https://github.com/kevinswiber/siren
[5]: http://jsonapi.org/
[6]: https://tools.ietf.org/html/draft-kelly-json-hal-08#section-8.3
[7]: https://graphql.org/
[8]: https://tools.ietf.org/html/rfc7234#section-4.1
[9]: https://tools.ietf.org/html/rfc8336
[10]: https://tools.ietf.org/html/draft-ietf-httpbis-cache-digest
[11]: https://www.youtube.com/watch?time_continue=8041&v=Um5HHZkXGg4
[12]: https://lists.w3.org/Archives/Public/ietf-http-wg/2018JulSep/0294.html
