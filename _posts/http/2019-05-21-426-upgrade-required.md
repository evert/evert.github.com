---
date: "2019-05-21 15:00:00 UTC"
title: "426 Upgrade Required"
permalink: /http/426-upgrade-required
tags:
   - http
   - http-series
---

The [`426 Upgrade Required`][1] status code is used when a server wants to
tell a client that they should be using a newer version or different protocol
to talk to the server.

Example
-------

```http
HTTP/1.1 426 Upgrade Required
Upgrade: HTTP/3
Connection: Upgrade

To use this service, you must use HTTP version 3. 
```

Usage
-----

Generally when an existing TCP connection switches from one protocol to another,
the client initiates with an `Upgrade` header in the request, and the server
responds with [101 Switching Protocols][2]. This is true for initiating a
Websocket connection and for switching a (non-TLS) HTTP/1 to HTTP/2 connection.

However, I haven't seen any examples of a server forcing a new connection version.

I can imagine that during the upgrade from HTTP/1.0 to HTTP/1.1 this could have
been useful and thus this feature may have been added to prepare for situations
where servers want to enforce a client to use a newer version.

If you have a legit use-case for this, it makes sense to use `426` to force an
upgrade from say, HTTP/1.1 to HTTP/2 or HTTP/3 but clients might not yet
support this out of the box (note: untested). My hypothesis for clients not
yet needing this is because clients that support the potential upgrade targets
(HTTP 2 or 3) will already optimisitcally try to make that connection.

References
----------

* [RFC7231, Section 6.5.15][1] - 426 Upgrade Required

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.15 "426 Upgrade Required"
[2]: /http/101-switching-protocols
