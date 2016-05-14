---
date: 2016-05-13 19:36:26 -0400
layout: post
title: "Why PHP-FIG matters"
tags:
   - php-fig 
   - php 
   - standards 
---

The [PHP-FIG][1] is currently going through some growing pains. I recently
resigned as a voting rep, and after some juvenile controversy Lavarel, Doctrine
and Propel have as well.

Since its inception 8 years ago, the groups greatest problem has been to
properly organize itself. From having followed the mailing lists for that time,
I believe that the amount of emails entailing "the process, bylaws, voting and
general bureaucracy" outnumber the actually productive technical discussions by
maybe something like 4 to 1. This is a lot of wasted time, for a lot of people,
and the while (some) good documents have come from it, it is an incredibly
inefficient process.

Now as a sort of knee-jerk reaction to these issues, [PHP-CDS][2] was setup
with a much simpler process. Anyone can submit a PSR document there, first
come first serve, disrespectfully in the `psr` composer vendor name.
While it's a nice protest, this will of course go no where. But the initiative
makes a few good points:
Ultimately the key to the success of PHP-FIG will be a more open group,
a much lower barrier to entry and the ability to more rapidly release PSR's;
allowing them to fail quicker so better versions can rise from their ashes.

If you want a great example of why this is needed, look no further than
than [PSR-6 a.k.a. the "Caching" interface][3]. This is an effort I originally
started somewhere in 2011, took 5 years to complete (I gave up after 2).
Originally a simple key-value store that mimicked interfaces from memcache and
apc 1:1, it has become a textbook example of "design by committee" and aims to
 solve a wide range of problems such as being able to store and retrieve NULL
from a cache (yes, this was a major design consideration, and a big influencer
for the resulting API. See the [meta document][4]).

Now I don't think we need to try to aim to create an organization that
prevents people from making bad decisions. Instead the organization
we need is one that allows someone to make that mistake in the timespan of
about 5 months instead of 5 years, so room can be created for a new PSR that
solves the 80% problem in a less ridiculous way.

Some good stuff is happening though. A few people are working on a thankless
effort to restructure the organization dubbed "FIG 3.0". (thanks Larry
Garfield and Michael Cullum). Contrary what you might read in the first half
of my post, I don't actually believe that total anarchy is the solution.
Process is needed, but it needs to be good process, and you need humble people
to shepard it.  As long as the role comes with a certain amount of prestige,
it will attract the wrong people. This has happened with the group
of voting representatives. Some voters have joined and then put in zero effort,
while others have devised elaborate schemes to get admitted as one.

I think PHP-FIG needs to immediately create a separate mailing list,
specifically for organizational / process matters. Let its moderators
rule with an iron hand and delete posts and suspend mailing list users
that go off topic on either the organization or general mailing list.

Perhaps even go to a model where every post gets moderated in the short-term.


Why it matters
--------------

But why does this all matter in the first place? Take caching for example. A
lot of different frameworks provide some facility to do this.

But there's also a lot of framework-independent libraries that can take
advantage of this.

Libraries today generally have a few options to solve this:

1. Build in a caching library in the library.
2. Depend on a specific external caching library.
3. Only work with one framework. (by expecting for example a Symfony cache).
4. Provide adapters for different frameworks.

All of these solutions have drawbacks, and all of these solutions are
happening in the wild. A (sane) PSR-Cache can solve this.

We are creating a TON of redundant code, each framework
and ecosystem gets its own implementation of everything, and the few packages
that are used across frameworks get framework-specific bundle packages.

I think it requires a bit of change in thinking to make successful interfaces
though. The problem that haunts PSR-Cache, but also the earlier Logging
interface and PSR-7 (HTTP), is that they all aim to be the framework directly
exposed to the user, instead just the plumbing.

This is the most obvious from the logging interface. The logging interface
really only facilitates one operation, logging something:

```php
public function log($level, $message, array $context = array());
```

This would actually have been enough, but we got 8 additional methods that
make it easier to to call this (already fairly simple) method:

```php

public function emergency($message, array $context = array());
public function alert($message, array $context = array());
public function critical($message, array $context = array());
public function error($message, array $context = array());
public function warning($message, array $context = array());
public function notice($message, array $context = array());
public function info($message, array $context = array());
public function debug($message, array $context = array());

```

While I think it's fine for something like [monolog][5] to provide this
interface to its end-users, this goal should not have been conflated with
the PSR.

Removing those functions would have cost us very little. It's up to library
developers to make the plumbing look nice.

Instead, the Monolog API pretty much _is_ PSR-3, like the Stash user-facing
API _is_ PSR-6 and Zend Diactoros _is_ PSR-7.

By conflating the goal of simple library to library interop to becoming _the_
end-user API, each of these standards have become very opiniated which is
good for the people running those projects, or people who hold that opinion,
but it leaves little space for other opinions. There's also a risk that
these PSRs will go out of fashion when their respective 'host projects'
are.

The folks that sign up to taking an "event sourcing" / functional approach
to PHP have largely dictated the design of PSR-7. This is why we're left with
a set of objects that are pretty odd to pretty much anyone who first sees them.

The larger problem is that
PSR-7 was never designed to cater the use-case where an existing PHP framework
interacts with a framework-agnostic plugin. In the world of PSR-7, we all
first need to convert to the church of event sourcing. There is one de facto
implementation, and while there is traction, the traction largely exists
within libraries that subscribe to the idea of this particular approach to
Middleware and they seem mostly new utilities, not existing feature bundles
that are becoming framework agnostic. We pretty much need new major versions
of the major frameworks first, and then PSR-7 to become a first-class citizen.
Had PSR-7 been a simple mutable interface,
every framework could have created a simple proxy pattern between PSR-7
and the underlying request/response objects they already had.

However I actually believe that PHP-FIG _should_ facilitate the eventsourcing
school of thought and should help them interop, but by
optimizing the process and making it much easier to publish PSR documents
(even if they are competing with earlier ones) it will be in
a much better position to achieve the goal to let libraries and frameworks
interop better.

This is because a successful PSR is one that allows at least 3 projects to
better interop. If we make it a requirement to reach total concensus the
pressure is way too high
for everyone involved to make that PSR perfect. Since "perfect" is different
for everyone, the most persistent debater wins, and ultimately for PSR 3, 6
and 7 that has been the author of the document. That's why PSR-3, PSR-6 and
PSR-7 might as well be called Monolog, Stash and Diactoros.

If you only get a chance once every 5 years to build the right interface,
you're gonna care about getting it right. Nobody is to blame for that, but
if we were a bit more flexible, we may have had a simple key-value store
4 years ago. 3 years ago we may have gotten a multikey extension, and
last year the author of Stash may have published a third PSR
that might have worked better for Stash's end users, one which may not
have suffered as much from having too many cooks in the kitchen. 



Conclusion
----------

Well, this turned into quite a rant. My ultimate goal with this post is to
try and better vocalize the vague criticism I've seen about the PHP-FIG. I
notice a lot of people 'feel' this way but have not been inside the sausage
factory for long enough to figure out why all the recent PSR's leave such
an odd after-taste.

Not sure if I've succeeded with that or if I'm just stirring the pot.
Regardless, I believe PHP needs PHP-FIG, and I would be
excited to get involved again in a strict technical capacity once Larry
and others are done with the open heart surgery.


[1]: http://www.php-fig.org/
[2]: https://github.com/php-cds/php-cds
[3]: http://www.php-fig.org/psr/psr-6/
[4]: http://www.php-fig.org/psr/psr-6/meta/#4-3-alternative-quot-naked-value-quot-approach
[5]: https://github.com/Seldaek/monolog
[6]: http://www.stashphp.com/ 
[7]: https://github.com/zendframework/zend-diactoros
