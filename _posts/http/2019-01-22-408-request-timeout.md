---
date: "2019-01-22 08:00:00 -0400"
title: "408 Request Timeout"
permalink: /http/408-request-timeout
tags:
   - http
   - http-series
location: Toronto, CA
---

If a client is too slow to send a full HTTP request, a server can send back a
[`408 Request Timeout`][1] error response.

A request coming in too slow can happen for a variety of reasons, including
slow internet connections, completely lost internet connections or bad actors.

When a server sends back the `408`, it no longer wants to wait for the request
and kills the connection.

A robust client might try to repeat the request as soon as they receive this
response.

Example
-------

```http
HTTP/1.1 408 Request Timeout
Connection: close
Content-Type: text/plain

Too slow! Try again
```

References
----------

* [RFC7231, Section 6.5.7][1] - 408 Request Timeout

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.7 "408 Request Timeout"
