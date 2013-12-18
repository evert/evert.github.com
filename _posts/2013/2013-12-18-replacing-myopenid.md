---
date: 2013-12-18 19:49:38 UTC
layout: post
title: "Replacing MyOpenID"
tags:
  - myopenid
  - openid
  - indieauth

---

In September Janrain announced that they were shutting down [MyOpenID][1].
Janrain was always one of the biggest OpenID proponents, so them calling it
quits is quite significant. For me, this was definitely the last nail in
the coffin. MyOpenID will go down February 1st, 2014.

Too bad really, because I really liked OpenID from a conceptual perspective,
and [this blog][2] tells me I've been a fan since at least 2006.
[I predicted][3] in 2009 (apparently) that it was already going down a route
of over-engineering, even though the scope of the OpenID specifications was
rather minimal compared to how things are looking right now.

At the moment you can't even find the specifications on the [OpenID website][4]
website without some intense searching, which is a stark contrast from for
example [OAuth][5].

What now?
---------

Even though I wouldn't recommend anyone building anything new with openid,
there's still a lot of sites that still use it for authentication. The biggest
one I use on a daily basis being [Stack Overflow][7].

MyOpenID provided a way to setup your own domain for authentication, so I used
me.evertpot.com for a long time.

So I recently discovered [IndieAuth][7], which is a cool authentication
provider. IndieAuth supports OpenID since recently.

IndieAuth works by delegating authentication to a number of services they
support, such as [GitHub][8], [Twitter][9] and [Google][10].

To set it up
------------

On the domain you own, add the following meta tags:

```html
<link rel="openid.server" href="https://indieauth.com/openid" />
<link rel="openid.delegate" href="http://evertpot.com/" />
```

Change my domain for your own ;).

Then somewhere on this page (http://evertpot.com/ in my case), you need to
create links to the sites you want to use for authentication.

In my case I linked with Twitter and GitHub, so on my main page you'll see
the following links:

```html
<a href="https://twitter.com/evertp" rel="me">@evertp</a></li>
<a href="https://github.com/evert" rel="me">evert</a></li>
```

The link to my profile and `rel="me"` is what's important here. On both my
GitHub and Twitter accounts, I now need to create links _back_ to
http://evertpot.com/. To do this, you simply need to make sure that these
respective profile pages link back to your homepage.

You can see this on [my GitHub profile][11].

Then, head over to [IndieAuth][7]. Log in once using their form, and you're
off.

Easy, and you're in control...


Some issues
-----------

IndieAuth can't pick up my Twitter account for some reason. I assume that
that's a bug yet to fix.

Initially my website didnt have the `<html></html>` start and end tags. These
tags became optional in HTML5, but almost every OpenID consumer (such as
Stack Overflow) trips on that, as well as IndieAuth itself. So I begrudgingly
added them back.

Scanning for providers also fails with 500 Internal Server Error from time to
time. Refreshing and trying again helps. One providers are discovered, this
infromation is retained though.. so you likely only run into this the first
time.

All of this together makes me feel that IndieAuth is still beta quality. The
fact that the website comes out broken on Firefox on certain widths strongly
underlines that.

But for now it solves my problem. Keeping control of my OpenID identity until
nobody has even heard of OpenID anymore.

But I like OpenID!
------------------

Well next time we have an awesome open standard, lets not hand over control
to a committee, shall we? Back when OpenID was part of [LiveJournal][12],
things we're pretty awesome. For you youngsters, these were the same guys that
gave us [memcached][13] and [gearman][14].

I'm now placing all my bets on [BrowserID a.k.a. Mozilla Persona][15].

[1]: https://www.myopenid.com/
[2]: http://evertpot.com/99/
[3]: http://evertpot.com/247/
[4]: http://openid.net/
[5]: http://oauth.net/
[6]: http://stackoverflow.com/
[7]: https://indieauth.com/
[8]: https://github.com/
[9]: https://twitter.com/
[10]: https://accounts.google.com/
[11]: https://github.com/evert
[12]: http://www.livejournal.com/
[13]: http://memcached.org/
[14]: http://gearman.org/
[15]: https://login.persona.org/
