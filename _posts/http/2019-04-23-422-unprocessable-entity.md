---
date: "2019-04-23 15:00:00 UTC"
title: "422 Unprocessable Entity"
permalink: /http/422-unprocessable-entity
tags:
   - http
   - http-series
---

The [`422 Unprocessable Entity`][1] status-code does not appear in the base
HTTP specification. Like [`102`][2] and [`207`][3] it's part of the [WebDAV
specification][4], which is an extension to HTTP.

Unlike the other two, the `422` code has a good general use-case, and is
often used in Web API's.

The `422` code implies that the server understood the general syntax of the
request, but the contents were incorrect. For example, a server might expect
`POST` requests that uses the `application/json` format. If the request is
broken JSON, it might be more appropriate to send back the `400` status code,
but if the request is valid JSON but the request doesn't pass validation
(via for example json-schema) returning `422` might be better.

If there was something wrong with the request body, you can use the following
rules to figure out what to send back:

* If the `Content-Type` was not supported, use `415`.
* Else: If the request was not parsable (broken JSON, XML), use
  [`400 Bad Request`][4].
* Else: If the request was parsable but the specific contents of the payload
  were wrong (due to validation or otherwise), use `422`

Example
-------

```http
POST /new-article HTTP/1.1
Content-Type: application/json

{ "title": "Hello world!"}
```

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/problem+json

{
  "type" : "https://example/errors/missing-property",
  "status": 422,
  "title": "Missing property: body"
}
```


References
----------

* [RFC4918, Section 11.2][1] - 422 Unprocesable Entity

[1]: https://tools.ietf.org/html/rfc4918#section-11.2 "422 Unprocessable Entity"
[2]: /http/102-processing "102 Processing"
[3]: /http/207-multi-status "207 Multi-Status"
[4]: https://tools.ietf.org/html/rfc4918 "WebDAV specification" 
