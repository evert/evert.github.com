---
date: "2019-03-26 15:00:00 UTC"
title: "417 Expectation Failed"
permalink: /http/417-expectation-failed
tags:
   - http
   - http-series
location: "Bloor St W, Toronto, ON, Canada"
geo: [43.660942, -79.429954]
---

A server emits [`417 Expecation Failed`][1] when it encountered a `Expect`
header that it didn't understand or doesn't support.

A client can use the `Expect` header to tell the server that it requires a
certain behavior from a server.

The only expectation that (as far as I know) is standardized, is
`100-continue`.

This looks like this:

```http
POST /foo/bar HTTP/1.1
Content-Type: application/gzip
Content-Length: 12345678765
Expect: 100-continue

...
```

This request intends to upload a large file. The client tells the server that
it expects the server to first respond with a [`100 Continue`][2] response.

If a server supports this, it will first return this `100 Continue` response,
which tells a client that the request was understood, supported and probably
acceptable and it can continue uploading.

If the server did not support this feature, it must response with `417`:

```http
HTTP/1.1 417 Expectation Failed
Content-Type: text/plain

We don't support 100-continue
```

If a server sees a different type of expectation that's a new future standard,
or some custom extension it should always return `417`.

References
----------

* [RFC7231, Section 6.5.14][1] - 417 Expectation Failed
* [RFC7231, Section 6.2.1][3] - 100 Contnue
* [RFC7231, Section 5.1.1][4] - Expect header

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.14 "417 Expectation Failed" 
[2]: /http/100-continue
[3]: https://tools.ietf.org/html/rfc7231#section-6.2.1 "100 Continue" 
[4]: https://tools.ietf.org/html/rfc7231#section-5.1.1 "Expect header"
