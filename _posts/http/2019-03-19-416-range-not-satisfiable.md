---
date: "2019-03-19 15:00:00 UTC"
title: "416 Range Not Satisfiable"
permalink: /http/416-range-not-satisfiable
tags:
   - http
   - http-series
---

It's possible for a client to request partial responses from a server. For
example, a client might only want the first 5 minutes of a video, or the last
100 lines of a log file.

HTTP clients and servers can do this with range requests.

For example, this request asks for the first 100 bytes:

```http
GET /foo.md
Range: bytes=1-100
```

If a server doesn't support range requests, it will return [`200 OK`][2] and
return the entire resource. If it did support range requests, it can use 
[`206 Partial Content`][3] and return just what the server asked for.

However, if a client requested a range that didn't make sense, it can use
`416 Range Not Satisfiable` to indicate this. For example, maybe a file was
1024 bytes, and the client asked for bytes 2000-3000.

```http
HTTP/1.1 416 Range Not Satisfiable
Content-Range: bytes */1000 
```

References
----------

* [RFC7233][1] - HTTP: Range Requests

[1]: https://tools.ietf.org/html/rfc7233
[2]: /http/200-ok "200 OK"
[3]: /http/206-partial-content "206 Partial Content"
