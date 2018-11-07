---
date: "2018-11-07 11:00:00 -0400"
title: "Which redirect do I choose?"
permalink: /http/which-redirect-status
location: "Adelaide St West, Toronto, ON, CA"
geo: [43.646645, -79.396766]
tags:
   - http
   - http-series
---

The `3xx` status-codes are a bit of a mess. There's a lot of confusion and
mis-use, so I thought it might help to sum all of them up in a single article.

Choosing the right redirect
---------------------------

Are you responding to a `POST` request, and instead of returning a status
immediately, you want to redirect the user to a confirmation page?

**Use [`303 See Other`][5].**

Did the resource move to a new path, or a new domain, and you want to make sure
that any HTTP client repeats the _exact_ same HTTP request on the new location?

**Use [`307 Temporary Redirect`][3] if the move was temporary, or
 [`308 Permanent Redirect`][6] if the move was permanent.**

Did the resource move, but you only care about `GET` request? (perhaps because
this is a website).

**Use [`302 Found`][4] if the move was temporary, or
[`301 Moved Permanently`][2] if the move was permanent.**

Do you want to send the user somewhere else, but you're not sure where because
there's more than one option, and you'd like the user to decide:

**Use [`300 Multiple Choices`][7].**

References
----------

* [RFC7231, Section 6.4.1][8] - 300 Multiple Choices.
* [RFC7231, Section 6.4.2][9] - 301 Moved Permantently.
* [RFC7231, Section 6.4.3][10] - 302 Found.
* [RFC7231, Section 6.4.4][11] - 303 See Other.
* [RFC7231, Section 6.4.7][12] - 307 Temporary Redirect.
* [RFC7238][1] - 308 Permanent Redirect.

[1]: https://tools.ietf.org/html/rfc7238 "308 Permanent Redirect"
[2]: /http/301-moved-permanently
[3]: /http/307-temporary-redirect
[4]: /http/302-found
[5]: /http/303-see-other
[6]: /http/308-permanent-redirect
[7]: /http/300-multiple-choices
[8]: https://tools.ietf.org/html/rfc7231#section-6.4.1 "300 Multiple Choices"
[9]: https://tools.ietf.org/html/rfc7231#section-6.4.2 "301 Moved Permanently"
[10]: https://tools.ietf.org/html/rfc7231#section-6.4.3 "302 Found"
[11]: https://tools.ietf.org/html/rfc7231#section-6.4.4 "303 See Other"
[12]: https://tools.ietf.org/html/rfc7231#section-6.4.7 "307 Temporary Redirect"
