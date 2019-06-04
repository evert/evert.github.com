---
date: "2019-06-18 15:00:00 UTC"
title: "431 Request Header Fields Too Large"
permalink: /http/431-request-header-fields-too-large
tags:
   - http
   - http-series
---

When a client sends a HTTP request with HTTP headers that are too big, a server
can use [`431 Request Headers Fields Too Large`][1] in response.

This response can be used if either the total size of all headers exceeded some
limit, or if there are individual headers that are too big.

If a client sees a `431`, it could hypothetically remove some headers and try
again, but I'm not really sure how a client could automatically identify
unimportant headers.

Aside from that, `431` can still be a useful signal to a developer that they
should manually try to reduce the request header size.

Example
-------

```http
HTTP/1.1 431 Request Headers Too Large
Content-Type text/html

<h1>Too many cookies! Try to reduce your cookie footprint.</h1>
```

References
----------

* [RFC6585, Section 5][1] - 431 Request Headers Fields Too Large


[1]: https://tools.ietf.org/html/rfc6585#section-5 "431 Request Header Fields Too Large"
