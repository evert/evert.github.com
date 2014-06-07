---
date: 2014-06-07 03:17:48 UTC
layout: post
title: "HTTP/1.1 just got a major update."
tags:
    - http
    - ietf
    - rfc
---

The IETF just published several new RFCs that update HTTP/1.1:

* [RFC 7230: Message Syntax and Routing][1]
* [RFC 7231: Semantics and Content][2]
* [RFC 7232: Conditional Requests][3]
* [RFC 7233: Range Request][4]
* [RFC 7234: Caching][5]
* [RFC 7235: Authentication][6]
* [RFC 7236: Authentication Scheme Registrations][7]
* [RFC 7237: Method Registrations][8]
* [RFC 7238: the 308 status code][9]
* [RFC 7239: Forwarded HTTP extension][10]

These documents make the original HTTP/1.1 **obsolete**. As a HTTP geek, this
is a big deal.

[RFC 2616][11], which was written more than 15 years ago, was _the_
specification everybody has implemented, and I suspect many of you
occassionally has read.

Since then, the HTTPBis group has worked from what I can tell, at least 7
years on updating these specs. You can imagine that for a protocol as
widespread as HTTP, there will be many stakeholders and caveats.

HTTP/2.0, which is still under development, will also reference these rfcs
and essentially just link to them, as opposed to re-define all the definitions
from scratch.

I've been using the drafts of these new standards documents for years, as it
did not take long for them to be much references than the original.


What's new?
-----------

The biggest difference compared to the old spec, is that there is simply a lot
more text. A lot of things are easier to understand and read, and parts where
there were ambigiousness have been resolved.

A second change is that the core specification has not been split up over 6
separate specs, whereas before there was just RFC 2616 and [RFC 2617][12] for
Basic and Digest authentication.

Just for those reasons it may make a lot of sense for API authors to read the
specs from end-to-end. Guarenteed you'll learn and get enspired into doing
better HTTP api design.

Furthermore the `308` status code is now standard, which provides a 4th
redirect status. `308` is a permanent redirect. Clients that receive a `308`
are expected to follow the redirect and execute the exact same request again.
This, as opposed to the `301`, where clients usually change the method into
a `GET`.

[RFC 7239][10] standardizes a `Forwarded` header, which is supposed to replace
headers such as `X-Forwarded-For` and `X-Forwarded-Proto`.


[1]: http://tools.ietf.org/html/rfc7230
[2]: http://tools.ietf.org/html/rfc7231
[3]: http://tools.ietf.org/html/rfc7232
[4]: http://tools.ietf.org/html/rfc7233
[5]: http://tools.ietf.org/html/rfc7234
[6]: http://tools.ietf.org/html/rfc7235
[7]: http://tools.ietf.org/html/rfc7236
[8]: http://tools.ietf.org/html/rfc7237
[9]: http://tools.ietf.org/html/rfc7238
[10]: http://tools.ietf.org/html/rfc7239
[11]: http://tools.ietf.org/html/rfc2616
[12]: http://tools.ietf.org/html/rfc2617
