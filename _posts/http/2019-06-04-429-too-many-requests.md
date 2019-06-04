---
date: "2019-06-04 15:00:00 UTC"
title: "429 Too Many Requests"
permalink: /http/429-too-many-requests
tags:
   - http
   - http-series
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

If an service wants to limit the amount of requests clients make, they can
use the [`429 Too Many Requests`][1] status code to inform the client that
they've exceeded it.

For example, perhaps an API wants to limit users to 100 HTTP requests per
hour.

It's possible to tell a client when they can make requests again with the
`Retry-After` header, but this is optional.

Example
-------

```http
HTTP/1.1 429 Too Many Requests
Content-Type text/plain
Retry-After: 3600

You exceeded the limit. Try again in an hour
```

References
----------

* [RFC6585, Section 4][1] - Too Many Requests

Also see:

* [`420 Enhance your calm`][2]

[1]: https://tools.ietf.org/html/rfc6585#section-4 "429 Too Many Requests"
[2]: /http/420-enhance-your-calm "420 Enhance your calm"
