---
date: "2019-07-30 15:00:00 UTC"
title: "504 Gateway Timeout"
permalink: /http/504-gateway-timeout
tags:
   - http
   - http-series
---

[`504 Gateway Timeout`][1] is a status a proxy might emit, when it's acting
as a proxy and not getting a response from an upstream server.

This is fairly close to [`502 Bad Gateway`][2], expect that `502` should be
returned when a proxy got an invalid response, and `504` typically when the
proxy didn't get a response at all (or too late).


Example
-------

```http
HTTP/1.1 504 Gateway Timeout
Content-Type text/html

<h1>Timeout</h1>

<p>We did not get a timely response from our upstream application server :(</p>
```

References
----------

* [RFC7231, Section 6.6.5][1] - 504 Gateway Timeout

[1]: https://tools.ietf.org/html/rfc7231#section-6.6.5 "504 Gateway Timeout"
[2]: /http/502-bad-gateway
