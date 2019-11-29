---
date: "2019-07-23 15:00:00 UTC"
title: "503 Service Unavailable"
permalink: /http/503-service-unavailable
tags:
   - http
   - http-series
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

[`503 Service Unavailable`][1] is a status that a server can send when it is
overloaded, or otherwise incapable of handling a request. Maybe the server is
just booting up, or perhaps the application is partially down.

When this status is returned, a server can optionally include a `Retry-After`
header to tell a client when to try the request again.

Example
-------

```http
HTTP/1.1 503 Service Unavailable
Content-Type text/plain
Retry-After: 1800

System overload! Give us some time to increase capacity.
```

References
----------

* [RFC7231, Section 6.6.4][1] - 503 Service Unavailable

[1]: https://tools.ietf.org/html/rfc7231#section-6.6.4 "503 Service Unavailable"
