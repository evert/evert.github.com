---
date: 2013-05-10 15:57:12 UTC
layout: post
title: "Escaping in iCalendar and vCard"
tags:
  - icalendar
  - vcard
  - vobject

---

The #1 bug report in my [vObject][1] library (a library to parse and create
iCalendar and vCard objects in PHP) is that it does a bad job
escaping/un-escaping of values.

In particular, it double-escapes certain values, changing things like `;` into
`\\;` and in other cases it's a bit too liberal un-escaping.

It's gotten to a point where I got so frustrated about this bug, I've been
working all week on a new version of the parser.

Determined to do things right this time, I wanted to make sure I complied with
all the relevant standards, in particular:

* [vCard 2.1][2]
* vCard 3.0 ([rfc2425][3], [rfc2426][4])
* vCard 4.0 ([rfc6350][5])
* iCalendar 2.0 ([rfc5545][6])

When I first wrote the vObject I naively thought that these formats were more
or less the same. On the surface it does indeed seem that way, everything does
seem to follow this basic structure:

    BEGIN:VCARD
    VERSION:4.0
    FN:Evert Pot
    END:VCARD

The nuances and slight difference between the specifications are enough to
drive a simple person to madness though.

Just on the topic of ecaping values (the part after the `:`) the
specifications have the following to say:

vCard 2.1
---------

vCard 2.1, as well as the other specs have a concept of 'compound' or
multi-value properties. An example:

    BEGIN:VCARD
    VERSION:2.1
    N:Pot;Evert;Middle;Dr.;M.D.
    END:VCARD

As you can see, the `N` property has multiple values. Any of these values
may also contain a `;`, which must be escaped as `\;`. So we also cannot
blindly encode a string and automatically add backslashes to any `;` we see.

The semi-colons should only be escaped in the `ADR`, `ORG` and `N` fields,
but we can assume that backslashed semi-colons may also appear in other values.

Any property may have a parameter, a parameter looks a bit like this:

    BEGIN:VCARD
    VERSION:2.1
    NOTE;ENCODING=QUOTED-PRINTABLE:Handsome guy, for sure..
    END:VCARD

A parameter in vCard starts with a `;`, has a name and a value. Only the colon
may be escaped in parameters, using `\:`.

If you somehow wanted to encode a real backslash though, there's no mention
of escaping it as a double-backslash.

If you need newlines in any values, quoted-printable encoding _must_ be used.
Other specs all encode newlines as `\n` or `\N`.

vCard 3.0
---------

rfc2425 says that backslashes (\\\\), newlines (`\N` or `\n`) and comma's (`\,`)
must always be escaped, no exceptions.. Well except when the comma is used as
a delimiter for multiple values.

rfc2426 add semi-colon (`\;`) to this list, except when it's used as a
delimiter. Semi-colon is used as a delimiter in the `N`, `ADR`, `GEO` and
`ORG` fields. `NICKNAME` and `CATEGORIES` use comma's.

vCard also says that individual parts of `ADR`, and `N` may also contain
multiple values themselves, which are themselves split by a comma.

Quoted-printable is now deprecated, and should no longer be used.

Parameters have also changed. The new rule is that parameters _must not_
contain `;`, `:` or `"`, unless they are surrounded by double-quotes, in which
case only `"` may not appear. Escaping of the colon character (`\:`) has
disappeared.

vCard 4.0
---------

vCard 4 changes the interpretation of 3.0 a bit, and now states that
semi-colons _may_ be escaped, depending on the property.

The implication is that we need to maintain lists of properties, if they
support multiple- or compound-values and which delimiter they use
(`,` or `;`).

Semi-colons are now used by `N`, `ADR`, `ORG` and `CLIENTPIDMAP`. Comma's are
used by `NICKNAME`, `RELATED`, `CATEGORIES` and `PID`.

Even though the spec does say that comma's must always be escaped, it does
appear to violate this rule in it's own examples, specifically the example
for `GEO` (which is no longer a compound float value, but a url).

iCalendar 2.0
-------------

iCalendar 2.0 largely follows the same rules as vCard 4.0, but commas and
semi-colons _must_ be esacped, unless they are used as a delimiter.

Semi-colons are used as a delimiter in `REQUEST-STATUS`, `RRULE`, `GEO` and
`EXRULE`, every other property uses commas.

rfc6868
-------

One major flaw in all the above specs was that it was not possible to encode
just any value as a parameter. Newlines are not allowed, and in no case can
you encode a double-quote.

[rfc6868][7] updates both iCalendar 2.0 and vCard 4.0 to use caret (`^`) as
an escape character. To write a double quote, use `^'`, to encode a newline
use `^n` and to encode a caret, use `^^`.

The hard part
-------------

A simple generic parser is with this information simply out of the window,
not only will my parser have to be aware which document it's parsing, it will
also have to make individual decisions based on which property it's parsing.

Researching and listing these rules helped, and I hope it's also helpful for
a future implementor.

It's important to be strict in generating these formats, but
considering the complexity of these rules, it's extremely likely other
software has bugs when generating these (and they do! a lot!) any parser needs
to be able to handle these mistakes and attempt to make logical decisions
based on what likely the intention was.

Found mistakes?
---------------

You can fork this post or easily [make edits of this post on Github][8].

[1]: http://sabre.io/vobject/
[2]: http://www.imc.org/pdi/pdiproddev.html
[3]: http://tools.ietf.org/html/rfc2425
[4]: http://tools.ietf.org/html/rfc2425
[5]: http://tools.ietf.org/html/rfc6350
[6]: http://tools.ietf.org/html/rfc5545
[7]: http://tools.ietf.org/html/rfc6868
[8]: https://github.com/evert/evert.github.com/blob/master/_posts/2013/2013-05-10-escaping-in-vcards-and-icalendar.md
