---
date: "2019-06-25 15:00:00 UTC"
title: "451 Unavailable For Legal Reasons"
permalink: /http/451-unavailable-for-legal-reasons
tags:
   - http
   - http-series
---

If a server refuses to serve content for legal reasons, it can use the
[`451 Unavailable For Legal Reasons`][1] status code.

Examples of this could include government censorship, or [DMCA][2] takedown
requests.

In many cases when a country censors certain information, it's also not allowed
to discuss that the content was censored. For those cases the `451` status is
not going to be very useful, but for cases where it _can_ be discussed, it's
a good status code to use. It's a more specific version of [`403 Forbidden`][3].

The number 451 is a reference to the book [Fahrenheit 451][4], by Ray Bradbury.
In the book censorship of literature is one of the central themes. 'Fahrenheit
451' is itself a reference to the temperature at which books ignite (232°C in
the developed world).

When a resource is blocked, a server should also respond with a `Link` header
identifiying who blocked the request.

This should refer to the entity that's responsible for the blocking, not the
entity that set the policy (so in the case of Youtube it would refer to Google,
not the US Government in case of a DMCA takedown).

Example
-------

```http
HTTP/1.1 451 Unavailable For Legal Reasons
Link: <https://proxy.example.org/legal>; rel="blocked-by"
Content-Type text/html

<h1>Government policy prohibits you from reading this information.</h1>
```

References
----------

* [RFC7725][1] - An HTTP Status Code to Report Legal Obstacles


[1]: https://tools.ietf.org/html/rfc7725#section-3 "451 Unavailable For Legal Reasons"
[2]: https://en.wikipedia.org/wiki/Digital_Millennium_Copyright_Act
[3]: /http/403-forbidden "403 Forbidden"
[4]: https://en.wikipedia.org/wiki/Fahrenheit_451
[5]: https://tools.ietf.org/html/rfc7725 "An HTTP Status Code to Report Legal Obstacles"
