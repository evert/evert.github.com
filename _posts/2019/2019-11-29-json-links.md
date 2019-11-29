---
title: "Reinventing the wheel when encoding links in JSON"
date: "2019-11-29 11:20:00 UTC"
tags:
  - links
  - json
  - hal
  - collection-json
  - rfc8288
  - weblinking
  - hateaos
  - siren
  - hypermedia
  - rest
  - http
location: "Tam Coc, Nimh Binh, Vietnam"
geo: [20.214812, 105.935697]
---

Links are critical when writing good REST APIs. Most APIs these days use JSON
for their main format. Unfortunately, there's no universally agreed on way to
encode a link in JSON.

REST can really benefit from generic tooling. To write a generic tool that
consumes links, it means that these tools might have to support a dozen formats
or use other heuristics to find out if something is a link.

This begs the question, if there were a 'good default' serialization, what
would that look like? Here's my take.

The general shape
-----------------

Most (but not everyone) of the API community has accepted ['Web linking'][1]
as the de-facto datamodel.

Broadly, this means that a link should at least have a uri (`href`) and a
relationship type (`rel`) and optionally the following attributes:

* `title`
* `hreflang`
* `type`
* `media`

Aside from support for these attributes, I feel that for something to be a
successful 'good default' and actually adopted is a dedicated IETF RFC, and
ideally one that's focussed on just links and not part of a larger standard.


Existing JSON link formats
--------------------------

What follows is a nonexhaustive list of existing link serializations in JSON.

### HAL

```javascript
{
  _links: {
    author: {
      href: 'https://evertpot.com/',
      title: 'My website!',
      hreflang: 'en-CA',
    }
  ]
}
```

HAL is technically both a sub- and superset of RFC8282, because it adds
features such as 'templated' links, but it also explicitly allows colon `:`
in relationship types. HAL calls these 'curies' but they are not compatible
with W3C CURIES, and also shouldn't be used as such (they are not meant to
be expanded, yes this is confusing). HAL also officially doesn't have a
`type` property.

[Source](https://tools.ietf.org/html/draft-kelly-json-hal-00#section-5)


### Collection+JSON

```javascript
{
  collection: {
    links: [
      {
        rel: 'author',
        href: 'https://evertpot.com/',
        name: 'My website!',
      }
    ]
  }
}
```

Collection+JSON adds the `prompt` and `render` properties. It has no explicit
support for `type` or `hreflang`.

[Source](http://amundsen.com/media-types/collection/format/)

### Siren

```javascript
{
  links: [
    {
      rel: ['author'],
      href: 'https://evertpot.com/',
      title: 'My website!',
      type: 'text/html',
    }
  ]
}
```

[Source](https://github.com/kevinswiber/siren)

### draft-wilde-linkset

```javascript
{
  linkset: [
    {
      // Short
      author: 'https://evertpot.com/',

      // Long
      author: [
        {
          href: 'https://evertpot.com/',
          title: 'My website!',
          type: 'text/html',
          hreflang: 'en-CA',
        }
      ]
    }
  ]
}
```

[Source](https://tools.ietf.org/html/draft-wilde-linkset)

### Web Thing API

```javascript
{
  links: [
    {
      rel: 'author',
      href: 'https://evertpot.com/',
      mediaType: 'text/html',
    }
  ]
}
```

[Source](https://iot.mozilla.org/wot)

### JSON:API

```javascript
{
  links: [
    {
      // Short
      author: 'https://evertpot.com/',

      // Long
      author: {
        href: 'https://evertpot.com/',
      }
    }
  ]
}
```

JSON:API has no standard way to encode `title`, `type` or `hreflang` and does
not provide a way for a specific links relationship to appear twice.

[Source](https://jsonapi.org/format/#document-links)

### draft-nottingham-json-home


```javascript
{
  api: {
    links: {
      author: 'https://evertpot.com/',
    }
  },
  resources: {
    author: {
      href: 'https://evertpot.com/',
      hints: {
        format: 'text/html',
      }
    }
  }
}
```

The json-home format has 2 places where link relationships are used, so I
encoded an example for each.

There's no way to encode `title` or `hreflang`, and no way for 2 resources
to have the same link relationship.

[Source](https://tools.ietf.org/html/draft-nottingham-json-home-06)

### Other notable JSON links

Many API formats use a convention as follows:

```javascript
{
  author_url: 'https://evertpot.com/'
}
```

The [Github v3 API][2] uses this convention, and it's formalized a bit more
in [RESTful JSON][3]. You can see this convention used in the
[OAuth2 discovery document][4], although it uses the `_uri` prefix, which is
_probably_ more correct.

There is also [JSON-LD][4] and Hydra, which is a pretty popular format. I'm
not sure if it's possible to encode RFC8288 links in a lossless way.

The issue with not having a good default
----------------------------------------

New formats get invented every day, and may of them will have some need to
encode a link

Using something like JSON:API or Siren - although a good choice - is a big
decision. Maybe even an emotional one. These standards are larger than their
formats. They're fairly opiniated and imply a buy-in into these opinions and
their ecosystems.

The result is when authors of IETF RFC's or other standards bodies run into
this road block, they tend to just invent their own, often drawing inspiration
on what's out there.

I would really like to see a simple, uncontroversial IETF RFC that *just* makes
a good suggestion on how to encode a link, and a set of links so the next time
the groups behind OAuth2, Web Things API or specialized single-purpose formats
like [json-home][5] or [Linkset][6] only have to do something unique if they
are really need to.

How should it look like?
------------------------

Based on what everyone is doing, it feels that the least controversial way to
encode a single link would look a bit like this:

```javascript
{
  rel: 'author',
  href: 'https://evertpot.com/',
  title: 'My website!',
  type: 'text/html',
}
```

And a collection of links would just be an array of these objects:

```javascript
{
  links: [
    {
      rel: 'author',
      href: 'https://evertpot.com/',
      title: 'My website!',
      type: 'text/html',
    }
  ]
}
```

This allows links to appear in-line and and on a document-level, it can fully
encode [RFC8288][1] and it looks a lot many other things out there.

This is not really a specification, but I thought I would start with just
floating this as an idea. One issue with this illustrated well in
[XKCD 927][7], but my goal with this idea is not really coming up with a
standard to unify them all. I just want something to exist for folks that
don't want to make this decision and I do think it needs the weight of a IETF
RFC to make this happen.

What do you think?
--------------------

1. You can reply to [this tweet][8] to automatically see your response here.
2. If you're a dev, you can also send a [pull request][9] and edit in your
   comment in this article.

<!--

If you're writing a pull request, add you contribution above this
text.

Example template:

[Name](https://example/yourwebsite) on Feb 1st, 2018
> I disagree with this article because you SUCK
-->


[1]: https://tools.ietf.org/html/rfc8288 "Web Linking"
[2]: https://developer.github.com/v3/
[3]: https://restfuljson.org/
[4]: https://json-ld.org/
[5]: https://tools.ietf.org/html/draft-nottingham-json-home-06  "Home Documents for HTTP APIs"
[6]: https://tools.ietf.org/html/draft-wilde-linkset-04 "Linkset"
[7]: https://xkcd.com/927/
[8]: https://twitter.com/evertp
[9]: https://github.com/evert/evert.github.com/blob/master/_posts/2019/2019-11-29-json-links.md "This post on Github"
