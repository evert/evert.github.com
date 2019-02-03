---
date: "2019-05-28 15:00:00 UTC"
title: "428 Precondition Required"
permalink: /http/428-precondition-required
tags:
   - http
   - http-series
---

To avoid multiple users writing to the same resources and overwriting each
others changes, its useful to take advantage of conditional requests, using
the `If-Match`, `If-None-Match`, `If-Modified-Since` and `If-Unmodified-Since`
headers.

These headers are opt-in though. If a server wants to force a client to use
them, a server can return [`428 Precondition Required`][1]. Forcing clients to use
Etags and precondition means there's a lower chance of clients overwriting
changes, because they are forced to to consider the current state of the
service before changing something.

[`412 Precondition Failed`][2] is a bit different, as that status code is only
used when a client did submit precondition headers, but the headers didn't
match the current state of the resource.


Example
-------

```http
PUT /foo.txt HTTP/1.1
Content-Type: text/plain

Hello world
```

```http
HTTP/1.1 428 Precondition Required
Content-Type text/plain

Please try submitting this request again with a If-Match header
```

References
----------

* [RFC6585, Section 3][1] - 428 Precondition Required

[1]: https://tools.ietf.org/html/rfc6585#section-3 "428 Precondition Required"
[2]: /http/412-precondition-failed "412 Precondition Failed"
