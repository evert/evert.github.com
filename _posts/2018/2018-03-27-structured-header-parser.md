---
title: A HTTP structured-header parser for Javascript
date: 2018-03-25 23:58:57 -0700
tags:
  - http
  - structured-header
  - opensource
---

A new [draft][1] is underway for HTTP, that has a good chance of becoming an
RFC. The draft is titled "Structured Headers for HTTP" and defines a standard
way to:

* Encode a list of items in HTTP headers
* Encode a dictionary (hash, map, associative array depending on where you're
  from).
* Encode a 'parameterized list'. For example: `X-Header: item1; param1=value1; param2=value2, item2`

The idea is that these types of structures are used quite a bit in both
standards and custom extensions, so it makes a lot of sense to define a
standard reusable way instead of reinventing this wheel for literally
every new header.

Items in these data structures can contain things like:

* strings
* integers
* floats
* binary data

Another promise of this draft, is that one day these might be encoded in the
protocol as some kind of binary structure, although in both HTTP/1.1 and
HTTP/2 they are just encoded as text.

Anyway, I wrote a small javascript library to parse these strings. You can
find it here:

* [Github & Documentation][2]
* [Npm.js package][3]

The library will be marked as '1.0.0' as soon as the draft is released as an
RFC. Until then BC breaking changes might happen as the spec evolves.

[1]: https://tools.ietf.org/html/draft-ietf-httpbis-header-structure
[2]: https://travis-ci.org/evert/structured-header
[3]: https://www.npmjs.com/package/structured-header
