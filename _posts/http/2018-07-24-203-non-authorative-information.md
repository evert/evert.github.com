---
date: "2018-07-24 08:00:00 -0700"
title: "203 Non-Authoritative Information"
permalink: /http/203-non-authoritative-information
location: "Los Angeles, US"
tags:
   - http
   - http-series
---

[`203 Non-Authoritative Information`][1] is a status-code that might be used by
a HTTP proxy.

A HTTP Proxy sits in the middle between a client and a server (origin). In
some cases a HTTP Proxy might make changes to the response before it reaches
the client.

Perhaps because the Proxy converts the format, or maybe it adds something to
the HTML body.

For these situations a proxy can indicate that it changed something by
changing the status-code to `203`.

However, this status-code has some issues. If a proxy changed the status-code,
it's no longer possible to see what the original status code was. Maybe it was
a `200`, or `201` or `404` before. That information is now lost.

The RFC actually [suggest][1] to use the [`Warning` header][2] for this instead.
The warning header can be set to the code `214 Transformation applied`. The
benefit of a warning code over a status-code is that it can be set without
obscuring what the original status code was.

I would not recommend using `203`, and I'm not aware of any software that does.
A `Warning` header is better.

Example using `203 Non-Authorititative Information`:

```http
HTTP/1.1 203 Non-Authoritative Information
Content-Type: text/plain
Content-Length: 515

...
```

Example using `Warning` header

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Warning: 214 proxy.example.org "We censored the response. srry"
Content-Length: 515

...
```

Even though the Warning header is actually required when proxies modify
the response, most proxies don't appear to include it.

Random fact: `Non-Authoritative Information` has 10 syllables. It shares
the #1 spot for most syllables with another status code.

References
----------

* [RFC7231][1] - `203` status code.
* [RFC7234][2] - `Warning` header.

[1]: https://tools.ietf.org/html/rfc7231#section-6.3.3
[2]: https://tools.ietf.org/html/rfc7234#section-5.5
