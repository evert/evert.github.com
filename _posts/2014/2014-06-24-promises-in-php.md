---
date: 2014-06-24 05:56:03 UTC
layout: post
title: "Promises in PHP"
tags:
    - promises
    - sabre
    - event
    - featured
---

We just released [sabre/event 2.0][1] last week, featuring support for
Promises.

It's still kinda rare to need Promises in PHP. PHP isn't asynchronous the same
way languages such as javascript are, and there's no real eventloop, unless
you're one of the few that use [libevent][2] in PHP. It actually took me a long
time to fully grasp promises up to a point where I was comfortable writing an
implementation.

So despite being interested in the pattern, it took a while for me to find a
use-case where it actually made sense to deploy it.

Recently I was tasked to write a client for a webservice that would require:

1. Lots and lots of HTTP request for many users.
2. Some of which were _required_ to happen in a specific order.
3. Others could happen in parallel.

Using Promises was absolutely ideal here, and a lot of fun. So I added it
to the sabre/event library.

I managed to compress the full concept into [a single, relatively simple
class][4],
but it took a fair bit of step-through debugging to figure out what I did
wrong at times.

The full documentation for it can be found [on the website][3]. I hope others
have some use for it!

[1]: http://sabre.io/event/
[2]: http://www.php.net/manual/en/book.libevent.php
[3]: http://sabre.io/event/promise/
[4]: https://github.com/fruux/sabre-event/blob/master/lib/Promise.php
