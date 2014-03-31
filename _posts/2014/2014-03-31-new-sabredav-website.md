---
date: 2014-03-31 21:16:49 UTC
layout: post
title: "New sabre/dav website launched!"
tags:
  - sabredav
  - sabre.io
---

We just released a brand new website for [sabre/dav][1], on
[http://sabre.io][1]. This new site is completely built on [Sculpin][2], which
is the best static site generator for PHP.

This was a long time coming! sabre/dav had always been hosted on google code,
but as google started caring less and less about their code hosting property,
it was time to look for a change.

Over time issues and source had already migrated to [GitHub][3], but the
biggest thing left was the wiki, which required porting of the
google wiki markup.

We started work in October, and finally we finished enough stuff that we're
comfortable releasing it.

Now I can go all out writing news stories there too. For the longest time this
was my only blog, so I felt like I had to make sure I didn't over-broadcast
sabre/dav related news, in order to not sound spammy and toot my own horn too
much.

Go [subscribe][5]!

And yes, we also changed the branding from _SabreDAV_ to _sabre/dav_. We've
been with composer since the early days, and the typograpgy now matches the
composer package name :).

Flexible boxes
--------------

One nice thing was that since this is a website primarily targetted towards
technologists, I've also felt a lot safer taking advantage of all the latest
features, and ignoring pretty much any browser that's not the most recent.

Since a little while we now have an awesome new CSS layout feature:
`flexible boxes`.

Having worked with this a little bit (and many years ago too in XUL), I feel
I can safely say, that within a few years, 90% of you will be using this
feature, as opposed to CSS grid systems, absolute positioning, float, etc.

Your css source will be greatly reduced. You can automatically re-order DOM
objects based on screen-size, you will need a _lot_ less container divs and
you can say goodbye to shitty css classes that frameworks such as bootstrap
require.

If you've ever had to do any HTML layouts (and I'm sure you have, and will
again), do yourself a favor and [learn about it][4]!

Everything was also writting from the ground up using
`box-sizing: border-box`, which makes the css math a lot easier as well.

Thanks!
-------

We'd love to hear what you think. Any bugs? Let us know [in the comments][6].

[1]: http://sabre.io/
[2]: https://sculpin.io/
[3]: https://github.com/fruux/sabre-dav
[4]: https://developer.mozilla.org/en-US/docs/Web/CSS/flex
[5]: http://sabre.io/atom.xml
[6]: http://sabre.io/blog/2014/new-website/
