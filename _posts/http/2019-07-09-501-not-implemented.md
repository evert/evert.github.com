---
date: "2019-07-09 15:00:00 UTC"
title: "501 Not Implemented"
permalink: /http/501-not-implemented
tags:
   - http
   - http-series
---

A server can return [`501 Not Implemented`][1] when it doesn't support a
certain feature.

The RFC specifically lists 'not supporting a specific HTTP method on any
resource' as an example of this.

In most practical cases this is similar enough to [`405 Method Not Allowed`][2],
and 405 is probably the clearer status code for most cases.

But there is a difference. Given that 5xx are server-side errors and 4xx errors
are client-side errors, it could be argued that emitting a 405 means that a
method should never really have been called by a client, but a 501 could mean
that the method should have worked, but the server has incomplete functionality.

I sometimes use 501 during development of new API's as a 'stub response' for
features I intend to build, but haven't built yet.

Example
-------

```http
HTTP/1.1 501 Not Implemented
Content-Type text/html

<img src="http://geocities.example/work-in-progress.gif" />
```

References
----------

* [RFC7231, Section 6.6.2][1] - 501 Not Implemented

[1]: https://tools.ietf.org/html/rfc7231#section-6.6.2 "501 Not Implemented"
[2]: /http/405-method-not-allowed
