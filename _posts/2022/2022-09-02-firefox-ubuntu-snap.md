---
title: "Ubuntu bungled the Firefox Snap package transition"
date: "2022-09-01 09:39:29 UTC"
geo: [45.686510, -79.328419]
location: "East York, ON, Canada"
tags:
  - firefox
  - snap
  - ubuntu
---

I'm not a Snap hater. On paper it's a good idea, but as a user I shouldn't
really be aware that 'snaps' even exist. In Ubuntu 21.10, Firefox became
a snap package.

Arguably the browser is the most important application in an operating
system. Here's a non-exhaustive list of issues I've personally ran into.
I should note that some of these issues are now fixed, but I wanted to
illustrate what Ubuntu launched with:

* [KeePassXC](https://keepassxc.org/), an open source password managers' browser extension no longer works.
* Firefox thinks that when opening 'localhost:8080' should open the URI scheme 'localhost' and tries to
  find an application that supports this scheme (now fixed!)
* [Gnome shell integration](https://extensions.gnome.org/local/) extension, the primary way to install
  gnome add-ons is now broken.
* 'Set image as desktop background' is broken.
* Opening applications via a custom URI scheme no longer asks for confirmation, this makes it possible
  to (for example) launch a bittorrent client like Transmission via a `magnet:` uri without asking a
  user.
* The [Mozilla VPN](https://www.mozilla.org/en-CA/products/vpn/) product has a neat feature that lets
  you have specific containers always use a VPN. This doesn't work.
* Firefox creates a 'firefox.tmp' directory in the Downloads folder (fixed!)
* When there's an update to the Firefox package, the following notification appears, once per day.
  Restarting Firefox does not make this go away. The official answer is to run `snap refresh firefox` to
  make it go away.

<img src="/assets/posts/firefox-snap.png" title="Update Firefox To Avoid Disruptions notification in Ubuntu" />

This is just the stuff I ran into myself, (and I have reported most of these). I imagine the total list of bugs must be way higher.
I don't usually go out and complain on the internet like this, especially when it's about open source projects.
I'm a Linux user, so I've kind of come to expect things to not be quite as polished as some of its commercial
counterparts. They're small trade-offs to support Open Source.

However, I'm so surprised by the lack of quality control for arguably the #1 application on the #1 linux distro I'm
frankly flabbergasted, and for the first time since switching from Debian to Ubuntu 15ish years ago I'm considering
[jumping ship](https://getfedora.org/) again. What happened here?

Comments? Reply to [this tweet](https://twitter.com/evertp/status/1565819403245129728)

