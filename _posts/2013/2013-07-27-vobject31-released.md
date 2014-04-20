---
date: 2013-07-27 19:12:08 UTC
layout: post
title: "Sabre VObject 3.1 released"
tags:
  - php
  - icalendar
  - vcard
  - vobject
  - sabredav
  - jcard
  - jcal

---

I just released version 3.1 of the [sabre/vobject][1] library.

It's a minor release, but contains a bunch of features I didn't have time to
add to 3.0, namely:

1. You can now parse jCard and jCal. In version 3.0 only generating these
   formats was supported.
2. Methods to convert between vCard 2.1, 3.0 and 4.0.
3. A whole bunch of bugfixes and smaller features.
4. A fancy new CLI tool, that looks a bit like this:

![vobject cli screenshot](/resources/images/posts/vobject-cli.png "sabre/vobject cli")

Read all about the new features in the [Documentation][2] or check out the [ChangeLog][3] for the full list of changes.

[1]: http://sabre.io/vobject/
[2]: http://sabre.io/vobject/usage/
[3]: https://github.com/fruux/sabre-vobject/blob/master/ChangeLog
