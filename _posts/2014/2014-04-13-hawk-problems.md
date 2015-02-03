---
date: 2014-04-13 19:05:41 UTC
layout: post
title: "Hawk Autentication considered harmful."
tags:
  - hawk
  - http
  - digest
  - aws
  - sabre/http
---

I was asked recently to add support for [Hawk][1] to [sabre/http][2]. It kinda
seemed like a fun addition, but I'm building an increasing grudge, up to a
point where I've nearly lost interest.

Missing documentation
---------------------

The documentation is incomplete. The author points to his own javascript-based
implementation as _the_ reference, but 1700 lines of javascript code is simply
not as easy to read as a plain-english reference.

In addition, the version of the protocol (currently 2.0) appears to be locked
to the javascript library, and not the actual protocol.

This means that if bugs get fixed in the javascript source, the protocol
version gets a bump. Leaving us no way to figure out something changed in the
protocol, unless you're willing to go through the diffs for the source.

Uses the used hostname and port as part of the signed string
------------------------------------------------------------

The both the hostname and the port are part of the signed string, unlike
alternatives like [AWS][3] authentication and [Digest][4].

The only case where this would actually be relevant, is if there's two
endpoints with _identical_ urls, and re-uses the same keys and secrets, and
a identical request on the same url would be unwanted.

The drawback is that many service don't know what url was originally being used
by a client, due to the use of reverse proxies.

Now we're forced to create a mechanism where the reverse proxy sends the
original host header to the client.


Could have built upon Digest auth
---------------------------------

Digest has a lot of good things going for it, and has a great deal of overlap
in features.

Hawks strengths here are that it uses a stronger hash algorithm (hmac-sha256)
and unlike Digest, it there's no need for pre-flighted requests to discover
the service nonce.
The latter is also the author's main concern with using Digest instead, as
stated in the FAQ.

An answer to that would have been rather simple though. Any server could
simply hardcode and document their server-side nonce, rendering the initial
negotiation optional, but still possible.

Furthermore, digest can be easily extended with new algoritms.


What to use instead?
--------------------

I'd highly recommend using simply either [HTTP Digest][4], or if you're looking for
something a little bit more fancy, use [Amazon's authentication header][3].

Some benefits:

* They are tried and tested for many years.
* Not a moving target.
* Documented.
* Easier to implement.
* Have lots of sample implementations.

That being said, I will probably still add support to an upcoming version of
[sabre/http][2].

[1]: https://github.com/hueniverse/hawk
[2]: https://packagist.org/packages/sabre/http
[3]: http://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html
[4]: http://tools.ietf.org/html/rfc2617
