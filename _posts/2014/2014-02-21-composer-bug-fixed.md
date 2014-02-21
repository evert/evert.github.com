---
date: 2014-02-21 15:43:05 UTC
layout: post
title: "Composer's bug now fixed"
tags:
  - php
  - composer
  - packagist
---

As an update to my [previous post][1], the composer security problem now
[appears][2] [fixed][2].

Good to see that a quick response was possible after all.

To get the latest composer, run:

    composer self-update

My previous post was not received really well among some of the composer
stakeholders, but I feel it's important to stand my ground here.

Software is going to have security problems. There's no shame in that. When a
security problem is discovered, it is very important to handle this in a
responsible manner.

Lacking a quick solution for a security problem, it could have been a wise
thing to at least release a statement such as "we are aware of this, and we
are working on this". Arguing about wether this was a security problem or not
is a debate I'd be happy to take on (still) but in the meantime, people are
installing packages and php code that they don't expect.

Still a huge fan of composer though. Here's to a swiftly 1.0 version ;)

[1]: http://evertpot.com/composer-is-wide-open/
[2]: https://github.com/composer/composer/issues/2690
[3]: https://github.com/composer/composer/pull/2733
