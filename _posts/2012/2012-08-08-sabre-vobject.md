---
date: 2012-08-08 08:13:35 UTC
layout: post
slug: sabre-vobject
title: "New open source project: Sabre VObject"
tags:
  - sabredav
  - icalendar
  - vcard
  - vobject

---
Over the last little while I've been working at [fruux][1] on a new open
source project: an [iCalendar][2]/[vCard][3] parser for PHP.

Actually, the project has existed since 2010 as it's really a spin-off from
[SabreDAV][4]. I felt like the library could appeal to a wider audience, and
benefit from a separate release schedule.

The tool heavily makes use of PHP's magic object and array accessors, to
provide an API quite similar to what [simplexml][5] is for XML. In addition
it contains features for parsing dates, expanding recurrence rules and
automatically creating FREEBUSY reports.

To start using it, simply check out the [project page][6]. The readme contains
a lot of documentation.

Some things I want to add in the future:

* Conversion tools for vcalendar 1.0, vcard 2.1, 3.0, 4.0, etc.
* A relaxed parsing mode, that's a bit more forgiven to broken formats.
* Convenience API's for formatting and parsing property values.
* Validation for all property values and components.

Currently no zip is provided. You should simply add it to your composer dependencies, as:

```json
{
    "require" : {
      "sabre/vobject" : "2.0.*"
    }
}
```

<p>I hope it's useful, and would love to hear your feedback!</p>

[1]: https://fruux.com/
[2]: https://tools.ietf.org/html/rfc5545
[3]: https://tools.ietf.org/html/rfc6350
[4]: http://sabre.io/
[5]: http://php.net/manual/en/book.simplexml.php
[6]: http://sabre.io/vobject
