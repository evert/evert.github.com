---
date: "2019-08-06 15:00:00 UTC"
title: "505 HTTP Version Not Supported"
permalink: /http/505-http-version-not-supported
tags:
   - http
   - http-series
location: "Muskoka, Canada"
geo: [45.197939, -79.779739]
---

[`505 HTTP Version Not Supported`][1] is a status that a server can emit if
it doesn't support the major HTTP version the client used to make the request.

To test this, I opened a telnet connection to a couple of major websites, and
wrote the following:

```http
GET / HTTP/4.0


```

A few sites returned a [`400 Bad Request`][2], but at least Cloudflair returned
`505`:

```http
HTTP/1.1 505 HTTP Version Not Supported
Server: cloudflare
Date: Tue, 30 Jul 2019 15:23:35 GMT
Content-Type: text/html
Content-Length: 201
Connection: close
CF-RAY: -

<html>
<head><title>505 HTTP Version Not Supported</title></head>
<body bgcolor="white">
<center><h1>505 HTTP Version Not Supported</h1></center>
<hr><center>cloudflare</center>
</body>
</html>
```

Currently you're unlikely to run into this error though, unless you have a
buggy client.

We did get a new major HTTP version (2) and a new one is on the way (3), but
the mechanism for switching to HTTP/2 or 3 is different, and will just be
ignored if a HTTP/1.1 server didn't support the new version.


References
----------

* [RFC7231, Section 6.6.6][1] - 505 HTTP Version Not Supported

[1]: https://tools.ietf.org/html/rfc7231#section-6.6.6 "505 HTTP Version Not Supported"
[2]: /http/400-bad-request "400 Bad Request"
