---
date: 2016-03-22 20:49:42 -0400
layout: post
title: "Npm package author revokes his packages, breaking tons of builds"
tags:
    - npm
    - js
    - vendoring
    - composer
---

I just came across an [interesting post][1] via [Hacker News][2], from an
author of several hundred NPM packages (some of which quite popular) that
just removed all this packages from NPM.

Tons of other projects around the world depending on his packages broke as
a result of this. The NPM project responded by un-un-publishing the packages:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Hey npm users: left-pad 0.0.3 was unpublished, breaking LOTS of builds. To fix, we are un-un-publishing it at the request of the new owner.</p>&mdash; Laurie Voss (@seldo) <a href="https://twitter.com/seldo/status/712414400808755200">March 22, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

While you can say that the original author was not very nice to do this as
a protest, and without warning, I think it highlights a larger underlying
problems that exist not just in the NPM ecosystem:

* External authors of packages you depend on must be trustworthy.
* Package repositories such as NPM, Packagist, etc, must be trusted.

Both are single points of failure for a lot of projects, except the few
that actually commit their `node_modules`, `vendor`, etc directories to
their github repository.

Another interesting thing is that package authors can not just un-publish
their packages, they can even modify already-released packages.

I think this is a very weak link in our infrastructure. What we need is a
packagisting system that is:

* Immutable / Append-only
* Decentralized
* Lots of redundancy.

Meaning that once you publish a package, it can never be changed or
unpublished. It can't be censored or taken down. This puts the control
back in the hands of the user, and we're no longer at the mercy of package
developers or centralized repositories.

[1]: https://medium.com/@azerbike/i-ve-just-liberated-my-modules-9045c06be67c
[2]: https://news.ycombinator.com/item?id=11340510
