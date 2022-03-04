---
title: "Log4j, Faker and Black Swan Events"
date: "2022-03-04 22:20:00 UTC"
tags:
  - open source
  - log4j
  - faker
---

In December log4j, a library that's used by a massive amount of projects had
a [major vulnerability][1], and in January the author of 'Faker' and 'Color'
went [nuclear][2], released a intentionally buggy version that broke a lot of
projects (temporarily).

A lot has been said about both of these, but I wanted to add my own (very late)
take to this.

I think the general theme of what people are writing about this is is: this
is a major problem with open source. Critical projects aren't getting enough
funding.

In the case of Faker.js/Color.js, a lot of people in the Node.js community
suggested to no longer specify 'version ranges' for dependencies but lock
everything to a specific version in `package.json`.

I however found myself disagreeing with both of those conclusions. 

For both of these major issues, I looked at the events
unfolding and I have a hard time reaching the conclusion that there's a big
problem that needs to be solved. It was quite the opposite actually.

It's hard to find exact statistics, but the sources I could find suggests
that there's at least 100.000s of open source developer as many open source
packages.

If we have couple of major issues like Log4j and Faker.js every year, that
feels like a number that's not really worth optimizing for.

Proprietary or well-funded software can also have major security bugs,
and in each of these cases workarounds popped up fast and the issues were
fully resolved within 2 weeks for most users.

Yes, the issues themselves were problematic and I have sympathy for the
developers involved and how they were treated, but the conclusion I got
from these events is that things are actually pretty robust and correct
themselves in the face of major issues.

I don't want to deny that that open source needs more funding. I think it's
a complex issue that I don't know enough about, but If there are indeed
major structural issues related to how open source is developed, we should
look at widespread problems and not ['black swan events'][3].

I've often seen organizations trying to find and fix root causes for any
issue that pops up, but all these process changes can lead to a situation
where it's hard to get anything done. An important part of any post-mortem
should be 'how can we prevent this in the future', but also 'is this issue
common enough to prevent it from happening again'.



[1]: https://www.cisa.gov/uscert/apache-log4j-vulnerability-guidance
[2]: https://www.theverge.com/2022/1/9/22874949/developer-corrupts-open-source-libraries-projects-affected
[3]: https://en.wikipedia.org/wiki/Black_swan_theory
