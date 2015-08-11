---
date: 2015-02-03 04:58:08 UTC
layout: post
title: "What's a link?"
tags:
    - uri
    - url
    - hypermedia
    - atom
    - html
    - html5
    - link
    - featured
---

When you ask a developer, what is a "link", they may quickly answer "a URL" or
"a URI", but this is not the whole truth.

A URL is only an address that you can find to build a resource. A "link"
connects one resource to another.

My goal is to create a PHP interface that describes the abstract data-model
behind a link.

To do this job correctly, I felt I had to dig through all the relevant
hypermedia specifications and extract for each what their definition of a link
is.

This blogpost is quite literally me making progress through all the specs. It
might be boring, and not well written. If you want to skip the details, you
can [jump straight to the conclusion](#conclusion).

History
-------

The oldest instance of the link I could find, was a reference in the
[html 1.2][1] draft. That draft (from 1993), defines both the `<a>` and the
`<link>` html tags. I'm not sure if there's earlier work, I'd love to know
about it!

HTML 1.2 adds the following attributes to the `<a>` element:

* `href` - The target of the link.
* `name` - Used for linking to specific bits in the document using a URI
  fragement (`#`).
* `rel` - The relationship type.
* `rev` - The reverse relationship.
* `urn` - A URN that identifies the document. This is some kind of ID.
* `title` - The title of the linked document, which should actually
  correspond to the `<title>` element in that document.
* `method` - A list of accepted HTTP methods.

All of these attributes are optional, but either `href` or `name` must be
specified.

The `<link>` element appears in the `<head>` of a HTML document, and could
have all the same attributes. The difference between a `<link>` and `<a>` is
that a `<a>` may contain text and usually appears in a document, whereas the
`<link>` element doesn't have content.

```html
<link href="/index.html" rel="index">
```

HTML5
-----

In [HTML5][2], the link fundamentally has not changed, although it lost and
gained a few attributes.

* `href`, `title`, and `rel` are still there.
* There's now a `target` attribute, which is really a UI concern that leaked
  into the HTML datamodel. If it wasn't for `target`, there may have never
  been pop-ups.
* `download`, triggers a link being opened as a 'download' in a browser,
  rather than opening it the normal way.
* `hreflang` is a hint that specifies what the language will be of the target
  resource. (`hreflang="en-US"`).
* `type`, another hint that tells the agent what the target resource's
  content-type might be. (e.g.: `type="text/css"`).

HTML gained an `<area>` element that also functions as a link, embedded in an
"image map".

The `<link>` element gained `crossorigin`, `media` and `sizes`. All of these
are very specific to HTML 'as an application', but kind of go away from the
conceptual idea of HTML 'as a document'.

### REL

The `rel` attribute is the relationship type between two resources. This blog
for instance has a link relationship to a css file. The contents of the
`rel` attribute will be `stylesheet`.

```html
<link href="/css/stylesheet.css" type="text/css" rel="stylesheet" />
```

Keywords such as 'stylesheet' are formalized and accurately [described][3] in
the HTML5 specification.

Popular ones you may recognize are 'alternate', 'author', 'stylesheet' and 'icon'.

The full list of relationship types defined in HTML5 can be found
[in the spec][7], but the specification also refers to a
[microformats.org wiki document][19] as the official registry for additional
relationship types. What's interesting, is that anyone is free to edit this
list and add their own.

On that document, there's a huge list of valid, recognized keywords.

In HTML5, you are allowed to specify more than one relationship in the `rel=`
attribute, each separated with space.

It's possible to create your own relationship types, by:

1. Simply defining a new keyword.
2. If the keyword contains a colon (`:`), it must actually be an Absolute URI.


### REV

HTML5 no longer supports the `rev=` attribute. But what is it?

The `rev` attribute is the reverse relationship type. For instance, I might have
written a document that lives on `/article.html`. That document might have the
following link:

```html
<link href="/evert.html" rel="author" />
```

On `/evert.html`, there could be a reverse-link such as this:

```html
<link href="/article.html" rev="author" />
```

Various sources on the web tend to describe `rev` as a 'bad idea', because
it's rarely used, and when it is used, often used incorrectly.

[An article from 2005 from developer.google.com says][4]

> ...An interesting thing to note from this is that the ... only
> `<link rev="">` link to appear is `rev="made"` (to point to the author's
> page) — and the latter is not used that much more than the more sensible
> `rel="author"`. Also, ironically, just off the graph in position 21 is
> `rel="made"`, probably showing that the distinction between `rel` and `rev`
> may be too subtle for many authors. More evidence of this is at position 29
> on the list, with `<link rev="stylesheet">`...


The HTTP 'Link' header
----------------------

It is also possible to specify links by just using a HTTP link header.
For example, the following HTML link:

```html
<link href="/evert.html" rel="author" />
```

Could also appear in a HTTP header as:

    Link: </evert.html>; rel="author";

The benefit of using the `Link:` HTTP header, is that it would allow you to
add links to resources that normally don't support it. For instance, you could
add a `copyright` link relationship to a javascript file:

    Content-Type: text/javascript
    Link: </copyright.html>; rel="copyright";

The Link header is defined in [RFC5988][5]. While this RFC mostly talks about
the Link: header, it also describes the abstract concept of a link of the web.
The title of the document is "Web Linking", and is also referred to as the
canonical reference by many other specifications that describe links.

The [IANA Link Relation Types][8] is the official list of relationship types
for the Link header. Any user-defined relationship types can be specified by
using an absolute URL instead of a short keyword.

The Link header also has support for `hreflang`, `media` and `type` parameters.
`hreflang` may appear more than once.

The Link header defines both a `title` and `title*` header. When the extra
asterisk is added, the title might be a in a non-ascii character set, such as
UTF-8.

Similar to HTML, the link header can also convey multiple relations in the
same header:

    Link: <http://example.org/>; rel="start http://example.net/relation/other"


Atom
----

The [Atom Syndication Format][9], defined by [RFC4287][9] is well known as the
successor of RSS. It's also a great hypermedia data format, and used
for example throughout the [Google Data Protocol][11].

Even more famous, this blog also sports an [atom feed][12], which you should
totally subscribe to.

Atom also has its own interpretation of a link. The `<link>` element appears
in the `http://www.w3.org/2005/Atom` xml namespace.

The atom link element may have the following attributes:

* `href`
* `rel`
* `type`
* `hreflang`
* `title`
* `length`

Unlike HTML, in Atom there is always a relationship type (`rel`). If `rel` is
omitted, it defaults to `alternate`.

Another big difference is that the Atom `rel` *always* refers to a URI, unlike
HTML or the HTTP variant.

If the value of `rel=` is a simple keyword, such as `self`, `alternate` or
`enclosure`, an implementor should automatically append that value to the
string `http://www.iana.org/assignments/relation/`.

So this implies that the following are equivalent:

```xml
<link href="http://evertpot.com/" />
<link href="http://evertpot.com/" rel="alternate" />
<link href="http://evertpot.com/" rel="http://www.iana/assignments/relation/" />
```

Atom also introduces a `length` attribute, which allows someone who produces a
feed to give an agent a hint about how large the target URI will be, in bytes.


XRD/JRD
-------

The ["Extensible Resource Descriptor"][13] is another XML-based hypermedia
format.

A simple XRD file might look a little bit like this:

```xml
<?xml version='1.0' encoding='UTF-8'?>
<XRD xmlns='http://docs.oasis-open.org/ns/xri/xrd-1.0'>

 <Subject>http://evertpot.com/</Subject>
 <Property type='http://evertpot.com/props/authorname'>Evert Pot</Property>

 <Link rel='stylesheet' href='http://evertpot.com/css/stylesheet.css' type="text/css" />

</XRD>
```

And it's little brother, JRD:

```json
{
    "subject" : "http://evertpot.com/",
    "properties" : {
        "http://evertpot.com/props/authorname" : "Evert Pot"
    },
    "links" : [
        {
            "rel" : "stylesheet",
            "href" : "http://evertpot.com/css/stylesheet.css",
            "type" : "text/css"
        }
    ]
}
```

XRD largely refers to the ["Web Linking"][5] document to describe its links,
and therefore they follow the same rules for `rel` and how to extend it. JRD
is used as the base format for the [WebFinger][14] protocol.

One small difference however is that it's not allowed to specify multiple
relationship types in the `rel` attribute or JSON key.

Another difference between XRD and all the previous documents, is that XRD is
a "description of a resource". An XRD document is used used to describe a
*different* resource, specifically the resource specified in the `<Subject>`
element.

So for all the previous documents we've discussed, the links always
establishes a link between the *current* resource and some other resource, XRD
establishes a link between the resource identified by `<Subject>` and some
other resource.

XRD also includes a secondary way to use the `<Link>` element, by providing a
`template=""` attribute instead of a `href=""` attribute.

While `template` is not specifically defined, it can effectively be used by
a format to automatically replace a 'variables' in a URI by new values.

Example

    <Link rel="author" template="http://example.org/authors/{lastname}/{firstname}/" />

Lastly, XRD allows an implementor to specify 0 or more additional namespaced
properties to links, effectively allowing implementors to add an infinite
amount of meta-data.


HAL
---

[Hypertext Application Language][15] or "HAL" is a popular new media type for
creating hypermedia applications in a friendly JSON format. HAL appears to
borrow several ideas from XRD/JRD.

Dispite HAL still being a work in progress, it's already in use in various
places.

```json
{
  "_links": {
    "self": { "href": "/orders/523" },
    "warehouse": { "href": "/warehouse/56" },
    "invoice": { "href": "/invoices/873" }
  },
  "currency": "USD",
  "status": "shipped",
  "total": 10.20
}
```

We only really care about the `_links` property. This property contains an
object whose keys are relationship types (equivalent of `rel`) and values
information about a link.

HAL refers to the [IANA registry][8] for its relationship types.

If there are multiple links with the same relationship type (for example, two
links with "stylesheet"), the link object can be replaced with an array:

```json
{
  "_links": {
    "self": { "href": "http://evertpot.com/" },
    "stylesheet": [
        { "href": "/css/stylesheet.css", "type" : "text/css" },
        { "href": "/css/desert.css", "type" : "text/css" }
    ]
  }
}
```

Links in HAL have a `href`, `hreflang` and `title` property, but there are
also a few new ones:

HAL links may have a `templated` property, which may be true. This is very
similar to how templates work in `XRD`. When a link is templated, it is no
longer a URI, but it is a [URI Template][16].

I think the naming convention is a bit poor, because the implication is that
this entity is a 'templated URI' and not a 'URI template'. Each of those have
specific connotations, but the one chosen in HAL seems to imply that the
contents of `href` is still a valid URI.

The XRD/JRD syntax is in my opinion better. It uses a separate `template` key,
which really makes it stand out as a different thing.

HAL also has a `deprecation` property, which allows an author to indicate that
a link may in the future get removed.

HAL has a `name` property, which works as a 'secondary method' to get the
relationship type.

Lastly, HAL links may have a `profile` property, which is a a field that
contains a URI. The `profile` property is an indicator that the target of the
link may support certain conventions. It's a hint about how the target resource
may behave.


Collection+JSON
---------------

[Collection+JSON][17] is another JSON Hypermedia format. It is much more
strict, but also has a lot more features.

In Collection+JSON links will appear either in the "links" property, which
looks a bit like this:

```json
"links" : [
  {"rel" : "icon", "href" : "/favicon.ico"}
]
```

Links in Collection+JSON may have the `rel` and `href` properties which are
well known at this point. Collection+JSON adds `prompt`, `render` and `name`,
each influencing how a client may display the link.

Collection+JSON refers to the [microformats][19] wiki as its source for `rel`.

SIREN
-----

[SIREN][18] is another JSON-based format that solves similar problems.

A link in SIREN is pretty straightforward:

```json
"links": [
    { "rel": ["self"], "href": "http://api.x.io/orders/1234" }
]
```

The `rel` property is specified as an array, for multiple relationship types.
SIREN also mentions a `type` property.

SIREN refers to [RFC5988 "Web Linking"][5], which would imply that it also
follows the [IANA registry][8] for relationship types.

<span id="conclusion"></span>

Conclusion
----------

The question I hoped to answer today was: is there a common data-model behind
the concept 'link'.

So far I've learned the following:

1. A link always has a source URI.
2. A link always has a destination URI.
3. A link may have a "relationship type".

### Relationship type

Relationship types are indicated as a simple keyword or an absolute URI. If
you invent new relationship types, you should just use a URI.

If you're implementing a link in [HTML][2] or [Collection+JSON][17], you can
use the [microformats.org][19] wiki to find existing and claim new
relationship types.

If you are implementing a [HTTP Link header][5], [Atom][9], [XRD][10], JRD,
[HAL][15] or [SIREN][18], you should refer to the [IANA registry for link
relations][18].

The IANA registry is a subset of the microformats.org list, so if you use the
former, you are always right.

Furthermore, if  you are writing Atom, every relationship type is a URI, the
short keywords simply get prefixed by `http://www.iana.org/assignments/relation/`.

A relationship type is optional and can be empty. This indicates a
relationship between two resources without a further context given.

Except in Atom, where the default relationship type is "alternate" and empty
`rel=""` attributes are not allowed.

### Other properties of links

When specifying a link, you may include some information about the target of
the link, such as a target content-type.

This information is considered 'not normative', which means that the
information may be incorrect and you should really just fetch the resource to
find out for sure.

These are the most common:

| Format          | hreflang | title | type |
| --------------- | -------- | ----- | ---- |
| HTML5           | Yes      | Yes   | Yes  |
| HTTP Link       | Yes      | Yes   | Yes  |
| Atom            | Yes      | Yes   | Yes  |
| XRD/JRD         | No       | No    | Yes  |
| HAL             | Yes      | Yes   | Yes  |
| Collection+JSON | No       | No    | No   |
| Siren           | No       | No    | No   |

Are these actually part of the 'link' as an abstract data type? I'm not sure...
They appear all over the place, but I think their primary intention is to
simply reduce HTTP requests. If a consumer knows in advance they won't be able
to support the link by inspecting the `type`, they can ignore it and skip a
network round-trip.

In addition to the previous attributes, there are also many others, most of
which only appear in one specification. A non-exhaustive list:

* `media` (HTML, HTTP)
* `target` (HTML)
* `download` (HTML)
* `sizes` (HTML)
* `length` (Atom)
* `depreciation` (HAL)
* `profile` (HAL)

One common trend is that all of these are simple key-value structures.

### URI templates

There's a separate concept of URI templates. XRD separates them effectively,
but HAL confuses them with links. I don't think these should be considered
part of the base Link model.

### The PHP interface

Based on this research, I think this PHP interface will suffice to describe
a hyperlink:

```php
<?php

interface Link {

    /**
     * Returns the target of the link.
     *
     * The target must be a URI or a Relative URI reference.
     *
     * @return string
     */
    function getHref();

    /**
     * Returns the relationship type(s) of the link.
     *
     * This method returns 0 or more relationship types for a link, expressed
     * as an array of strings.
     *
     * The returned values should be either a simple keyword or an absolute
     * URI. In case a simple keyword is used, it should match one from the
     * IANA registry at:
     *
     * http://www.iana.org/assignments/link-relations/link-relations.xhtml
     *
     * Optionally the microformats.org registry may be used, but this may not
     * be valid in every context:
     *
     * http://microformats.org/wiki/existing-rel-values
     *
     * Private relationship types should always be an absolute URI.
     *
     * @return string[]
     */
    function getRel();

    /**
     * Returns a list of attributes that describe the target URI.
     *
     * The list should be specified as a key-value list.
     *
     * There is no formal registry of the values that are allowed here, and
     * validity of values is depdendent on context.
     *
     * Common values are 'hreflang', 'title', and 'type'. Implementors
     * embedding a serialized version of a link are responsible for only
     * encoding the values they support.
     *
     * Any value that appears that is not valid in the context in which it is
     * used should be ignored.
     *
     * Some attributes, (commonly hreflang) may appear more than once in their
     * context. Attributes such as those may be specified as an array of
     * strings.
     *
     * @return array
     */
    function getAttributes();

}
```

These 3 functions describe most links, but I've deliberately only included the
link target, and not the link source.

With all link examples, the source of the link is never embedded directly, but
always inferred from the context in which it appears.

A PHP link interface should therefore behave the same way.

[1]: http://www.w3.org/MarkUp/draft-ietf-iiir-html-01.txt "HTML 1.2"
[2]: http://www.w3.org/TR/html5/ "HTML5"
[3]: http://www.w3.org/TR/html5/links.html#linkTypes "HTML5 - Link Types"
[4]: https://developers.google.com/webmasters/state-of-the-web/2005/linkrels?csw=1
[5]: https://tools.ietf.org/html/rfc5988 "Web Linking"
[6]: https://tools.ietf.org/html/rfc4287#section-4.2.7 "Atom link element"
[7]: http://www.w3.org/TR/html5/links.html#attr-hyperlink-rel "HTML5 - rel"
[8]: http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1 "IANA link relations."
[9]: https://tools.ietf.org/html/rfc4287 "Atom Syndication Format"
[10]: http://en.wikipedia.org/wiki/RSS "RSS"
[11]: https://developers.google.com/gdata/docs/directory "GData APIs"
[12]: http://feeds.feedburner.com/bijsterespoor
[13]: http://docs.oasis-open.org/xri/xrd/v1.0/os/xrd-1.0-os.html "Extensible Resource Descriptor"
[14]: https://tools.ietf.org/html/rfc7033
[15]: http://stateless.co/hal_specification.html "Hal"
[16]: https://tools.ietf.org/html/rfc6570
[17]: http://amundsen.com/media-types/collection/format/
[18]: https://github.com/kevinswiber/siren
[19]: http://microformats.org/wiki/existing-rel-values#HTML5_link_type_extensions
