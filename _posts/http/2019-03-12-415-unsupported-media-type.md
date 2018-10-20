---
date: "2019-03-12 11:00:00 -0400"
title: "415 Unsupported Media Type"
permalink: /http/415-unsupported-media-type
tags:
   - http
   - http-series
location: San Francisco, US
---

When a server receives a request with a body it doesn't understand, it should
return `415 Unsupported Media Type`. Most commonly this is a good response for
for example a `POST` or `PUT` request with an unknown `Content-Type` header.

The specification says that aside from inspecting the `Content-Type` header, the
server may also return this after inspecting the body.

What this means is that if the client sent a request with a supported
`Content-Type`, it may still return `415` if the contents of the request body
were not supported by the server.

For example, a server might support specific JSON bodies, but the contents of
the JSON payload didn't validate, perhaps because it was missing a required
property.

However, for the latter case it might be better to use
[`422 Unprocessable Entity`][3]. The description in the standards for `422` is
slightly contradicting with the one for `415`, but `422` seems to be more
specifically for cases where the `Content-Type` was correct, the request was
parsable, but semantically incorrect.

I would suggest the following approach to deciding the right status code:

* If the `Content-Type` was not supported, use `415`.
* Else: If the request was not parsable (broken JSON, XML), use
  [`400 Bad Request`][4].
* Else: If the request was parsable but the specific contents of the payload
  were wrong (due to validation or otherwise), use `422`

Example
-------

```http
POST /new-article HTTP/1.1
Content-Type: text/html

<h1>Another day, another blog post</h1>
```

```http
HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json

{"error": "This endpoint only supports text/markdown for new articles"}
```

References
----------

* [RFC7231, Section 6.5.13][1] - 415 Unsupported Media Type
* [RFC4918, Section 11.2][1] - 422 Unprocessable Entity

[1]: https://tools.ietf.org/html/rfc7231#section-6.5.13 "415 Unsupported Media Type"
[2]: https://tools.ietf.org/html/rfc4918#section-11.2 "422 Unprocessable Entity"
[3]: /http/422-unprocessable-entity "422 Unprocessable Entity"
[4]: /http/400-bad-request "400 Bad Request"
