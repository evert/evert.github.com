---
title: "Switching to Fedora from Ubuntu"
date: "2023-03-30 16:00:00 UTC"
geo: [43.663961, -79.333157]
location: "Leslieville, Toronto, ON, Canada"
tags:
  - fedora
  - ubuntu
  - linux
  - os
---

It seems like every 7-8 years I'm switching operating systems. In 2006 I first
started using Apple, because it was just so damn cool to have a well working
Unix-like system. (I'll never forget you Snow Leopard).

In 2015 I switched to Ubuntu. Apple's Software seemed to hit rock bottom at
this point from a quality perspective, and hardware seemed to go obsolete at
a rate I hadn't seen before. Fed up paying a premium price for a sub-par
product, it was [time for a change][2].

<img style="float: left; max-width: 25%; padding: 0 10px 10px 0" alt="Ubuntu's logo deterioated" src="/assets/posts/fedora/ubuntu-fried.png" />

Ubuntu's fall
-------------

Ubuntu was the obvious choice. I want something that just works, and [Dell's
XPS 13 Developer Edition][1] ships with Ubuntu which means hardware support
from Dell itself. Breath of fresh air and fast as hell. The experience was
similar to what people have been saying about the new M1 chips.
But it's fast because of software, not hardware.

But something changed with Ubuntu in recent years. I think linux users have
a thicker than usual skin when it comes to software issues and are willing
to look past more things. But Ubuntu's quality has been consistently falling.
I was being worn down, and it seems to be a common sentiment in my bubble.

The best example is Ubuntu's package manager Snap. A pretty good idea, I like
the branding too but the execution hasn't been there. Ubuntu users have been
effectively beta-testing this for years. Just to give you an idea I made a
[giant list of bugs][3] that I ran into when Ubuntu switched Firefox from apt
to Snap.

To be honest I feel a bit bad ragging on Ubuntu, because without knowning
*anything* about how the project and Canconical is run, my intuition is
that the steam is just kind of running out for them. Ubuntu feels 'depressed',
but maybe it's all in my head.

<img style="float: right; max-width: 25%; padding: 0 0 0 20px" alt="Fedora logo" src="/assets/posts/fedora/fedora.svg" />

Onto Fedora
-----------

So I pledged to try something new in 2022, and it took me another 14 months
to find the energy and motivation to actually follow through.

I went for Fedora. Named after a fashion faux pas, it seems to be on the #2
spot for desktop linux. It's funded by Red Hat, and seems to have a focus on
keeping it's packages very up to date, which I like and why I originally
switched from Debian to Ubuntu!

I'm a week an a bit in, and here are my first impressions.

### Installation

Installation was super smooth. I always forget to make a separate `/home`
mount, so it took a while to move everything to an external disk and back.

The _one_ thing I always forget to move is my MySQL databases, and today
was no exception.

### Non-free stuff

Fedora does not ship with things that aren't open source. Nothing against that
philosphy (awesome in fact), but personally I don't mind adding some binaries
for a better experience.

I miss Ubuntu's [Additional Drivers][6] tool, because it told me what to
install. I'm sure the drivers I need are available for Fedora, but I don't
know what to look for which makes me slightly worried my computer is not
running optimally. Battery feels worse but that could also be my imagination.

Video in Firefox didn't work at all in stock Fedora. I had to install
ffmpeg to get it to barely function, but then I discovered [RPM Fusion][7], where
I got an even better ffmpeg, plus gstreamer and Intel drivers and I can now watch
beautiful smooth 4K video, and confirmed with `intel_gpu_top` that I'm using
hardware acceleration.

<a href="/assets/posts/fedora/gpu-top.png"><img class="fill-width" alt="intel_gpu_top output" src="/assets/posts/fedora/gpu-top.png" /></a>

### Gnome

Ubuntu used to have their own desktop environment called Unity. In
2018 they switched to Gnome, but they modified Gnome to keep their
Unity look.

<a href="/assets/posts/fedora/ubuntu.png"><img class="fill-width" alt="Ubuntu 22.10 look" src="/assets/posts/fedora/ubuntu.png" /></a>

This felt like a good move, because it let them kept their look while
taking advantage of all the Gnome plumbing.

One drawback is that Ubuntu was usually a bit behind with Gnome
features.

Fedora uses stock Gnome. As a result there's more consistency overall,
and it's nice to have the latest features. I miss the strong visual
identity Ubuntu has though. It sets itself apart from Mac and Windows.

<a href="/assets/posts/fedora/fedora.png"><img class="fill-width" alt="Gnome's neutral colors" src="/assets/posts/fedora/fedora.png" /></a>

I'm sure I can customize Fedora to be more fun, but if I'm being real
with myself I probably haven't changed my desktop background in 10 years,
and so this will never happen.

### Flatpak

The only thing that Flatpak had to do to be better than Snap
was to not remind me of its existence unless I'm installing something, and
so far it's done that. [Flathub][8] is nice, and I love the idea of developers
not having to repackage for every distro under the sun.

### Buggyness 

Fedora does generally feel more stable. Fewer background processes
pegged at 100%. 3rd party application support doesn't seem as good on
first sight. I had to find workarounds for [KeeppassXC][10] and
[Element][9] to not crash all the time.

This is of no fault of the Fedora team, but it does tell you something
about how much Fedora is on other's people radars. If developers test
1 linux distro, it will be Ubuntu.

### Software Center app

I falsely assumed that the Software Center application was buggy
due to Ubuntu's Snap changes, but it also hangs all the time in Fedora.

The solution is to kill the `gnome-software` process if you want
to use 'Software' more than once per session. Apparently this has
been an issue for [at least 12 months][11]


Would I recommend Fedora?
-------------------------

Things are never perfect, but even with some of the issues I ran into
I'm very happy I switched. It's hard to describe, but things feel more
solid.

To get here state I did have to put is some work and research, but not
at a level of recompiling kernels.

If you are comfortable googling, using the termimal for some commands
and interpreting an occasional error message I would now recommend Fedora
over Ubuntu.

If you are not a technical user or programmer-adjecent, I think Ubuntu
is still going to be the choice with the least amount of friction. In
large I think this is simply because it is the biggest, has the most
eyes and the most support.

I'm excited though. Fresh start!

[1]: https://www.dell.com/community/Developer-Blogs/Dell-XPS-13-Plus-developer-edition-with-Ubuntu-22-04-LTS-pre/ba-p/8255332
[2]: https://evertpot.com/switching-to-linux/
[3]: https://evertpot.com/firefox-ubuntu-snap/
[4]: https://en.wikipedia.org/wiki/Ubuntu_One
[5]: https://en.wikipedia.org/wiki/Mir_(software)
[6]: https://askubuntu.com/questions/47506/how-do-i-install-additional-drivers
[7]: https://rpmfusion.org/
[8]: https://flathub.org/home
[9]: https://flathub.org/apps/details/im.riot.Riot
[10]: https://keepassxc.org/
[11]: https://www.reddit.com/r/Fedora/comments/tt04l1/hows_software_still_having_issues_like_these/
[12]: https://news.ycombinator.com/item?id=35354729
