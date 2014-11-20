---
date: 2014-11-20 05:48:48 UTC
layout: post
title: "sabre/dav 2.1 released."
tags:
    - sabre/dav
    - release
---

6 months after the [last][1] major release, we just put sabre/dav 2.1 live.

I'm very excited to announce that we finally have support for CalDAV
scheduling ([rfc6638][rfc6638]), which is a big deal and was hard to implement.

This means that invitations can get processed automatically, delivered to
other CalDAV users, and clients that support scheduling will be able to
accept or decline invites directly on the server, and ask for free-busy
information.

We also now support vCard 4.0 ([rfc6350][rfc6350]), jCard ([rfc7095][rfc7095])
and converting between vCard 3, 4, and jCard using content-negotiation.

Thanks all! I hope it's well received :)

The [full announcement][2] can be found on the [website][2].

As usual, we also prepared a [migration document][3] if you are upgrading from
and older version.

[1]: http://sabre.io/blog/2014/sabredav-2-release/
[2]: http://sabre.io/blog/2014/sabre-dav-2.1-release/
[3]: http://sabre.io/dav/upgrade/2.0-to-2.1/
[rfc6047]: http://tools.ietf.org/html/rfc6047
[rfc6638]: http://tools.ietf.org/html/rfc6638
[rfc6350]: http://tools.ietf.org/html/rfc6350
[rfc7095]: http://tools.ietf.org/html/rfc7095
