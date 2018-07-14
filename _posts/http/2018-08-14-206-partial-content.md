---
date: "2018-08-14 08:00:00 -0700"
title: "206 Partial Content"
permalink: /http/206-partial-content
tags:
   - http
   - http-series
---

[`206 Partial Content`][1] is used for range requests. It's possible for a
HTTP client to request only portions of a resource using range requests.

Examples of this might include a large log resource for which a client only
wants the last _n_ bytes. Or maybe a video and the client doesn't want to
buffer more data than needed, or maybe a user is seeking through the video
by fast-forwarding.

If a client issued a range request, and the server is able to handle this
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

If a server doesn't support Range requests, it will just return a [`200 OK`][3]
and send back the entire video. A client will know that the server didn't
support it via this status code and the omission of the `Content-Range` header.

References
----------

* [RFC7233][2] - (HTTP/1.1): Range Requests

[1]: https://tools.ietf.org/html/rfc7233#section-4.1 "206 Partial Content"
[2]: https://tools.ietf.org/html/rfc7233 "(HTTP/1.1): Range Requests"
[3]: /http/200-ok "200 OK"
