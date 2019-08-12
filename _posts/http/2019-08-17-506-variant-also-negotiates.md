---
date: "2019-08-13 15:00:00 UTC"
title: "506 Variant Also Negotiates"
permalink: /http/506-variant-also-negotiates
tags:
   - http
   - http-series
---

In 1998 [RFC2295][3] was published. It's experimental, and meant to introduce
a new way to do content negotiation in HTTP. As far as I personally know, I
don't think it got a lot of traction.

Traditionally, when a HTTP client wants to do content-negotation, they will
send one or more accept headers:

```http
GET / HTTP/1.1
Accept: text/html; image/png; text/*; q=0.9
Accept-Language: en-CA; en
Accept-Charset: UTF-8
Accept-Encoding: gzip, brotli
```

RFC2295 intended to introduce a new way to do this, with a lot more
flexibility and features. The RFC talks about selecting specific variants
not just based on mimetype, but also HTML features a browser supports,
color capabilities, screen resolution, speed preference, paper size for
printers and even selecting content for specific devices like VR goggles
and PDA's.

An interesting feature is that it can also return a list of urls for specific
variations, changing the HTTP model a bit by giving every representation and
variant their own url, and returning all this in with a
[`300 Multiple Choices`][2] response.

An example of such a response (from the RFC):

```http
HTTP/1.1 300 Multiple Choices
Date: Tue, 11 Jun 1996 20:02:21 GMT
TCN: list
Alternates: {"paper.1" 0.9 {type text/html} {language en}},
{"paper.2" 0.7 {type text/html} {language fr}},
{"paper.3" 1.0 {type application/postscript}
{language en}}
Vary: negotiate, accept, accept-language
ETag: "blah;1234"
Cache-control: max-age=86400
Content-Type: text/html
Content-Length: 227

<h2>Multiple Choices:</h2>
<ul>
  <li><a href=paper.1>HTML, English version</a>
  <li><a href=paper.2>HTML, French version</a>
  <li><a href=paper.3>Postscript, English version</a>
</ul>
```

The RFC introduces a new error code: [`506 Variant Also Negotiates`][1].
To the best of my understanding, this error returned when a server is
misconfigured and a 'negotiating resource' is pointing to another resource
that doesn't serve a representation, but instead also tries to negotiate.

I can imagine that a negotiating resource could for example point to itself,
or sets up something like a redirection look. I _think_ 506 is a specific
error that a server could return for this case.

Should you use this?
--------------------

I often include a section that answers whether you should use this status
code. In this case, I think it's better to dive into whether you should
support the negotiation feature.

The issue with the feature is that it never left the experimental phase, and
as far as I know got very little adoption. It was defined before HTTP/1.1 was
finalized, and for all intents and purposes I think it can be considered dead.

However, it solves a couple of really interesting problems that aren't solved
well in the content-negotation system that we have today.

For example, it allows content-negotation of arbitrary features and it provides
a way to canonicalize specific representations.

Right now when a proxy needs to create a 'key' for storing a representation,
it can only really do so based on the `Vary` header, and it treats headers
appearing in this list as opaque strings.

This means that any variation of an `Accept` header results in a new
representation in cache, even if there's only for example 2 supported
content-types.

So my conclusion here is that I think it's an interesting enough specification
that it might warrant a look, with the following caveats:

1. The spec is poorly supported, so it only really makes sense if you can add
   support to both server and client.
2. Make sure that a fallback exists for clients that *don't* support this
   feature. This should not be terribly difficult.


References
----------

* [RFC2295][3] - Transparent Content Negotiation in HTTP

[1]: https://tools.ietf.org/html/rfc2295#section-8.1 "506 Variant Also Negotiates"
[2]: /http/300-multiple-choices "300 Multiple Choices"
[3]: https://tools.ietf.org/html/rfc2295
