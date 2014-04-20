---
date: 2013-06-21 17:51:04 UTC
layout: post
title: "Sabre VObject 3 released"
tags:
  - php
  - icalendar
  - vcard
  - vobject
  - sabredav
  - jcard
  - jcal

---

I just released version 3 of the [sabre/vobject][11] library. The ultimate library
for parsing and manipulating vCard and iCalendar files in PHP (I hope!).

The library started off as component of [SabreDAV][1], but it's actually become
more popular than it's parent project.

It's been an interesting project for me. SabreDAV is my main other open source
project at [fruux][10], and that project has a really strong focus on a proper OOP design and
structure.

With vobject, the focus has been on providing as convenient API as possible
and follows the "api over implementation" mantra. For me this means that the
experience for the user is the most important, but if you pop open the hood
it can turn out to be a bit messy.

This is especially true because I'm supporting:

  * iCalendar 2.0
  * vCard 2.1
  * vCard 3.0
  * vCard 4.0
  * jCard
  * jCal

And while each of those formats look quite similar on the surface, each
has their own set of rules for encoding, and a lot of edge-cases.

I admit to not having dug into that enough when I originally created the
library, and I was required to rewrite huge portions of it and break BC just
to properly support everything. Hence: 3.0.

A mini tutorial
---------------

Reading a vCard:

```php
<?php

use Sabre\VObject\Reader;

$card = Reader::read('contact.vcf');
echo (string)$card->FN;

?>
```

Creating an iCalendar object:

```php
<?php

use Sabre\VObject\Component\VCalendar;

$cal = new VCalendar();

$cal->add('VEVENT', [
    'summary' => 'Birthday party',
    'dtstart' => new DateTime('2014-07-04 22:00:00'),
    'categories' => ['party!', 'byob'],
]);

echo $cal->serialize();

?>
```

This will output something like:

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sabre//Sabre VObject 3.0.0//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Birthday party
DTSTART;TZID=Europe/London:20140704T220000
CATEGORIES:party!,byob
END:VEVENT
END:VCALENDAR
```

Check out the [documentation][2] for everything else, there's quite a bit :).

What's new?
-----------

1. We're now following all the escaping rules from vCard 2.1, 3.0, 4.0,
   iCalendar 2.0 and rfc6868.
2. Support for exporting [jCal][3] and [jCard][4] formats, which are json
   representations of this format, and soon to be official RFC's.
2. Easily create multi-valued properties using arrays.
3. Great vCard 2.1 support, including the broken vCards microsoft generates.
4. It's much easier to create components such as VEVENT, VTODO.
4. Stream-based parser.
5. Almost every property type got specialized API's to easily deal with them.
   For instance, you can now simply create date-time-related properties by
   just setting a native PHP DateTime object.
6. Added a remove() method to components.
7. iCalendar and vCard objects are automatically initialized with common
   default properties.

Some BC breaks were required, read the [migration document][5] to find out how
to upgrade.

Information for SabreDAV users
------------------------------

VObject 3.0 will be included in the next major release of SabreDAV. SabreDAV
1.7.x and 1.8.x will continue to ship with vObject 2 to avoid BC breaks.

However, both those branches have been modified so they _can_ run with either
vObject 2 or 3. So if you do need the new features and improvements, you
can just drop it in.

Special thanks!
---------------

A few people have been especially helpful in testing, criticising and thinking
along:

* [Thomas Tanghus][6]
* [Markus Staab][7]
* [Chris L. a.k.a. @clue][8]
* [Bokxing-it][9]

Thanks guys! You rock.

[1]: http://sabre.io/
[2]: http://sabre.io/vobject/usage/
[3]: http://tools.ietf.org/html/draft-ietf-jcardcal-jcard-03
[4]: http://tools.ietf.org/html/draft-ietf-jcardcal-jcal-04
[5]: https://github.com/fruux/sabre-vobject/blob/master/doc/MigratingFrom2to3.md
[6]: http://tanghus.net/
[7]: https://github.com/staabm
[8]: https://github.com/clue
[9]: http://www.bokxing-it.nl/
[10]: https://fruux.com/opensource/
[11]: http://sabre.io/vobject/
