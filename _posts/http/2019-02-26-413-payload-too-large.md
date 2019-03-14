---
date: "2019-02-26 11:00:00 -0400"
title: "413 Payload Too Large"
permalink: /http/413-payload-too-large
tags:
   - http
   - http-series
location: DiiD office, Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

The [`413 Payload Too Large`][1] response is used when the client sent a
request with a body that's too big.

Maybe the request was a file upload, and it exceeded the maximum file-size, or
maybe it's an API and it preemptively blocks requests that are unrealisticly
large.

It's a good idea to try and think of reasonable limits for requests, as
accepting arbitrary-size HTTP requests could result in denial-of-service
attacks.

If this error is temporary, a server can include a `Retry-After` header to
indicate to the client they should just try again after a certain amount
of time.

One example of a temporary status could be that the client has an upload-quota
and it was exceeded.

If the reason for the error is that the server ran out of disk- space,
[`507 Insufficient Storage`][2] should be used instead.

Example
-------

```http
HTTP/1.1 413 Payload Too Large
Content-Type: text/html

<p>This endpoint does not support requests larger than 1MB</p>
```

```http
HTTP/1.1 413 Payload Too Large
Retry-After: 3600
Content-Type: text/html

<p>You exceeded your quota. Try again in an hour</p>
```

References
----------

* [RFC7231, Section 6.5.11][1] - 413 Payload Too Large
* [RFC7231, Section 7.1.3][3] - Retry-After

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.11 "413 Payload Too Large"
[2]: /http/507-insufficient-storage "507 Insufficient Storage"
[3]: https://tools.ietf.org/html/rfc7231#section-7.1.3 "Retry-After"
