---
date: "2018-09-18 11:00:00 -0400"
title: "301 Moved Permanently"
permalink: /http/301-moved-permanently
location: "San Francisco, US"
tags:
   - http
   - http-series
---

[`301 Moved Permanently`][1] tells a client that the resource they're trying
to access has moved to a new location. The server will include the new
location in the `Location` header. 

When a client sees this response, it should repeat the same request on the new
location, and if it can, it should also update any links it may have had to
the old location and update it to the new one.

Example
-------

```http
HTTP/1.1 301 Moved Permanently
Server: Curveball/0.4.2
Location: https://evertpot.com/http/301-moved-permanently
```

Real-world Usage
----------------

According to the specifications, a client _should_ repeat the exact same
request on the new location. In practice, a lot of clients don't do this.

The reality is that when many clients do something like a `POST` request
on a resource that responds with a `301`, almost every client will assume that
the `POST` was successful and do a `GET` request on the new resource for
additional information, including browsers.

This incorrect behavior was so common, that when the HTTP specifications were
updated, the newer documents mention this behavior. In addition, a new
status-code was introduced later that restored the original behavior:
[`308 Permanent Redirect`][3]. 


References
----------

* [RFC7231, Section 6.4.2][1] - 301 Moved Permantently
* [RFC7238][2] - 308 Permanent Redirect

[1]: https://tools.ietf.org/html/rfc7231#section-6.4.2 "301 Moved Permanently"
[2]: https://tools.iets.org/html/rfc7238 "308 Permanent Redirect"
[3]: /http/308-permanent-redirect
