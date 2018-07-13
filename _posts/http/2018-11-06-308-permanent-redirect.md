---
date: "2018-11-06 08:00:00 -0700"
layout: http-series
title: "308 Permanent Redirect"
permalink: /http/308-permanent-redirect
tags:
   - http
   - http-series
---

[`308 Permanent Redirect`][1]  is similar to [`301 Moved Permanently`][2],
but just like [`307`][3] vs [`302`][4], the difference lies in which HTTP
method clients should use on the target of the redirect.

When a client encounters a `308`, it must do the exact same request on the
target location.

Example
------

```http
HTTP/1.1 308 Permanent Redirect
Location: https://evertpot.com/http/308-permanent-redirect
Server: Apache/2.4.29
```

References
----------

* [RFC7238][1] - Status Code 308 (Permanent Redirect).

[1]: https://tools.ietf.org/html/rfc7231#section-6.4.7 "307 Temporary Redirect"
[2]: /http/301-moved-permanently
[3]: /http/307-temporary-redirect
[4]: /http/302-found

