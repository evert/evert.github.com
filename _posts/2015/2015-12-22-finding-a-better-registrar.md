---
date: 2015-12-22 17:01:59 -0500
layout: post
title: "Finding a DNS registrar"
tags:
    - dns
    - hover
    - namecheap
    - route53
    - amazon
    - aws
    - dnsimple
---

A few years ago I started the process of migrating my domainnames from GoDaddy
to [Hover][1]. But Hover does not support the so-called `ALIAS` records and has
made a lot of [empty promises][2] regarding when that would happen.

So it's time to look for a new registrar. But who to pick? The three
recommendations I got are:

1. [Amazon Route 53][3]
2. [Namecheap][4]
3. [DNSimple][5]

My requirements:

1. They should allow me to register new domains as well as use their DNS for
   existing domains.
2. Support `ALIAS` records.
3. Support email forwarding.
4. Support simple URL redirection for some parked domains on a subdomain-level.
   Sometimes this is called a `URL` record.

It turns out that Route 53 does not do email forwarding, and URL redirection
seems clumsy at best (requires an S3 bucket, nothing fancy).

So my focus is on the last two.

They seem pretty comparable, so it comes down to for me is cost. To calculate
this, I have the following fictional setup and calculate the total for it:

1. 10 Domains total
2. 5 are `.com` domains, 2 are `.io` domains.
3. I have 3 domains that I use an different registrar for, but I want to use
   their application to manage the zone. Having everything in one place is nice.
4. 3 of these domains have 1 email address forwarded.
5. 3 of these domains simply redirect to a different URL.


Namecheap
---------

| Line item                     | Price per year |
| ----------------------------- | --------------:|
| 5 .com                        | $ 53.45        |
| 2 .io                         | $ 65.76        |
| DNS zone hosting              | free           |
| Email forwarding              | free           |
| URL forwarding                | free           |

Total : $ 119.21

DNSimple
--------

| Line item                     | Price per year |
| ----------------------------- | --------------:|
| 5 .com                        | $  70.00       |
| 2 .io                         | $ 100.00       |
| DNS zone hosting              | $  90.00       |
| Email forwarding              | $  72.00       |
| URL forwarding                | free           |

Total : $ 332

Conclusion
----------

Just based on this, namecheap wins by a large margin.

Did I miss anything? Have others to add? Comment here, or better yet:
[edit this page to make additions or corrections][6].


[1]: https://www.hover.com/
[2]: https://help.hover.com/entries/21605079
[3]: https://aws.amazon.com/route53/
[4]: https://www.namecheap.com/
[5]: https://dnsimple.com/
[6]: https://github.com/evert/evert.github.com/blob/master/_posts/2015/2015-12-22-finding-a-better-registrar.md
