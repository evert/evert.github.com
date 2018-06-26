---
date: "2018-09-11 08:00:00 -0700"
layout: http-series
title: "206 Partial Content"
permalink: /http/206-partial-content
tags:
   - http
   - http-series
---

[`206 Partial Content`][1] is used for range requests. It's possible for a
HTTP client to request only portions of a resource.

Examples of this might include a large log resource for which a client only
wants the last n bytes, a video where the client doesn't want to buffer more
than needed, or wants to quickly respond to a user seeking further into the
video.

If a client issued a ranged request, and the server is able to handle this
feature, it can indicate to the client that it's sending back only certain
ranges with the `206 Partial Content` status, and `Content-Range` headers.

The following request asks the server for a portion of a video:

```http
GET /video.mp4 HTTP/1.1
Range: bytes=1048576-2097152
```

A server supporting this could respond as follows:

```http
HTTP/1.1 206 Partial Content
Content-Range: bytes 1048576-2097152/3145728
Content-Type: video/mp4

...
```

References
----------

* [RFC7233][2] - (HTTP/1.1): Range Requests

[1]: https://tools.ietf.org/html/rfc7233#section-4.1 "206 Partial Content"
[2]: https://tools.ietf.org/html/rfc7233
