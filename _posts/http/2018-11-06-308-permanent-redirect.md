---
date: "2018-11-06 08:00:00 -0700"
title: "308 Permanent Redirect"
permalink: /http/308-permanent-redirect
location: "San Francisco, US"
tags:
   - http
   - http-series
---

[`308 Permanent Redirect`][1]  is similar to [`301 Moved Permanently`][2].
Both indicate that the resource the user tried to access has moved to a new
location. In both cases the client should update any bookmarks they had from
the old to the new location. Search engines respect these statuses too.

The difference between `301` and `308` is that a client that sees a `308`
redirect _MUST_ do the exact same request on the target location. If the
request was a `POST` and and had a body, then the client must do a `POST`
request with a body on the new location.

In the case of `301` a client _may_ do this. In practice, most clients don't
do this and convert the `POST` request to a `GET` request.

The `308` is relatively new, and is currently marked as experimental in
[RFC7238][1]. Most modern clients support it, but you might run into some
issues with older clients.

Example
------

```http
HTTP/1.1 308 Permanent Redirect
Location: https://evertpot.com/http/308-permanent-redirect
Server: Apache/2.4.29
```


References
----------

* [RFC7238][1] - Status Code 308 (Permanent Redirect).

[1]: https://tools.ietf.org/html/rfc7238 "308 Permanent Redirect"
[2]: /http/301-moved-permanently
[3]: /http/307-temporary-redirect
[4]: /http/302-found
[5]: /http/303-see-other
[6]: /http/308-permanent-redirect
[7]: /http/300-multiple-choices
