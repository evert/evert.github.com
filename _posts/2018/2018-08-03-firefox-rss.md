---
title: Firefox removes RSS support
date: 2018-08-03 15:45:00 -0400
location: Toronto, CA
tags:
  - firefox
  - standards
  - rss
  - atom
---

gHacks recently [reported][1] that Mozilla plans to remove support for
RSS & Atom related features. Specifically Live Bookmarks and their feed
reader.

The reasons cited are the lack of usage. This doesn't completely surprise me.
Both of the features don't fit _that_ well with modern workflows. There's not
a lot of people using bookmarks actively except through auto-complete, and
the reader interface never really was as effective as just looking at a
website. Honestly the day that Mozilla didn't show the feed-discovery button
by default in the address bar is the day they killed it.

**Firefox feed reader:**
<img src="/resources/images/posts/firefox-rss/2018.png" alt="Firefox feed reader" style="max-width: 100%" />

The 2000's vs Today
-------------------

I can't help being sad about this though. For a little while feeds were a very
prominent and exciting feature of the web. More than an effective tool to
replace mailing lists, they represented an idea that anyone can start a website
and become part of the "blogosphere". The dreams were pretty big in the 2000's.
Aside from standard protocols for getting updates from websites, many platforms
supported standard API's for authoring blogs, and API's for federated
commenting and even API's for federated identity (OpenID).

At its height, even Microsoft Word got integration with these standard blogging
(Metaweblog) APIs for easy authoring.

Today it feels like a lot of that dream has died, and we've moved back to
censored corporate-controlled content-silos such as Facebook and Twitter. Each
with their proprietary API's, incompatable with anything besides themselves
and no interest to open up their networks to federation with other providers.
These large vendors are worried about losing control of where content lives and
where your firends are, because once they lose the network effect the only
thing that's left is a steaming pile of garbage where nobody really wants to
hang out anyway.

So I'm sad to see this feature being removed from Firefox. It wasn't a really
a fleshed out or well maintained feature. It's recoverable with add-ons, but
what I really care about, is what the feature represents.

[Mozilla's mission][2] is:

> Our mission is to ensure the Internet is a global public resource, open and
> accessible to all. An Internet that truly puts people first, where
> individuals can shape their own experience and are empowered, safe and
> independent.

I think it's important to say that I don't necessarily advocate for preserving
this feature. I want Mozilla to be a catalyst for taking control from
corporate silos back to the individual. RSS & Atom might not be the key to
this goal, but without a good replacement this doesn't feel good. To me it
goes against the mission that Mozilla set out to accomplish.

[1]: https://www.ghacks.net/2018/07/25/mozilla-plans-to-remove-rss-feed-reader-and-live-bookmarks-support-from-firefox/
[2]: https://www.mozilla.org/en-CA/mission/
