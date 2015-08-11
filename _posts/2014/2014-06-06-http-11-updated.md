---
date: 2014-06-07 03:17:48 UTC
layout: post
title: "HTTP/1.1 just got a major update."
tags:
    - http
    - ietf
    - rfc
    - featured
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

These documents make the original specification for HTTP/1.1 **obsolete**.
As a HTTP geek, this is a big deal.

[RFC 2616][11], which was written more than 15 years ago, was _the_
specification everybody has implemented, and I suspect many of you
occassionally have used as a reference.

Since then, the HTTPBis group has worked from what I can tell, at least 7
years on updating these specs. You can imagine that for a protocol as
widespread as HTTP, there will be many stakeholders and opinions to satisfy.

HTTP/2.0, which is still under development, will also reference these rfcs
and essentially just link to them, as opposed to re-define all the definitions
from scratch.

I've been using the drafts of these new standards documents for years, as it
did not take long for them to be much references than the original.


What's new?
-----------

The biggest difference compared to the old spec, is that there is simply a lot
more text. A lot of things are easier to understand and read, and parts where
there were ambiguity has been resolved.

A second change is that the core specification has now been split up over 6
separate specs, whereas before there was just [RFC 2616][11] for HTTP, and
[RFC 2617][12] for Basic and Digest authentication.

Just for those reasons alone it may make a lot of sense for API authors to
read the specs from end-to-end. Guarenteed you'll learn and get inspired into
doing better HTTP api design.

Furthermore the `308` status code is now standard, which provides a 4th
redirect status. `308` is a permanent redirect. Clients that receive a `308`
are expected to follow the redirect and execute the exact same request again.
This, as opposed to the `301`, where clients usually change the method into
a `GET`.

[RFC 7239][10] standardizes a `Forwarded` header, which is supposed to replace
headers such as `X-Forwarded-For` and `X-Forwarded-Proto`.

### A far from complete list of interesting things that have changed.

* Clarifications around dealing with unexpected whitespace, which should
  fix response splitting vulnerabilities.
* The limit of two connections per server has been removed.
* HTTP/0.9 support has been dropped.
* Default charset of ISO-8859-1 has been removed.
* Servers are no longer required to handle all `Content-*` header fields.
* `Content-Range` has been explicitly banned in PUT requests.
* It's now suggested to use the `about:blank` uri in the `Referer` header
  when no referer exists, to distinguish between "there was no referrer" and
  "I don't want to send a referrer".
* The `204`, `404`, `405`, `414` and `501` status codes are now cachable.
* The status codes `301` and `302` have been changed to allow user agents
  to rewrite the method from `POST` to `GET`. This is a good example of a case
  where everybody has been (incorrectly) already doing this, and the spec now
  reflects the real world implementation.
* The `Location` header can now contain relative uri's as well as fragment
  identifiers.
* `Content-MD5` has been removed.

Anything else I missed?

References
----------

* [Post from the chair the IETF HTTPbis Working Group][13]

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
[13]: https://www.mnot.net/blog/2014/06/07/rfc2616_is_dead
