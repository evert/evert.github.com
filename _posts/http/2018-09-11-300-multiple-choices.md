---
date: "2018-09-11 08:00:00 -0700"
layout: http-series
title: "300 Multiple Choices"
permalink: /http/300-multiple-choices
tags:
   - http
   - http-series
---

[`300 Multiple Choices`][1] is the first of the 3xx series, which are all used
for redirection.

`300` should be emitted specifically, when a resource can redirect to more than
one location, and it wants the user to decide which one.

Support for `300` is scarce. In the past both the [`URI`][4] and
[`Alternates`][5] HTTP headers were suggested to tell a client which resource
to choose, but [RFC7231][1] currently recommends the [`Link`][3] header.

Example
-------

```http
HTTP/1.1 300 Multiple Choices
Server: curveball/0.3.1
Access-Control-Allow-Headers: Content-Type,User-Agent
Access-Control-Allow-Origin: *
Link: </foo> rel="alternate"
Link: </bar> rel="alternate"
Content-Type: text/html
Location: /foo
```

This example lists `/foo` and `/bar` as potential choices a user could make.
The response also suggests a default with the `Location` header. This is
optional.

Usage
-----

In my testing neither Chrome nor Firefox have way to deal with `300` responses.

However, it is possible for a server to just return a `text/html` body, listing
both choices and allowing a user to click to the resource they want.

I also tested the `Location` header. If it's present, Firefox will immediately
redirect to that location, and Chrome ignores it.

However, I think it's perfectly fine to use this status in an API, and write a
custom client to do something with this response.

If you are building a Hypermedia service, you could also respond with for
example a [HAL][2] document listing the various choices, although I would make
sure that the `alternate` links appear both in the HTTP `Link` header, as well
as the HAL `_links` object.

References
----------

* [RFC7231, Section 6.4.1][1] - 300 Multiple Choices
* [RFC5988][3] - `Link` header.

[1]: https://tools.ietf.org/html/rfc7231#section-6.4.1 "300 Multiple Choices"
[2]: http://stateless.co/hal_specification.html "HAL"
[3]: https://tools.ietf.org/html/rfc5988 "Web Linking"
[4]: https://tools.ietf.org/html/rfc4229#section-2.1.108 "URI header"
[5]: https://tools.ietf.org/html/rfc2295#section-8.3 "Alternates header"
