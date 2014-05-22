---
date: 2014-05-22 17:27:07 UTC
layout: post
title: "sabre/dav 2.0 released."
tags:
    - sabre/dav
    - release
---

I just released sabre/dav 2.0. It's been 18 months since 1.8, and almost 5
years since the 1.0 release, so it's been a long time coming.

PHP 5.3 support is now dropped, PSR-4 adopted, and it spawned two new php
packages: [sabre/event][1] and [sabre/http][2]. Hopefully they are useful
beyond the realm of sabre/dav.

We've made lots of performance jumps, did a ton of refactoring and added a
bunch of new features.

Thanks everyone for hanging in there, and I hope everybody likes what we've
done so far ;).

The [full announcement][3] can be found on the [website][3].

If you did any customizations and you're upgrading from 1.8, we also wrote
[extensive upgrade instructions][4] that hopefully covers everything.

[1]: https://github.com/fruux/sabre-event
[2]: https://github.com/fruux/sabre-http
[3]: http://sabre.io/blog/2014/sabredav-2-release/
[4]: http://sabre.io/dav/upgrade/1.8-to-2.0/
