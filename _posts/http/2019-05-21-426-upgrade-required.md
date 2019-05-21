---
date: "2019-05-21 18:22:02 UTC"
title: "426 Upgrade Required"
permalink: /http/426-upgrade-required
tags:
   - http
   - http-series
location: Collision Conference, Toronto
geo: [43.634890, -79.412943]
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

When a HTTP connection is switched to another protocol (such as [Websocket][3]),
typically this is done via the `Upgrade` header in the request, and the server
responding with  [101 Switching Protocols][2]. This is true for initiating a
Websocket connection and for switching a (non-TLS) HTTP/1 to HTTP/2 connection.

The `426` status code could be used by a server to force this protocol switch,
however, I haven't seen any examples personally of servers doing this.

I can imagine that during the upgrade from HTTP/1.0 to HTTP/1.1 this could have
been useful and thus this feature may have been added to prepare for situations
where servers want to enforce a client to use a newer version.

I believe this is also used by people who are forcing a switch from HTTP to
HTTPS without an automated redirect.

I'm not aware if there are clients that can switch protocols or protocol
versions automatically, and I don't know if browsers support this out of the
box. My guess is no, but I don't have a source for this.

References
----------

* [RFC7231, Section 6.5.15][1] - 426 Upgrade Required

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.15 "426 Upgrade Required"
[2]: /http/101-switching-protocols
[3]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
