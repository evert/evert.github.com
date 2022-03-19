---
title: "Reasons why abolishing DST in the US will be worse for users and developers"
date: "2022-03-18 08:51:00 UTC"
geo: [43.686510, -79.328419]
location: "East York, ON, Canada"
tags:
  - dst
  - timezone
---

Daylight savings time is hated by many, and twice per year a discussion
reignites to get rid of it. Lot of folks feel this is a great idea. This year
[this decision][1] seems especially close in the US. If this law passes, it
will probably also change where I live 🇨🇦.

No doubt there's lots of benefits and advantages to this, I don't want to
dispute that. This is also not an endorsement against that change, but I do
however want to bring light to at least one disadvantage:

The timezone change was for a lot of developers a twice-per-year reminder
that we need to use timezone databases and libraries.

This is useful, because every year many countries change their timezone
rules. This means that if you schedule something in the future, say.. 2pm 6
months from, you don't know yet with absolute certainty what UTC timestamp
this will be. This is especially important when scheduling between people
in multiple timezones.

The right way to handle this is to store the intended local time + a location
such as `America/Toronto`. `EST` is not enough, because it's `EDT` half the
year, and obviously neither is `-0500`. I grew up in the netherlands, and it
was only when I got into programming I realized that our timezone is not
`+0100` all year round, unlike what we learned in school.

Timezones are relatively stable in North America, but the US also made a
change [in 2007][2], and it sounds like we may have another one in the future!

So this bi-annual time change was a great reminder to many developers that
timezones are a thing, and you can't just naively assume a UTC time + an
offset is enough. Even more so for teams that are spread cross-continent
because the DST change doesn't fall on the same day. Currently I'm in the
3 weeks per year the time difference between me and my parents is 5 
instead of 6 hours.

A lot of programming is (seems?) anglo-centric. A similar situation is that
before Emoji became wide-spread it was way more common to see a lot more
issues around encoding non-ascii characters 🤷 ([billpg][3]). Especially in
languages that don't have good native unicode support (looking at you PHP).

So if DST goes away in North America, I predict we'll see more people assuming
using the offset is enough, resulting in bugs related to:

* Times in countries that have not yet abolished DST.
* Countries that ever change timezone rules. (This happens more often than
  you think!)
* Applications that deal with historical data.

It doesn't help that one of the most common date formats (ISO 8601) uses an
offset! (`2022-03-18T17:05:30.996-0400`). This is OKish for things that have
already happened, but not good for anything in the future.

So when you hear developers excited about the US abolishing DST because it
will make their (work) life simpler, remind them this is only true if you
never intend your software to be used outside of North America, or when the
entire rest of the world makes the same change and also freezes all
timezone rules forever!

[1]: https://www.reuters.com/world/us/us-senate-approves-bill-that-would-make-daylight-savings-time-permanent-2023-2022-03-15/?utm_source=reddit.com
[2]: https://www.cnn.com/2007/EDUCATION/03/07/extra.daylight.saving/index.html
[3]: https://news.ycombinator.com/item?id=30696850
