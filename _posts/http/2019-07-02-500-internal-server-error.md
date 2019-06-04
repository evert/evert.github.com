---
date: "2019-07-02 15:00:00 UTC"
title: "500 Internal Server Error"
permalink: /http/500-internal-server-error
tags:
   - http
   - http-series
---

While the 4xx-series errors are specifically for client-side errors, the
5xx-series errors are for server-side errors.

A server-side error generally means that there is a bug or outage. If you are
developing a client and you encounter a 5xx-range error, generally you can
assume it wasn't your fault, and it might even be worth contacting the
maintainers of the web service you're trying to use.

The first error in this series is [500 Internal Server Error][1]. This is a
generic error, and a good error to choose if there is _not_ a more specific
error suitable for your problem.

Many server-side error handlers automatically convert any uncaught exception
into this error code.

Example
-------

```http
HTTP/1.1 500 Internal Server Error
Content-Type text/plain

We broke it, sorry!
```

References
----------

* [RFC7231, Section 6.6.1][1] - 500 Internal Server Error

[1]: https://tools.ietf.org/html/rfc7231#section-6.6.1 "500 Internal Server Error"
