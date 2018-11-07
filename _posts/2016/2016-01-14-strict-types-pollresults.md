---
date: 2016-01-14 18:06:17 -0500
layout: post
title: "Strict typing in PHP 7 - poll results"
tags:
   - php
   - poll
   - strict_typing
geo:  [43.642392, -79.414486]
location: "Shank St, Toronto, ON, CA"
---

I maintain a number of PHP packages, and with the release of PHP 7, I've been
starting to wonder when a good time is to switch.

It's a hard decision, and I haven't quite made one yet, but really the PHP 7
killer feature are it's new [argument type declarations][1] and [return type declarations][2].

Yes, there's the speed thing too, and that's a great reason to want to
update to PHP 7, but it doesn't force you to change the minimum required
version.

The improved typing system will make all my sources a lot more robust, and
and I expect to find a lot of hidden bugs by just implementing them.

But PHP wouldn't be PHP if there wasn't something odd about this feature.
Type hinting comes in two flavors: strict and non-strict. This is the result
of a long battle between two camps, a strict and non-strict camp, which
in the end was resolved by this compromise.

Now by default PHP acts in non-strict mode, and if you'd like to opt-in to
strict-mode, you'll need to start every PHP file with this statement:

```php
<?php declare(strict_types=1);

// Rest of your code here

?>
```

> Note: The `declare` statement here doesn't have to be on the same line as `<?php`,
> but I have a strong suspicion that this will be the leading declaration style.

So I was curious about everyone and whether you will be using strict mode or not.
Results are in:

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">Will you be putting declare(strict_types=1); on top of your PHP 7 code by default?</p>&mdash; Evert Pot (@evertp) <a href="https://twitter.com/evertp/status/687408773946863616">January 13, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This definitely suggests that most people will want strict mode (and that
perhaps it should have been the default). It also tells me that a lot of people
are unfamiliar with the feature. If that's you, I can recommend eeading the
[manual][3], but if anyone has a good blog resource that explains things in more
detail, let me know!

The nice thing about how the different modes are implemented though, is that
you don't have to worry if one library uses strict mode and another is not.

Setting your source to strict mode influences only the _caller_. So ultimately
using `strict_mode` only really has an effect on whoever wants to use it, and
their own sources.

Some people are still clearly unhappy with this though.

Comments
--------

[Justin Martin][7] is working on a PHP stream wrapper to automatically add
`declare` upon including PHP files:

<blockquote class="twitter-tweet" lang="en"><p lang="es" dir="ltr"><a href="https://twitter.com/evertp">@evertp</a> Simple PoC: <a href="https://t.co/X2GKbeK7kW">https://t.co/X2GKbeK7kW</a></p>&mdash; Justin Martin (@thefrozenfire) <a href="https://twitter.com/thefrozenfire/status/687412587756187648">January 13, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[Joe Watkins][5] is solving the same problem, but via a PHP extension:

<blockquote class="twitter-tweet" data-conversation="none" data-cards="hidden" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/evertp">@evertp</a> I&#39;ll just leave this here ... <a href="https://t.co/Trq5eYDnOm">https://t.co/Trq5eYDnOm</a> <a href="https://twitter.com/hashtag/php?src=hash">#php</a> <a href="https://twitter.com/hashtag/yolo?src=hash">#yolo</a></p>&mdash; Joe Watkins (@krakjoe) <a href="https://twitter.com/krakjoe/status/687539251014189057">January 14, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[On reddit, OndrejMirtes mentions][4]:

> Yes! We started adding that to the files in our codebase on the day we deployed PHP 7 to our servers and it already uncovered a lot of bugs and inconsistencies, most often passing different parameters than was intended to invoked functions and methods.

[Drew McLellan][6] is not so lucky:

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/evertp">@evertp</a> I write code with a minimum requirement of PHP 5.3. Being able to require PHP 7 is many many years away.</p>&mdash; Drew McLellan (@drewm) <a href="https://twitter.com/drewm/status/687572388444270592">January 14, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


[1]: http://php.net/manual/en/functions.arguments.php#functions.arguments.type-declaration
[2]: http://php.net/manual/en/functions.returning-values.php#functions.returning-values.type-declaration
[3]: http://php.net/manual/en/functions.arguments.php#functions.arguments.type-declaration.strict
[4]: https://www.reddit.com/r/PHP/comments/40uon3/poll_will_you_be_putting_declarestrict_types1_onu/
[5]: https://twitter.com/krakjoe
[6]: https://twitter.com/drewm
[7]: https://twitter.com/thefrozenfire
