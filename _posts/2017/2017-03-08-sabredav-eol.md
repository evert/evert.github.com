---
date: 2017-03-08 21:04:46 -0500
layout: post
title: "I'm stopping my work on sabre/dav"
tags:
   - sabredav
   - sabre
   - opensource
---

Almost 10 years ago in 2007, I started a project called [sabre/dav][1]. I
originally was looking to scratch an itch and solve a real problem we had in
our company.

A lot of people ended up being pretty excited about it. In 2010 I got to a
point where doing consulting around this project allowed me to travel around
the world, working for various companies and get paid enough to not have to
do any other jobs. Life was pretty good! One of these gigs actually brought
me all the way to a beach in Australia! (Thanks Ben!)

In 2012 plenty of businesses relied on this project for either a side-feature,
or at the heart of their product, including various ISP's, product companies
and open source vendors like [Owncloud][7].

At this point I started working with Dominik Tobschall and we opened the doors
to a business named [fruux][2] in Munster, Germany. We got a bunch of funding
and we would try to build a consumer and small-business product. Fruux also
used sabre/dav at it's core for synchronization and became the copyright owner
of the project.

I also started working with [CalConnect][3] to help drive forward the actual
calendaring and scheduling standards that sabre/dav and many other vendors
implement. It was really awesome to work directly with the people behind Apple's
iCal and iCloud, Mozilla's Lightning (hey Philipp!), Google Calendar and many
other industry leaders. Instead of just being disgruntled about a bug (or
feature) I could just ask the developers directly and work things out together!

We were unable to grow this company quickly enough, so in 2014 we made a pivot
and try to focus on professional services around sabre/dav. We got burned with
the incredibly long sales cycles, so later in 2015 we had to wind this business
down and find alternative income streams while still passionately working on
this project.

<img src="/resources/images/posts/fruux-team.jpg" title="Fruux team in 2012" style="max-width: 100%" />

_Pictured above: the original fruux team_


Unfortunately over time the alternative income streams slowly became the main
ones leading me to September 2016, in which I started a new full-time job at
a company in Toronto called [Turnstyle][4]. It's a great change of pace after
having worked remotely and contracting for half a decade.

This leads me to today. I recently read a blog post titled ["What it feels
like to be an open-source maintainer" by Nolan Lawson][5], which kind of hits
home. This made me realize that after nearly 10 years, my work on this project
has turned from something I was very excited about into something a bit more
like a chore.

I'm not really using my own project(s) anymore. I don't get paid, but I'm
really the only maintainer. Lots of businesses depend on it, there are lots of
open bug reports, feature requests and pull requests but I can't find the
time and motivation to work on it. According to [packagist][6], it's been
downloaded 27000 times in the last 30 days. I think I would still love it if
it were my full-time job and I had coworkers also working on it, but it all
comes down to me.

This has caused two big effects:

1. I feel constantly guilty that I don't work on these things. There's people
   waiting on me and making reasonable requests, but I just can't seem to get
   it done.
2. This guilt is preventing me from starting new things that excite me,
   because I feel bad starting the next thing if I haven't finished the last.

It was a gut-feeling that took a while to sink in from around January. I
finally realized that I need to make a change. This is pretty personal and
emotional and it sucks to have to make this decision.

So, starting today:

* I resigned 100% from fruux
* I resigned from CalConnect
* I'm shutting down the sabre/dav mailing list (go to github instead)
* I'm looking for new maintainers

The affected projects are:

* [sabre/dav](https://github.com/fruux/sabre-dav/)
* [sabre/vobject](https://github.com/fruux/sabre-vobject/)
* [sabre/http](https://github.com/fruux/sabre-http/)
* [Baikal](https://github.com/fruux/baikal/)
* [davclient.js](https://github.com/evert/davclient.js).

I'll continue to maintain the following three projects because they are simple
and small:

* [sabre/xml](https://github.com/fruux/sabre-xml)
* [sabre/event](https://github.com/fruux/sabre-event)
* [sabre/uri](https://github.com/fruux/sabre-uri)

For the first 5 I'm looking for suitable new maintainers. I do care about the
future quality of these projects, so I won't just hand it over to anyone.
If you're interested, let me know what you're planning to do with it. I'll
probably hang out and guard quality control for a while before I fully step
down, but I am more than happy to provide mentorship during this transition.
It's easier to answer questions than to do the actual development ;).

If I don't find new maintainers within a month or so, I will advertise these
projects as being 'unmaintained' and unsubscribe from any notifications.

I am super grateful for the doors this project has opened for me, and the
adventures I've had. It wasn't possible without all the people who stopped by,
cared and decided to make the project slightly better. It's been really
amazing! It's super scary to think that 10 years have passed and all the things
that have changed :O


[1]: http://sabre.io/
[2]: https://fruux.com/
[3]: http://calconnect.org/
[4]: http://getturnstyle.com/
[5]: https://nolanlawson.com/2017/03/05/what-it-feels-like-to-be-an-open-source-maintainer/
[6]: https://packagist.org/packages/sabre/dav/stats
[7]: https://owncloud.org/
