---
date: 2014-03-30 22:27:16 UTC
layout: post
title: "PHP 5.5.10 timezone handling changes"
tags:
  - php
  - timezone
---

PHP 5.5.10 [got released][1] a few weeks ago, and among other things, it added
some new functionality related to timezone handling.

In short, this is now works:

    $tz = new DateTimeZone('UTC-05:00');

Normally this would not be recommended, as you really should specify timezones
based on their geographical location. This information is not always available
though, so it's a welcome new feature.

The [sabre/vobject][2] project is a heavy user of timezone-related features,
and unfortunately this introduced a few subtle bugs.

UTC vs. GMT
-----------

Before PHP 5.5.10, this code:

    $tz = new DateTimeZone('GMT');
    echo $tz->getName();

Would output:

    UTC

Now, `GMT` no longer automatically gets converted to `UTC`, and the same
script will now output `GMT`. `UTC` and `GMT` are very similar, and in most
practical situation interchangeable. ([but not all][3]).

If you relied before on figuring out wether a time is in `UTC`, be careful,
because you may have to change this to `UTC` _or_ `GMT`.


Some timezone ids are now invalid
---------------------------------

There's quite a bit of weird timezones on the [Other][4] page on php.net. Even
though these are not recommended to be used, we still need them as people
_may_ generate timezone ids from that list, which we need to understand and
parse.

Since PHP 5.5.10, the following timezone identifiers from that list now throw
errors:

    CST6CDT
    Cuba
    Egypt
    Eire
    EST5EDT
    Factory
    GB-Eire
    GMT0
    Greenwich
    Hongkong
    Iceland
    Iran
    Israel
    Jamaica
    Japan
    Kwajalein
    Libya
    MST7MDT
    Navajo
    NZ-CHAT
    Poland
    Portugal
    PST8PDT
    Singapore
    Turkey
    Universal
    W-SU

This was reported as [bug #66985][5].

Handling of some incorrect timezone names
-----------------------------------------

The vobject library relies on exceptions to be thrown when constructing the
`DateTimeZone` object. When this happens, a fallback behaviour kicks in that
attempts to guess the correct timezone.

Microsoft often throws us timezones such as this:

    (GMT+01.00) Sarajevo/Warsaw/Zagreb

This now automatically gets picked up as the '+01:00' timezone by
`DateTimeZone`, so as of PHP 5.5.10 the fallback behavior no longer kicks in,
and we're no longer returning `Europe/Sarajevo'.

[1]: http://www.php.net/ChangeLog-5.php#5.5.10
[2]: http://sabre.io/vobject/
[3]: http://geography.about.com/od/timeandtimezones/a/gmtutc.htm
[4]: https://php.net/manual/en/timezones.others.php
[5]: https://bugs.php.net/bug.php?id=66985
