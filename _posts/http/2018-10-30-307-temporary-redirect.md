---
date: "2018-10-30 08:00:00 -0700"
title: "307 Temporary Redirect"
permalink: /http/307-temporary-redirect
location: "San Francisco, US"
tags:
   - http
   - http-series
---

[`307 Temporary Redirect`][1] is similar to [`302 Found`][2] in that it
tells a client to temporarily redirect to a different location to access the
requested resource.

The difference from `302` is that with a `307`, the
client must follow the location and issue the exact same request again. So
if it did a `POST` request on the orginal resource, it should follow the
redirect and do the `POST` request again.

This is unlike a `302` where a client _may_ change the request to a `GET`.
In practice all clients change their HTTP request to a `GET`.

I tested Firefox, Curl and Chrome. For each of them I tested doing a `POST`
request. Each of them redirected and did an identical request on the
target url. In the case of Firefox and Chrome, I tested both a HTML form
and the [Fetch API][3].

I couldn't test Edge and Safari, but assuming their behavior is similar,
I think it problaby makes more sense to always use `307 Temporary Redirect`
or [`303 See Other`][4] in cases where most people use [`302 Found`][2] today.

Stop using `302`, and start using `307` and `303`!

Example
------

```http
HTTP/1.1 307 Temporary Redirect
Server: gws
Location: https://evertpot.com/http/307-temporary-redirect
```

References
----------

* [RFC7231, Section 6.4.7][1] - 307 Temporary Redirect.

[1]: https://tools.ietf.org/html/rfc7231#section-6.4.7 "307 Temporary Redirect"
[2]: /http/302-found "302 Found"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API "Fetch API"
[4]: /http/303-see-other "303 See Other"
