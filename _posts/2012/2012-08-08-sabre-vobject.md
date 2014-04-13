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
<p>Over the last little while I've been working at <a href="https://fruux.com/">fruux</a> on a new open source project: an <a href="https://tools.ietf.org/html/rfc5545">iCalendar</a>/<a href="https://tools.ietf.org/html/rfc6350">vCard</a> parser for PHP.</p>

<p>Actually, the project has existed since 2010 as it's really a spin-off from <a href="http://sabre.io/">SabreDAV</a>. I felt like the library could appeal to a wider audience, and benefit from a separate release schedule.</p>

<p>The tool heavily makes use of PHP's magic object and array accessors, to provide an API quite similar to what <a href="php.net/manual/en/book.simplexml.php">simplexml</a> is for XML. In addition it contains features for parsing dates, expanding recurrence rules and automatically creating FREEBUSY reports.</p>

<p>To start using it, simply check out the <a href="https://github.com/fruux/sabre-vobject">github project page</a>. The readme contains a lot of documentation.</p>

<p>Some things I want to add in the future:</p>

<ul>
  <li>Conversion tools for vcalendar 1.0, vcard 2.1, 3.0, 4.0, etc.</li>
  <li>A relaxed parsing mode, that's a bit more forgiven to broken formats.</li>
  <li>Convenience API's for formatting and parsing property values.</li>
  <li>Validation for all property values and components.</li>
</ul>

<p>Currently no zip is provided. You should simply add it to your composer dependencies, as:</p>

```json
{
    "require" : {
      "sabre/vobject" : "2.0.*"
    }
}
```

<p>I hope it's useful, and would love to hear your feedback!</p>
