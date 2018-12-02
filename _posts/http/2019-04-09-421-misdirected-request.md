---
date: "2019-04-09 15:00:00 UTC"
title: "421 Misdirected Request"
permalink: /http/421-misdirected-request
tags:
   - http
   - http-series
---

A server should emit [`421 Misdirected Request`][1] when it receives a HTTP
request that was not intended for that server.

This status was introduced with HTTP/2, but it may also be applicable to HTTP/1
servers. For example, a server might receive the following HTTP request:

```http
GET /contact.html HTTP/1.1
Host: foo.example.org
```

Since HTTP/1.1 a client is required to include a `Host` header. A server might
already know that the `foo.example.org` domain is not configured on that server,
cand could respond with a `421 Misdirected Request` response to tell the client
that it connected to the wrong server:

```http
HTTP/1.1 421 Misdirected Request
Content-Type: text/html

<h1>Switchboard operator error</h1>
```

So when can that actually happen? One example of this is that the DNS for a
server was set to the wrong IP or CNAME, or simply a server configuration
error.

HTTP/2
------

There's other examples where this might occur. In HTTP/2 it will be possible
for a single HTTP/2 connection to be used for multiple domainnames via
[connection coalescing][2].

If a client is trying to use this feature but a server doesn't support it,
it must return `421 Misdirected Request` This is actually the real reason
this status got introduced.

References
----------

* [RFC7540, Section 9.1.2][1] - 412 Misdirected Request

[1]: https://tools.ietf.org/html/rfc7540#section-9.1.2 "421 Misdirected Request" 
[2]: https://daniel.haxx.se/blog/2016/08/18/http2-connection-coalescing/
