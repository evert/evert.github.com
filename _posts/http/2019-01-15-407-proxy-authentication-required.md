---
date: "2019-01-15 08:00:00 -0700"
title: "407 Proxy Authentication Required"
permalink: /http/407-proxy-authentication-required
tags:
   - http
   - http-series
location: Toronto, CA
---

[`407 Proxy Authentication Required`][1] is an error a HTTP proxy returns if
it requires authentication. It's really similar to [`401 Unauthorized`][2].


Example
-------

```http
HTTP/1.1 407 Proxy Authentication Required
Proxy-Authenticate: Basic; realm="Secured area"
```

As you can see above, the response looks pretty similar to `401` and can use
the same authentication schemes.

This is an example of a client authenticating with a proxy:

```http
GET / HTTP/1.1
Proxy-Authorization: Basic d2VsbCBkb25lOllvdSBmb3VuZCB0aGUgc2Vjb25kIGVhc3RlciBlZ2cK
```

If a clients connects to a server that requires authentication via a proxy that
also requires authentication, both headers might appear in a request:

```http
GET / HTTP/1.1
Proxy-Authorization: Basic ZWFzdGVyIGVnZzpudW1iZXIgdGhyZWUK
Authorization: Bearer c2VuZCBtZSBhIHR3ZWV0IG9yIHNvbWV0aGluZwo
```

Usage
-----

HTTP proxies used to be more common. They can act like local caches or provide
an additional layer of security in a corporate environment. These days they
are less common for those purposes. Caching is not as needed, and the security
layer is more often implemented with a VPN. Most HTTP proxies these days are
reverse proxies, which is mostly transparent for HTTP clients.

Basic and Digest authentication for proxies is widely supported by browsers
and other HTTP clients.

References
----------

* [RFC7235, Section 3.2][1] - 407 Proxy Authentication Required

[1]: https://tools.ietf.org/html/rfc7235#section-3.2 "407 Proxy Authentication Required"
[2]: /http/401-unauthorized "401 Unauthorized"
