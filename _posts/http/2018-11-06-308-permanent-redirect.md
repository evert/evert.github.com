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

A summary of redirects
----------------------

So there's a lot of weird stuff going on with redirects. Many are used
incorrectly. So which should you use? Hopefully the following chart helps:

**Are you responding to a POST request, and instead of showing a status
immidiately, you want to redirect the user to a different (confirmation?) page**

> Use [`303 See Other`][5].

**Did the resource really get a brand new URL (path or domain), and move to a
new location, and you want to make sure that clients do the exact same request
at the new location?**

> Use [`307 Temporary Redirect`][3] if the move was temporary, or
> [`308 Permanent Redirect`][6] if the move was permanent.

**Did the resource move, but you only care about GET requests, because maybe the
resource is a web page?**

> Use [`302 Found`][4] if the move was temporary, or
> [`301 Moved Permanently`][2] if the move was permanent.

**Do you want to send the user somewhere else, but there's more than one place
you can redirect to and you want to let the user decide where to go?**

> Use [`300 Multiple Choices`][7].

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
