---
date: 2015-12-09 16:18:23 -0500
layout: post
title: "Switching to Linux"
tags:
    - linux
    - apple
    - dell
    - xps13
    - ubuntu
    - kubuntu
    - kde
---

Back in 2006 I switched from Linux and Windows to Mac as my primary operating
system. I paid for my white macbook with my first real paycheck. This was right
after they switched to the Intel platform and it really was an amazing time to
step in. At the time
it was the perfect combination of a great UX, combined with the power a
unix-ish system.

Since then I've gradually got more locked into the Apple ecoystem. With a
bit of a grudge too, as what was once the technically superior, and arguably
the cooler option
has slowly become a bit of an icon of vendor lock-in and various other
practices that I, as a developer am not super comfortable with.

But the thing that has stopped me from switching back always has
been convenience. Mac, unlike Linux has a reputation for having a great out-
of-the-box experience and hardware support. And of course the fact that the
switch itself would cause quite of a time-sink, because there's a lot of new
things to learn, new software to find and new habits to form.

But right now I'm typing this off a Kubuntu installation on a Dell computer.
So what changed?


Apple is losing the argument
----------------------------

In 10 years a lot has changed, but the main thing Apple and OS X had going for
it was it's "it just works" reputation. I feel this has stopped being true.

For the longest time, the top three application I use constantly on any daily
basis have been the following three:

* Firefox
* Thunderbird
* Terminal (tmux + vim)

My habits have not changed that much, what have changed is that apparently
over the years it's become harder and harder for my Mac to perform these
tasks. For a developer that does almost everything in a terminal and do
virtually no compiling, the most basic computer should arguably be able to
handle these applications quite well.

But for some reason the iMac from last year with 8GB of memory is simply
doing a worse job at it than the basic Macbook I had in 2006 running OS X
Tiger. Starting applications is terribly slow, starting a new terminal session
takes forever, after start-up it takes up to 15 minutes for the machine to
feel somewhat smooth. The effect on my much newer iMac is much stronger
than my comparatively underpowered Macbook air. The prime difference is that
the latter has an SSD. On the Big Mac 'force quit' and reboots are both
frequent enough to be anger inducing. And yes I did do a a full reinstall!

It really seems that the last well-performing OS Apple has created is Snow
Leopard, and I now also see that as the time they absolutely peaked. To say
that this is planned obsolescence is giving them too much credit, as it feels
more like it stems from a lack of planning. Performance optimization of new
software seems to end when it works smoothly on 'current' hardware, which
means that it doesn't take long for hardware to get branded 'old'. Even though
every OS X release comes with the promise of better performance, my own
experience tells me the inverse is true. How awesome would it be if OS X
developers were forced to run base-line 5-year old hardware? I imagine that
this problem would not exist.

Everything these days feels worse, and it's extremely frustrating that I got
this big honking machine fairly recently, and it already feels old and not fun
to use. This was a big expense! I justified it because programming is my
livelyhood.

So there was my reason to try Linux. I had a sneaking suspicion that running
Linux on the same hardware would easily outperform OS X. Granted, I do believe
that Linux tends to be a bit more 'maintenance' heavy, but if it runs fast,
I consider it a win.

But where to start? I didn't want to lose my main development machine, so
instead I used my 4-year old Air.

Choosing a Linux distribution
-----------------------------

The first choice for Linux distributions these days is always [Ubuntu][1].
Lately Ubuntu has been a bit naughty though by adding Amazon to the standard
list of icons, and sending them all your search queries.

It seemed like a good idea to pick something else, but I had no idea where to
start looking. The cool kids always seem to go for [Arch Linux][2] these days,
and I also considered installing [Debian][3]. All seem to have their pros and
cons, and it was hard to make a good choice. I even resorted to googling "how
to pick a Linux distro" only to be none the wiser.

In the end I decided to just play it safe. I've been using Debian-based
distributions for a long time, so since I'm already making all these changes,
lets go for a system I know.

Debian itself somehow seemed a bit ugly from the screenshots, and I am a bit
shallow in that regard. That leaves Ubuntu and [Linux Mint][4]. I remembered
then that Mint had issues in the past upgrading from one major version to
another without reinstalling, so I ended back at Ubuntu. The safest choice.
Perhaps at some point in the future I'll be a bit more adventurous again.


Installing Ubuntu
-----------------

Installing Ubuntu was extremely easy. I was worried I had to make changes to
EFI, but in the end it was a matter of:

1. Downloading the Ubuntu image.
2. Creating a USB installer.
3. Rebooting.

To do this, all you need is a USB stick of over 2 gigs, and follow [these
instructions][5] to load the image and make it bootable.

I was extremely excited to see that when the GUI installer popped up,
everything just worked! I definitely expected some issues with drivers, but
I had 0 problems. All the hardware was immediately recognized.


Ubuntu Impressions
------------------

I was surprised to see that things like the brightness, volume and keyboard
backlight buttons all just worked.

Ubuntu also looks nicer than it did back the day. There's a lot less brown
going on:

<img src="/resources/images/posts/switchingtolinux/blankslate.png" title="Ubuntu 15.04"  class="fill-width"/>

Software works reasonably well. Especially all the Gnome stuff. But there were
also a few negatives.

### The basics

LibreOffice works great and has come a long way. The design also looks a lot
nicer than I remember. The Terminal 'just works' and obviously both Firefox
and Thunderbird work exactly as I expect them to.


### Web Applications

I remember I used to use Gwibber as a Twitter client. This, and a few other
other things have now moved to a new "Web Apps" feature. Basically this is
somewhat similar as [Firefox Web Application][15] specification. It takes
existing web application (such as twitter.com), lifts them out of the browser
chrome and better integrates them in the OS with a custom icon, notification
support etc.

I honestly think this is a pretty good idea. Instead of trying to build an
Ubuntu/Linux/Gnome application for every equivalent on OS X or Windows, why
not make tightly integrate excellent Web applications with offline support,
etc.

The execution for this was so absolutely poor though, that I can almost not
believe how it made it in a stable release. Copy-pasting did not work and
there were a slew of other problems. I quickly removed all trace of Ubuntu's
Web Applications, and conceded that I should start using Firefox's Pinned Tabs
for this type of stuff. Big step back.


### Dropbox

Dropbox has always had great Linux support. Just find it in the
"Software Center" and you're off.


### 1Password

This is where things get dicey. There's currently no Linux version for the
popular password management application [1Password][7].

The options appear to be:

1. Use 1Password for windows inside [Wine][8].
2. Use the read-only '1password anywhere' application inside the Dropbox
   website.

<img src="/resources/images/posts/switchingtolinux/1password.png" title="1Password for Windows for Linux"  class="fill-width"/>

The second option actually works decently well. At least it works as a stopgap
measure until I find a properly supported alternative.

I was surprised to learn how easy and fast Wine was. Very different from back
in the day.


### Chat

I use Facebook chat, Gtalk, irc and Slack for chat. The default chat client
for Ubuntu is Empathy, and is supposed to support all of these out of the box.

Unfortunately setting up irc (after installing `account-plugin-irc`) also
fails, and I'm left with a broken interface.

So I remove empathy. I also tried [pidgin][12] as an alternative, but after
having tried that for a bit, I've now pretty much landed on using web
applications and pinned tabs for all of these.


### No great calendar app

Another major problem is that there's just not a great calendar application
for Ubuntu. I sync all my calendars via CalDAV, and the main two applications
that support CalDAV are Evolution and Thunderbird (via the Lightning add-on).

The major problem that both these applications have, is that neither support
fetching a list of calendars from the server. They both only do per-calendar
set-up and have no true understanding of a 'whole caldav account'. There's
also no calendar application that does calendar sharing or delegation, and
it doesn't seem like there's something on the horizon either.

On OS X we have iCal and [BusyCal][13], which both are best of breed
applications, supporting open protocols. On windows the ultimate client for me
is [eM Client][14]. It seems that the Linux ecosystem has failed to deliver a
great calendaring or 'outlook' alternative, and defers to the web for this.


And then I went on a trip
-------------------------

And I realized that my 4 year old Macbook Air was really quite old. The
battery was pretty bad, and I also realized I had some hardware issues that
I hadn't seen before.

Wifi worked quite poorly, and I also started to realize just how bad the
battery had become. I also had issues with doing a presentation at a
conference, and had to look for a VGA adapter, since the second screen didn't
show up via DVI.

And when I went on a business meeting and was forced to move everyone to a
different table because my battery was dead again, it was the final drop. I
had to get a new machine because I'm starting to look a bit unprofessional.

However, the lesson I learned so far was that despite the issues I had ran
into so far, none of them were deal-breakers. Linux on dying laptop was a less
frustrating experience than OS X on a 1-year old overpowered iMac.

So I went out to look for a new laptop with great Linux support.


XPS 13
------

I'd write down the pros and cons for the various models I've looked at, but
frankly the only ultra-portable laptop with great Linux support I ran into
appeared to be the Dell XPS 13.

Dell sells a ['Developer edition'][16] that even comes with Ubuntu pre-installed.
That's not just a positive sign that it works, it tells me it's 'official
support', which generally is a hard to find for Linux systems. Dell shamelessly
describes the XPS 13 as a Macbook Air replacement, and that happened to be
exactly what I was looking for.

It's also aesthetically very pleasing. I'm a bit shallow perhaps, but I'd like
my laptop to look cool. The Thinkpad just doesn't cut it for me.

### Some pictures

<img src="/resources/images/posts/switchingtolinux/compare_open.jpg" alt="XPS 13 vs Macbook air - Opened"  class="fill-width"/>

The screen is very vibrant, and the bevel is tiny. Both of these screens are 13
inch, but the Mac has a much larger profile.

<img src="/resources/images/posts/switchingtolinux/compare_thickness.jpg" alt="XPS 13 vs. Macbook air - Thickness"  class="fill-width"/>

As you can see the laptop is about equally thick, except the Air becomes much
thinner on the bottom.

<img src="/resources/images/posts/switchingtolinux/compare_top.jpg" alt="XPS 13 vs. Macbook air - Top"  class="fill-width"/>

<img src="/resources/images/posts/switchingtolinux/compare_width.jpg" alt="XPS 13 vs. Macbook air - Width"  class="fill-width"/>


### The model

By the time I ordered my XPS 13, a new model (9350) just came out. This new
model features a newer (6th generation) processor, and also USB Type-C support.

I opted to get the older model though (9343). This model has a Broadwell instead
of the new Skylake chip, but the clearest difference is the lack of USB Type-C.

The reason for this was two-fold: The Developer Edition wasn't out yet, so I had
to order one with Windows, and second was that it seemed like a good idea to get
a Laptop that's not brand new, and instead get something a lot of Linux users
have experience with for several years.

From my research I found when that laptop originally came out, people had a fair
bit of issues with it. Dell also maintained a custom Linux kernel for a while to
improve support. Today it seems that most of those issues are resolved, and all
of Dell's patches are integrated into the Linux kernel.

Having USB Type-C would have been cool, but the difference between an Intel
5th gen and 6th gen chip is frankly completely unclear to me. Realistically I
doubt I would be able to notice the difference.

The model I got has a 256GB SSD harddrive and 8GB of memory. Had I been buying
a new mac I would have probably wanted to have 16GB, but for Linux 8GB seems
plenty.

<img src="/resources/images/posts/switchingtolinux/powered_by_ubuntu.jpb" alt="Powered by Ubuntu"  class="fill-width"/>

The "Ubuntu" sticker is a nice touch, but I wish the keyboard didn't come with
a Windows key ;). In this picture you can also see the 'braided' looking
carbon fiber. It's more subtle in real life compared to the picture, but this
stuff is actually super soft on my palms, compared to the hard surface of
the macbook air.

Also got the HiDPI (3200x1800) display (aka Retina). It's also a touchscreen,
which is a nice touch... but in the month and a half I used it I never found
a reason to prefer touch over clicking.

### The cons

The battery lives for about 5 hours. This is a far cry from the advertised 11,
but I'm certain this is 100% because it's Linux. A lot of people seem to say
that Linux simply 'does more all the time' which is hard to optimize away.

I can deal with 5 hours battery. If you need more, you can opt to choose the
non-HiDPI - non-touch screen instead. It's 1920x1080 pixels instead which is
still a big step up from the Air's 1440x900.

Another drawback is that I thought that scrolling was not nearly as smooth
as the Mac. Especially scrolling long-distances is frustrating.

And lastly, the number one design flaw with this machine is the placement of
the camera. Instead of being at the top as most laptops have, it's actually
placed on the bottom left of the screen.

This makes skyping extremely unflattering, an effect that's increased even
more if you like skyping from the couch. This is such a deal-breaker for skype
that I'll probably just start using my phone for this instead.


Switching to KDE
----------------

In the meantime I had seen some screenshots from KDE Plasma, and to my
surprise it was quite gorgeous. I always remembered KDE as being the
slightly more ugly, but more flexibility-offering option between
KDE and Gnome, but a lot has changed.

<img src="/resources/images/posts/switchingtolinux/plasma.png" alt="KDE Plasma" class="fill-width" />

So instead of installing Ubuntu as soon as I got the laptop in the mail, I opted
for Kubuntu instead.

As it turns out, my timing was perfect because this was days after the 15.10
release, which was the first Kubuntu with great support for HiDPI displays.

I had some problems with WiFI drivers during installation, but as soon as I knew
which drivers to use everything has been running smooth ever since.

I'd pick KDE over Unity every day now. It really feels like Ubuntu has dropped
the ball a bit with Unity. KDE is a much more polished, bug-free experience and
looks more like a professional tool rather than a toy. KDE is awesome now and
quote a looker!

Several weeks later with KDE and the XPS 13
-------------------------------------------

So after having tried KDE for several weeks now, I'm still pretty happy, but also
have come across a few problems.

It's unclear to me who is responsible for these issues. Some of these might be
KUbuntu, Dell, KDE or Linux, but really that's not that relevant.

1. Screen tearing happens, and it's annoying. I found that the `SHIFT`-`ALT`-`F12`
   shortcut disables visual effects completely and solves all of these issues.
2. HiDPI, while it works well for KDE applications, Java and Wine and Chromium are
   all super tiny and almost unusable. I'm mostly a Firefox user anyway, ~~but if
   you want Chrome on Linux, don't get the HiDPI or switch to a lower resolution, or
   wait till Chrome properly supports it~~. **Edit: it's possible to force Chromium
   to work correctly with a HiDPI screen. See the [arch wiki][18] for more info.**
3. 1Password via Wine works but it's not great. The HiDPI just made the experience
   a lot worse. I'm in the market for a new password manager with great browser
   integration and works with self-hosting.
4. I'm running into CalDAV sync issues with Kontact. It's simply not reliable yet,
   but this might be something I can actually try to fix myself. We'll see!
5. The KDE 'Updates' widget always tells me I need to update, even if I don't!
6. I found a reason to use the touch screen. Reading in bed! Unfortunately it's
   unusable, as a swipe in a browser does not scroll the screen, it acts as a
   "mouse click and hold" which is interpreted by the browser and OS as making
   a text-selection.

I've also since discovered [Back in Time][17] which is a great TimeMachine-like
backup application system.  I'm only syncing my 'home' and it works well.
rsync+ssh seems much, much faster than apple's sparse HFS+ images over AFP.
"Back in time" has both a QT (KDE) and GTK (Gnome/Unity) frontend.

I'm now kind of excited to the point where I can financially justify replacing
my desktop machine, as I will be able to do a custom build which is something I
haven't done in years.

I'm also pumped to sell the Apple TV and get a Raspberry Pi with Kodi.


Conclusion
----------

If you are the type of developer that doesn't shy away from a bit of
tinkering, and you are as fed-up as I was with Apple, I can so far recommend
the switch I made.

I would definitely say that it's not particularly easy though. Tinkering is
required! You're not up and running within a day.

One thing that I also noticed, and I feel is is true for switching to any
new operating system, is that if you switch from system A to system B, the first
things you will run into are all the things that system A did great, but
system B does not.

It takes a lot longer to start seeing all the things that system B has over
system A, because it takes time to discover those benefits and create
new habits.

This is perhaps true for Linux even more than other operating systems. And
even though I feel like I'm not quite there yet, I feel that in the end I will
end up running operating systems and hardware that are incredibly customizable,
don't lock you into a proprietary tightly controlled eco-system and you'll
feel you support the advancement of freedom of knowledge instead of helping
restricting it.


[1]: http://www.ubuntu.com/
[2]: https://www.archlinux.org/
[3]: https://www.debian.org/
[4]: http://www.linuxmint.com/
[5]: http://www.ubuntu.com/download/desktop/create-a-usb-stick-on-mac-osx
[6]: https://www.libreoffice.org/
[7]: https://agilebits.com/onepassword
[8]: https://www.winehq.org/
[9]: https://slack.com/
[10]: http://davidwalsh.name/install-firefoxos-app
[11]: https://wiki.gnome.org/Apps/Evolution
[12]: https://pidgin.im/
[13]: http://www.busymac.com/
[14]: http://www.emclient.com/
[15]: https://developer.mozilla.org/en-US/Apps/Quickstart/Build/Intro_to_open_web_apps
[16]: http://www.dell.com/ca/p/xps-13-9343-laptop-ubuntu/pd
[17]: http://backintime.le-web.org/ "Back in time"
[18]: https://wiki.archlinux.org/index.php/HiDPI#Chromium_.2F_Google_Chrome "HiDPI google chrome"
