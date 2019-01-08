---
date: "2019-01-08 08:00:00 -0700"
title: "406 Not Acceptable"
permalink: /http/406-not-acceptable
tags:
   - http
   - http-series
location: Toronto, CA
---

Happy 2019! After a small hiatus we're back with this captivating series. I
hope you're as excited as I am and I hope you have the best 2019!

[`406 Not Acceptable`][1] is emitted by a server when the client asked for a
specific representation of a resource that the server doesn't support.

Accept headers
--------------

HTTP has a feature called content negotation. This feature allows a client to
request a specific version of a resource. These are the main relevant request
headers:

* [`Accept`][2] - If a server supports several content-types, a client can use
  this header to indicate which they prefer. For example, an API might support
  both JSON and XML.
* [`Accept-Charset`][3] - To request a specific character set. In 2019 this is
  not really useful as everything should be UTF-8.
* [`Accept-Encoding`][4] - Is generically used for clients to indicate what
  type of compression they support. Gzip has been supported by every browser
  for a long time. Recently [Brotli][5], a new compression format has popped
  up. Clients indicate their support for this via the `Accept-Encoding` header.
* [`Accept Language`][6] allows a client to indicate which language they
  prefer. Browsers use this to tell a server which language the user prefers.
  For example, a browser might tell the server they prefer Dutch 1st, and
  English second with `Accept-Language: nl-NL; q=1, en; q=0.9`.
* [`A-IM`][7] is used to indicate what kind of Instance Manipulation formats
  it supports. Also see [`226 IM Used`][8].


Example
-------

This client is indicating that it prefers to receive `application/json` in
French.

```http
GET /foo HTTP/1.1
Accept: application/json
Accept-Language: fr-CA; q=1, fr; q=0.8 
```

If the server didn't support JSON, it might respond with:

```http
HTTP/1.1 406 Not Acceptable
Server: curveball/0.4
Content-Type: text/html

<h1>Je ne support pas application/json</h1>
```

Huge disclaimer: I only had 2 years of french and it's over 15 years ago.


Usage
-----

It's a great idea for APIs to support this for the `Accept`/`Content-Type`
header. If an API defines specific content-types, they might be easier to
evolve.  Strictly enforcing the appearance of an `Accept` header with these
specific content-types really helps with this. If a client doesn't send it,
a `406` status should be returned.

Likewise, it can be useful for multi-lingual web applications to support
`Accept-Language` to figure out the user's preferred language.


References
----------

* [RFC7231, Section 6.5.6][1] - 406 Not Acceptable

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.6 "406 Not Acceptable"
[2]: https://tools.ietf.org/html/rfc7231#section-5.3.2 "Accept"
[3]: https://tools.ietf.org/html/rfc7231#section-5.3.3 "Accept-Charset"
[4]: https://tools.ietf.org/html/rfc7231#section-5.3.4 "Accept-Encoding"
[5]: https://en.wikipedia.org/wiki/Brotli "Brotli compression"
[6]: https://tools.ietf.org/html/rfc7231#section-5.3.5 "Accept-Language"
[7]: https://tools.ietf.org/html/rfc3229#section-10.5.3 "A-IM"
[8]: /http/226-im-used "226 IM Used"
