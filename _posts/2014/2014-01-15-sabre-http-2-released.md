---
date: 2014-01-15 01:58:27 UTC
layout: post
title: "sabre/http 2.0 released"
tags:
  - http
  - sabre
  - sabredav

---

Last week we released the 2.0 version of [sabre/http][1]. This package had been
integrated into [sabre/dav][2] since 2009.

The old API was pretty much grown organically based on changing requirements.
It worked well, but had some issues that made it not super intuitive to work
with.

So we used the 2.0 release to take a deep look at the core requirements, and
adjust the API to make it easier to use, while also being more elegant.

What is it?
-----------

[sabre/http][1] provides at it's heart a [Request][3] and a [Response][4]
object.

The request objects acts as a wrapper around the `$_SERVER` array and
`php://input`. The response object wraps `php://output`, `echo()` and
`header()`.

Because all of these PHP language constructs operate globally, by wrapping
these in classes objects we can use all the standard OOP functionality such as
polymorphism.

To aid with this, a [Request-][5], and [ResponseDecorator][6] have also been
included.

In addition to that, it also provides a simple HTTP Client. This client just
wraps around Curl with not much fuss and simply allows you to re-use the
existing Request and Responses, for a consistent experience.

The client doesn't attempt to give you all the features on the planet such
as [Guzzle][7]. It just gives you a simple event-based asynchronous API, but
if you need advanced Curl features, you do get easy access to them.

By doing both a Client and a Server-side of this, this also makes it
ridiculously easy to build stuff like a [reverse proxy server][10] right in
PHP.

To read more, all the documentation can be found on the [github page][11].

How does this compare to symfony's http foundation?
---------------------------------------------------

[Symfony's http-foundation][8] is very similar, in that it provides an OOP
abstraction around PHP requests and responses.

When this library was first written, neither that package, nor an
[easy way to depend on it][9] existed yet. That has changed though, so I did
consider integrating it instead.

The first deterrence was that both it's API and implementation are quite ugly,
there are a massive number of classes, and a bunch of design decisions have
been made that I consider violations of seperations of concerns.

I was willing to get over those for the sake of interopability. The main issue
I ran into then was that I absolutely required features that the authors were
unwilling to implement. Specifically the retention of the capitalization of http
headers.

This made me realize that because [sabre/dav][2] is really a power-user for this
type of package. WebDAV is an extension of HTTP, and uses nearly every feature
out there. It leans much heavier on HTTP than most browser applications and
even API's do. In addition to that it has to work with many broken clients.
WebDAV clients are not nearly as well-behaving as Browsers.

So we decided this package was 'core' enough to maintain ourselves, so we can
have full control over it. Looking back I think this was a good decision, as
symfony has also done a number of backwards-compatiblity breaking releases
since I originally looked at it.

Also, it's a small enough package that there's not that much of a maintenance
burden, and it was hella fun to write.

Integration with SabreDAV
-------------------------

This package will be part of the next major SabreDAV release. So don't use it
with the current line of releases (1.8.x), as it will not work!

In conclusion
-------------

Well, I hope you like it. I'd probably still recommend using symfony's package,
for the sole reason that it has a _much_ larger user-base, but if you are
looking for something pure and lightweight to solve this particular problem,
perhaps you can consider sabre/http instead.

[1]: https://github.com/fruux/sabre-http/
[2]: https://github.com/fruux/sabre-dav/
[3]: https://github.com/fruux/sabre-http/blob/master/lib/Sabre/HTTP/Request.php
[4]: https://github.com/fruux/sabre-http/blob/master/lib/Sabre/HTTP/Response.php
[5]: https://github.com/fruux/sabre-http/blob/master/lib/Sabre/HTTP/RequestDecorator.php
[6]: https://github.com/fruux/sabre-http/blob/master/lib/Sabre/HTTP/ResponseDecorator.php
[7]: http://docs.guzzlephp.org/en/latest/
[8]: https://github.com/symfony/HttpFoundation
[9]: http://getcomposer.org/
[10]: https://github.com/fruux/sabre-http/blob/master/examples/reverseproxy.php
[11]: https://github.com/fruux/sabre-http#sabrehttp
