---
date: "2018-06-28 08:00:00 -0700"
title: "101 Switching Protocols"
permalink: /http/101-switching-protocols
location: "Haight St, San Francisco, CA, United States"
geo: [37.772252, -122.431250]
tags:
   - http
   - http-series
---

[`101 Switching Protocols`][1] is a status code that's used for a server to
indicate that the TCP conncection is about to be used for a different
protocol.

The best example of this is in the [WebSocket protocol][2]. WebSocket uses
a HTTP handshake when creating the connection, mainly for security reasons.

When a WebSocket client starts the connection, the first few bytes will
look like this:

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: http://example.com
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

If the server supports WebSocket, it will response with
`101 Switching Protocols` and then switch to the WebSocket protocol:

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat
```

HTTP/2 also uses this mechanism to upgrade from a HTTP/1.1 to a non-ssl
HTTP/2 connection. See [rfc7540][3].

[1]: https://tools.ietf.org/html/rfc7231#section-6.2.2
[2]: https://tools.ietf.org/html/rfc6455#section-1.2
[3]: https://tools.ietf.org/html/rfc7540#section-3.2
