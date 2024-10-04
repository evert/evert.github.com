---
title: "New Structured Fields RFC out, and so is my Javascript package"
date: "2024-10-03 11:56:31 -0400"
geo: [43.663961, -79.333157]
location: "Leslieville, Toronto, ON, Canada"
tags:
  - structured-fields
  - structured-headers
  - open-source
  - javascript
  - http
  - headers
  - typescript
---

A new RFC was released for Structured Fields: [RFC9651][2].

What is it?
-----------

HTTP headers have been a bit of a free-for all in terms of how complex values
are encoded, with many headers requiring their own mini-parser.

A while back an effort was started to fix this for headers going forward,
named 'Structured Fields'. They're called Fields and not 'Headers' because
HTTP has both Headers and Trailers!

Structured fields let you encode things like lists, dictionaries, strings,
numbers, booleans and binary data. The [original RFC][1] from 2021 is
pretty successful and although many existing headers can't be retrofitted
to this format, a lot of new standards are taking advantage.

Some examples:

```
# Parsed an ASCII string
Header: "foo"

# A simple string, called a 'Token' in the spec
Header: foo

# Parsed as number
Header: 5
Header: -10
Header: 5.01415

# Parsed into boolean
Header: ?1
Header: ?0

# Binaries are base64 encoded
Header: :RE0gbWUgZm9yIGEgZnJlZSBjb29raWU=:

# Items can have parameters
Header: "Hello world"; a="5"

# A simple list
Header: 5, "foo", bar, ?1

# Each element can have parameters
Header: sometoken; param1; param2=hi, 42

# A list can also contain lists itself. These are called 'inner lists' and
# use parenthesis
Header: sometoken, (innerlistitem1 innerlistitem2), (anotherlist)

# A simple dictionary
Header: fn="evert", ln="pot", coffee=?1

# Each item may have parameters too
Header: foo=123; q=1, bar=123, q=0.5

# A dictionary value may be an inner list again
Header: foo=(1 2 3)
```

The new RFC published last week adds 2 new data types: Dates and
'Display strings', which is a Unicode serialization that fits in the HTTP
header (and trailer) format.

```
# Parsed into a Date object
Header: @1686634251

# A Unicode string, called a 'Display String' in the spec. They use
# percent encoding, but encode a different set of characters than
# URLs.
Header %"Frysl%C3%A2n"
```

Why should you care?
--------------------

If you encounter these headers in the wild, it's a really good idea to use
a standard parser. One of the reasons is that with using structured-fields,
there's a built-in extension mechanism. You'll want to make sure that when
a new parameter appears your application doesn't suddenly break.

You may also want to define and use your own HTTP headers. The structured
fields format is a very good 'default choice' that removes decisions such
as 'How should I encode a key value object' or 'how do I encode a UTF-8
string'.

With parsers popping up for every language, you don't have to worry about
writing your own one-off formats.


Javascript package
------------------

I'm the maintainer of a Javascript library for Structured Fields, called
["structured headers"][3], which I've also updated for this new RFC. I wish
I picked the name "structured-fields", but I picked the name before the
original standard changed it's name.

I've just released v2 of this library supporting these new types, and also
added ES Modules support.

Comments?
---------

Reply to one of these:

* [Mastodon post][4]
* [Bluesky post][5]

[1]: https://www.rfc-editor.org/rfc/rfc8941.html "Structured Field Values for HTTP old spec"
[2]: https://www.rfc-editor.org/rfc/rfc9651.html "Structured Field Values for HTTP"
[3]: https://github.com/badgateway/structured-headers "Structured Fields parser/serializer for Javascript and Typescript"
[4]: https://indieweb.social/@evert/113247162498865971 "Mastodon post" 
[5]: https://bsky.app/profile/evertp.bsky.social/post/3l5nvxuyfv32m "Bluesky post"
