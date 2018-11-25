---
date: "2018-11-27 08:00:00 -0700"
title: "402 Payment Required"
permalink: /http/402-payment-required
tags:
   - http
   - http-series
location: Groningen, NL
---

[`402 Payment Required`][1] is a status-code described by the standard as:

> The 402 (Payment Required) status code is reserved for future use.

The original idea may have been that commercial websites and APIs would want
to have a default way to communicate that a HTTP request can be repeated,
after a user paid for service.


Usage
-----

The RFC suggests that it's not a good idea to use this status code today,
because it may get a better definition in the future, possibly making existing
sites incompatible with HTTP.

That being said, it hasn't really stopped people from using the code anyway.

* The [Shopify API][2] uses it to indicate a "shop is frozen".
* [Pubnub][3] also uses it to indicate that a feature needs to be paid for.
* [Youtube may be using it][4] to rate-limit abusers.

So should you use it? The RFC says no. But, I also don't think there's a major
risk in doing so.


References
----------

* [RFC7231, Section 6.5.2][1] - 402 Payment Required

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.2 "402 Payment Required"
[2]: https://help.shopify.com/en/api/getting-started/response-status-codes
[3]: https://support.pubnub.com/support/solutions/articles/14000069039-why-am-i-getting-402-payment-required-response-in-my-javascript-app-
[4]: https://github.com/rg3/youtube-dl/blob/master/README.md#http-error-429-too-many-requests-or-402-payment-required
