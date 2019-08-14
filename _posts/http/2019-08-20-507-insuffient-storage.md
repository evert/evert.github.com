---
date: "2019-08-20 15:00:00 UTC"
title: "507 Insufficient Storage"
permalink: /http/507-insufficient-storage
tags:
   - http
   - http-series
---

[`507 Insufficient Storage`][1] is a status code that's introduced by the
[WebDAV][2], specification. It allows a HTTP server to tell a client that
for example their `PUT` or `POST` operation couldn't succeed, maybe because
it's too large to fit on a disk.

Even though it was written for WebDAV, it can be used outside of WebDAV
servers though.

Example:

```http
HTTP/1.1 507 Insufficient Storage
Content-Type: text/plain

Wow, that's a big file. Can you store it somewhere else? We're pretty cramped
here.
```

Many WebDAV clients handle this status pretty well, and will inform the user
that a disk is full.

Should I use this?
------------------

Even though I think this status is applicable outside of WebDAV, I think the
reality is that the usefulness of this status is somewhat limited.

Because `507` is specifically a server-side error, it kind of indicates that
the error was server side. Maybe the disk being full was not by design or
intentional.

When using a status like this for REST API's, I feel that it's probably more
likely that you'll want to return an error when a user ran out of space, and
intentionally send back a message to a user telling them 'YOU ran out of quota',
instead of 'OUR disk is full'.

If the intent is to inform the user that they exceeded their quota, it's better
to use the more appropriate [`413 Payload Too Large`][3].


References
----------

* [RFC4918, Section 11.5][3] - 507 Insuffient Storage

[1]: https://tools.ietf.org/html/rfc4918#section-11.5 "507 Insufficient Storage"
[2]: https://tools.ietf.org/html/rfc4918 "HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)"
[3]: /http/413-payload-too-large "413 Payload Too Large"
