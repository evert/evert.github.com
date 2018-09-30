---
date: "2018-12-18 08:00:00 -0700"
title: "405 Method Not Allowed"
permalink: /http/405-method-not-allowed
tags:
   - http
   - http-series
location: Nijega, NL
---

[`405 Method Not Allowed`][1] should be returned by a server when a certain
HTTP method is not supported at a resource.

It's a bit different from [`403 Forbidden`][2]. `403` suggest that the server
might support the HTTP request, but the client doesn't have the right
privileges to do the HTTP request.

`405 Method Not Allowed` means that the HTTP method is simply not supported.
For example, a client might do a `POST` request on a resource where `POST`
is not implemented or it's meaningless.

A server generating the `405` response must also tell the client which HTTP
methods it can do, using the `Allow` header.

Example
-------
```http
HTTP/1.1 405 Method Not Allowed
Content-Type: text/html
Allow: GET, HEAD, OPTIONS, PUT

<h1>405 Try another method!</h1>
```

Well, the next couple of weeks are going to be pretty quiet on the web, so I'm
taking a short break of these series and see you back January 8th!


References
----------

* [RFC7231, Section 6.5.5][1] - 405 Method Not Allowed

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.5 "405 Method Not Allowed"
[2]: /http/403-forbidden
