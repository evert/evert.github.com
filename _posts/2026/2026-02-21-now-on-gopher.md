---
title: "Now available on Gopher!"
date: "2026-02-21 11:09:07 -0500"
location: "Toronto, Canada"
geo: [43.68363, -79.34807]
tags:
  - gopher
---

When I just got on the internet and spent a lot of time tinkering with
Windows 98 internet settings, just to get and stay online I first learned
about something called [Gopher][1] via this settings screen:

<figure>
  <img src="/assets/posts/gopher/win98-settings.png" class="fill-width"/>
  <figcaption>Windows 98 proxy setting screen</figcaption>
</figure>

I always had a bit of an obession with obscure protocols, so I was always
a bit curious about this. At the time all major browsers supported Gopher
and occasionally would run into an elusive `gopher://` link, perfectly
integrated with the rest of the web.

In 2006 I learned about `inetd` on linux and it occured to me that I could
potentially build a gopher server with PHP, which was my main language at
the time, so I made a little server and [published it on this blog][2].
Linux doesn't ship inetd by default anymore, but at the time it was a great
way to build simple TCP services without knowing anything about TCP. Just
reading and writing to STDIN and STDOUT was all you needed to do.

I never really kept that gopher site going, mainly because in order to
host it, you need an IP address and a little server, and I didn't really
want to pay for it.

Then a few years after this major browsers dropped support for Gopher, and
Chrome never added support for it.

Fast forward to 2026, and I think gopher is in a bit of a resurgence.
The protocol is very limited, so it's a place without tracking, ads,
comment boxes, corporate interests, AI, misinformation and short-form
video. Now that the excitement and idealism of the internet in mid 00's
is dead and buried, Gopher (and [Gemini][3]) offers a little respite.

The biggest year for Gopher in this century was actually 2025, when the number
of active gopher sites reached a whopping **432** according to
[Wikipedia][1], and even new clients are being made. Most of these sites
are just personal spaces, like the homepages of yore.

I also recently built a little homelab, so this seemed like the perfect time
to finally set up a permament gopher server (or 'hole').

If this sounds interesting, go take a look:

* The Gopher site: <gopher://hole.din.gy>
* The source on GH: <https://github.com/evert/hole/> (feel free to fork and dig your own hole!)

To access gopher sites, the easiest is probably to use `lynx`, found in a
package manager near you, or you can use the shiny [Lagrange][4] client.

If you're interested in the history of Gopher, Abort Retry Fail has a great
article titled ["The Internet Gopher from Minnesota"][5].

[1]: https://en.wikipedia.org/wiki/Gopher_(protocol)
[2]: https://evertpot.com/100/
[3]: https://en.wikipedia.org/wiki/Gemini_(protocol)
[4]: https://gmi.skyjake.fi/lagrange/
[5]: https://www.abortretry.fail/p/the-internet-gopher-from-minnesota
