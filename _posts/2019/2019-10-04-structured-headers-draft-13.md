---
title: "Structured headers NPM package: new version"
date: "2019-10-04 13:00:00 UTC"
tags:
  - ietf
  - headers
  - http
  - structured-headers
geo: [43.660773, -79.429926]
location: "Bloor St W, Toronto, Canada"
---

I just updated my [structured-headers package][1] to be up to date with
the latest verison of the [Structured headers][2] IETF draft.

If you do anything with HTTP, structured headers might be something you have
to deal with in the future.

Many HTTP headers encode complex values, and many HTTP headers have their own
serialization format.

In an effort to reduce this, the [Structured Headers][2] specification is being
written, which introduced a standard HTTP header format to serialize many types
of data, such as numbers, string, lists, objects, parameters, booleans, etc.

It's very likely that many new HTTP headers that are being standardized in the
future will all follow the new structured headers format.

It's a bit risky to adopt before it's a full standard, as the format has changed
a lot over its development. However, as soon as it stabilized it will be an
excellent choice as an encoding mechanism for your own custom headers as well.

[1]: https://github.com/evert/structured-headers
[2]: https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-13
