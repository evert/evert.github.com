---
date: "2018-11-20 08:00:00 -0700"
title: "401 Unauthorized"
permalink: /http/401-unauthorized
location: Groningen, NL
tags:
   - http
   - http-series
---

When a client makes a HTTP request, but the server requires the request to
be authenticated a [`401 Unauthorized`][1] status is returned.

This could mean that a user needs to log in first, or more generally that
authentication credentials are required. It could also mean that the provided
credentials were incorrect.

The name `Unauthorized` can be a bit confusing, and was regarded as a bit of
misnomer. `401` is strictly used for Authentication. In cases where you want
to indicate to a client that they simply aren't allowed to do something, you
need [`403 Forbidden`][11] instead.

When a server sends back `401`, it must also send back a `WWW-Authenticate`
header. This header tells a client what kind of authentication scheme the
server expects.

Examples
--------

This is an example of a server that wants the client to login using [Basic][2]
authentication.

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic; realm="Secured area"
```

This is an example using [Digest][3] auth:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Digest realm="http-auth@example.org", qop="auth, auth-int",
    algorithm=SHA-256, nonce="7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v",
    opaque="FQhe/qaU925kfnzjCev0ciny7QMkPqMAFRtzCUYo5tdS
```

[OAuth2][4] uses something called [Bearer][5] tokens, which is really just a
secret string:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer
```

It's possible for a server to tell a client it supports more than one scheme.
This example might be from an API that normally uses OAuth2, but also allows
Basic for developing/debugging purposes.


```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic; realm="Dev zone", Bearer
```

Due to how HTTP works, the above header is identical to the following:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic; realm="Dev zone"
WWW-Authenticate: Bearer
```

If a client got the correct credentials, it generally sends them to servers
using the `Authorization` header:

```http
GET / HTTP/1.1
Authorization: Basic d2VsbCBkb25lOnlvdSBmb3VuZCB0aGUgZWFzdGVyIGVnZwo=
```

Other authentication schemes
----------------------------

IANA has a [list of standard authentication schemes][6]. Aside from Basic,
Digest and Bearer there is also:

* HOBA
* Mutual
* Negotiate
* OAuth (v1)
* SCRAM-SHA-1
* SCRAM-SHA-256
* vapid

Most of those are less common, some should probably no longer be used. There's
also various auth schemes defined by others in the community:

* [Hawk][9], made by a disillusioned former OAuth2 contributor, fed up with the
  standards process this protocol famously doesn't have a spec.
* Amazon's [AWS][10] scheme.

References
----------

* [RFC6750][4] - Bearer tokens
* [RFC7235, Section 3.1][1] - 401 Unauthorized
* [RFC7616][3] - Digest authentication scheme
* [RFC7617][2] - Basic authentication scheme
* [IANA HTTP Authentication Scheme Registry][6]

[1]: https://tools.ietf.org/html/rfc7235#section-3.1 "401 Unauthorized"
[2]: https://tools.ietf.org/html/rfc7617 "Basic authentication"
[3]: https://tools.ietf.org/html/rfc7616#section-3.9.1 "Digest authentication"
[4]: https://tools.ietf.org/html/rfc6749 "OAuth2"
[5]: https://tools.ietf.org/html/rfc6750 "Bearer token"
[6]: https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml#authschemes
[7]: http://tools.ietf.org/html/rfc7486
[8]: https://tools.ietf.org/html/rfc8120
[9]: https://github.com/hueniverse/hawk
[10]: https://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html#ConstructingTheAuthenticationHeader
[11]: /http/403-forbidden
