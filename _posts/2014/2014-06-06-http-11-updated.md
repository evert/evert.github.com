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
