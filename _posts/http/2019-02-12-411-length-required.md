---
date: "2019-02-12 11:00:00 -0400"
title: "411 Length Required"
permalink: /http/411-length-required
tags:
   - http
   - http-series
location: Toronto, CA
---

Most HTTP requests that have a request body, will also have a `Content-Length`
header indicating how big the body will be. However, this is optional for some
cases, such as when [Chunked Transfer Coding][2] is used.

It's useful for a client to not include a `Content-Length` header for a few
different cases. For instance, a client might send a HTTP request body based
on a stream.

If a server does not support this feature, it can indicate this by sending back
[`411 Length Required`][1].

In a situation like this, a recourse a client might have is to buffer the
entire request to determine the real length.

Example
-------

```http
HTTP/1.1 411 Length Required
Content-Type: text/html
Server: curveball/0.6.0

<h1>This server requires a Content-Length</h1>
```

References
----------

* [RFC7231, Section 6.5.10][1] - 411 Length Required

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.10 "411 Length Required"
[2]: https://tools.ietf.org/html/rfc7230#section-4.1
