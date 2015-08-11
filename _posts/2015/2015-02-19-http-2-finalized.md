---
date: 2015-02-19 22:49:48 UTC
layout: post
title: "HTTP/2 finalized - a quick overview"
tags:
    - http
    - featured
---

The HTTP/2 specification [has been finalized][1] and will soon be released as
an RFC. Every major browser will get support for it soon.

This is a major new release of the specification, and builds upon earlier work
such as Google's SPDY protocol (which is now being deprecated). It's the first
major release of the protocol since 1999, which is 16(!) years ago.

While E-mail may still be the most popular protocol on the internet, http
certainly is the most visible and relevant to many developers day-to-day work.

Even [the bbc][19] is talking about it!

As many of you develop HTTP-based applications, here are a few things you
should know:


HTTP/2 is an new way to transmit HTTP/1.1 messages
--------------------------------------------------

HTTP/2 does not make any major changes to how HTTP works. The biggest
difference is in how the information is submitted.

HTTP/1.1 (and 1.0, 0.9) sent everything in plain text, HTTP/2 will use a
binary encoding.

HTTP/2 still has requests, responses, headers, status codes and the same
HTTP methods.

### Subtle differences

1. HTTP/2 encodes HTTP headers as lowercase. HTTP/1.1 headers were already
   case-insensitive, but not everbody adhered to that rule.
2. HTTP/2 does away with the 'reason phrase'. In HTTP/1.1 it was possible
   for servers to submit a human readable reason along with the status code,
   such as `HTTP/1.1 404 Can't find it anywhere!`. Or
   `HTTP/1.1 200 I like pebbles`, but in HTTP/2 this is removed.
3. A new status code! (HTTP geeks love status codes), `421 Misdirected Request`
   allows the server to tell a client that they received a HTTP request that
   the server is not able to produce a response for. For instance, a client
   may have picked the wrong HTTP/2 server to talk to.


Upgrades to HTTP/2 can be invisible and transparent
---------------------------------------------------

Most browsers will start supporting HTTP/2 extremely soon. When a browser
makes a normal HTTP/1.1 request in the future, they will include some
information that tells the server they support HTTP/2 using the [`Upgrade`][2]
HTTP header. For HTTPS, this is done using a [different mechanism][3].

If the server supports HTTP/2 as well, the switch will happen instantly
and this will be invisible to the user.

Everyone will still use `http://` and `https://` urls.

If a HTTP client already knows the server will support HTTP/2, they can
start speaking HTTP/2 right from the get-go.

Many server-side developers don't have to think much about this. If you are
a PHP developer, you can just upgrade to a HTTP server that does HTTP/2,
and the rest will be transparent.


HTTP/2 is probably faster
---------------------------

There are a few major features that improve speed when switching to HTTP/2:

A lot of bytes in HTTP/1.0 are wasted because of bytes being sent back and
forward in the HTTP headers. In HTTP/2 HTTP headers can be compressed
using the new [HPACK][4] compression algorithm.

A big feature that came with HTTP/1.1 was 'pipelining'. This is a feature
that allows a HTTP client to send multiple requests in a connection without
having to wait for a response. Because of poor and broken implementations, this
feature has never really been enabled in browsers. In HTTP/2 this feature
comes out of the box. Only one TCP connection is needed per client, and a
client can send and receive multiple requests and responses in parallel. If
one of the HTTP responses is stalled, this doesn't block the rest of the HTTP
responses.

So for application this can mean:

1. Less HTTP connections open
2. Less data being sent
3. Less round-tripping


Server push
-----------

In HTTP/2 it's possible to preemptively send a client responses to requests,
before the requests were made.

This can seriously speed up application load time. Normally when a HTML
application is loaded, a client has to wait to receive all the `<img>`,
`<script>` and `<link>` tags to know what else needs to be requested.

Server push allows the server to just send out those resources before the
client even requested them.

In the case of a server push, the server actually sends back _both_ the
HTTP response, _and_ the actual request that the client would have had to
send in order to receive the response. The request is sent in a
`PUSH_PROMISE` frame.


Streams and frames
------------------

HTTP/1.1 has a very distinct "request" and "response" flow in it's messaging.
A new response can only be sent over the wire after the last one has completed.

In HTTP/2 multiple messages can be sent at the same time. Every message
that's currently being sent gets its own "stream".

The messages get sent 'interleaved' by splitting them up in multiple "frames".

This is not unlike video formats, which also is split up in multiple streams
(video, audio, subtitles) and also gets split up interleaved frames.

There's a few different frame types:

1. The [`DATA`][5] frame carries a list of bytes, for example to encode HTTP
   request and response bodies.
2. The [`HEADERS`][6] frame carries a list of HTTP headers.
3. The [`PRIORITY`][7] frame allows the sender of a message (client or server)
   to indicate that a certain stream should get a higher or lower priority.
   This is useful in situations where there's limited capacity available.
4. The [`RST_STREAM`][8] frame is used to terminate a stream in case of an
   error.
5. The [`SETTINGS`][9] frame is used for senders to indicate how they wish
   to communicate. For example, a client can indicate that it does not wish to
   get resources preemptively pushed by the server.
6. The [`PUSH_PROMISE`][10] is a message that the server sends to the client
   with information about a server-push that will in the future be sent.
7. The [`PING`][11] allows a peer to measure the roundtrip time between client
   and server, and is a simple way to find out of the other peer is still
   alive.
8. The [`GOAWAY`][12] allows a peer to inform that no new streams should be
   started on the current connection, and instead open up a new connection.
9. The [`WINDOW_UPDATE`][13] frame may be used to implement 'flow control',
   which apparently may help peers with resource constraints, such as memory.
10. The [`CONTINUATION`][14] frame follows a `HEADERS` or `PUSH_PROMISE`
   frame and contains additional data that didn't fit in the last frame.

Typical HTTP requests and responses therefore usually consist of:

1. A `HEADER` frames, followed by zero or more `CONTINUATION` frames
2. Zero or more `DATA` frames with the message body.

A response may have more than one `HEADER` frame at the start, as sometimes a
server will send back more than 1 HTTP status line (Such as `100 Continue`
followed by `200 OK`).

A response may also have additional `HEADER` frames _after_ the data. Yes,
HTTP headers may sometimes be sent after the body, even in HTTP/1.1.

After all frames for a request of response have been sent, the stream is no
longer open.


Further reading
---------------

Wanna know more?

* Read the [current spec][15].
* Check out [Nghttp2][16], for a bunch of HTTP/2-related tools.
* [How speedy is SPDY][17], talks about SPDY, but is also relevant to HTTP/2.
* [Server side push with nghttp2][18] by Mattias Geniar.

[1]: https://www.mnot.net/blog/2015/02/18/http2
[2]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-3.2 "Starting HTTP/2 for http URIs"
[3]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-3.3 "Starting HTTP/2 for https URIs"
[4]: https://tools.ietf.org/html/draft-ietf-httpbis-header-compression "HPACK - Header Compression for HTTP/2"
[5]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.1 "DATA"
[6]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.2 "HEADERS"
[7]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.3 "PRIORITY"
[8]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.4 "RST_STREAM"
[9]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.5 "SETTINGS"
[10]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.6 "PUSH_PROMISE"
[11]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.7 "PING"
[12]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.8 "GOAWAY"
[13]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.9 "WINDOW_UPDATE"
[14]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17#section-6.10 "CONTINUATION"
[15]: https://tools.ietf.org/html/draft-ietf-httpbis-http2-17 "HTTP/2"
[16]: https://nghttp2.org/ "Nghttp2"
[17]: https://www.usenix.org/sites/default/files/conference/protected-files/nsdi14_slides_wang.pdf "How speedy is SPDY"
[18]: http://ma.ttias.be/service-side-push-http2-nghttp2/
[19]: http://www.bbc.co.uk/news/technology-31520413
