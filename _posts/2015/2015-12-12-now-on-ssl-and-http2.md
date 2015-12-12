---
date: 2015-12-12 02:26:40 -0500
layout: post
title: "Now available via TLS and HTTP/2"
tags:
    - http2
    - ssl
    - meta
---

Something that's been bugging me for a bit, was that my blog was only ever
available over unencrypted HTTP.

Even though it's just a simple blog, it would be nicer to be able to just use
the latest tech and best practices. It is my profession after all, so I want
tot set an example. But I use [github pages][1] for my blog
([full source here][2]) and I don't really feel like running my own webserver.

Recently I found out though that [CloudFlare][3] offers a free service that
effectively puts a SSL/TSL proxy in front of any site, with free SSL
certificates and HTTP/2 support.

So now this blog also has all those features! I feel like I'm back in the game!

[1]: https://pages.github.com/
[2]: https://github.com/evert/evert.github.com/
[3]: https://www.cloudflare.com/
