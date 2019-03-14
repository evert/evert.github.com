---
date: "2019-02-19 11:00:00 -0400"
title: "412 Precondition Failed"
permalink: /http/412-precondition-failed
tags:
   - http
   - http-series
location: DiiD office, Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

In HTTP it's possible to do conditional requests. These are requests that only
execute if the right conditions are met.

For `GET` requests, this might be done to only retrieve the resource if it has
changed. For those cases [`304 Not Modified`][2] is returned.

For other cases, `412 Precondition Failed` is returned.

Examples
--------

This client only wants the `PUT` request to succeed, if it didn't already
exit:

```http
PUT /foo/new-article.md HTTP/1.1
Content-Type: text/markdown
If-None-Match: *
```

This request is an update, and it should only succeed if the article hasn't
change since last time.

```http
PUT /foo/old-article.md HTTP/1.1
If-Match: "1345-12315"
Content-Type: text/markdown
```

If the condition didn't pass, it returns:

```http
HTTP/1.1 412 Precondition Failed
Content-Type: text/plain

The article you're tring to update has changed since you last seen it.
```

One great advantage of this is that prevents lost updates, due to multiple
people writing to the same resource. This is also known as the 'lost update'
problem.

Using the `Prefer` header, it's possible for a client to get the current
state of the resource, in case the local copy was outdated. This saves a `GET`
request.

```http
PUT /foo/old-article.md HTTP/1.1
If-Match: "1345-12315"
Content-Type: text/markdown
Prefer: return=representation

### Article version 2.1
```

```http
HTTP/1.1 412 Precondition Failed
Content-Type: text/markdown
Etag: "4444-12345"
Vary: Prefer

### Article version 3.0
```

This is useful, but it should probably have been designed with a HTTP/2 Push
message instead. Nevertheless, there's no harm in adopting this for legacy
HTTP/1.1 systems.


References
----------

* [RFC7232, Section 4.2][1] - 412 Precondition Failed.
* [RFC7240, Section 4.2][4] - `Prefer: return=representation`.
* [RFC8144, Section 3.2][3] - Usage of `Prefer: return=representation` with 412.

[1]: https://tools.ietf.org/html/rfc7232#section-4.2 "412 Precondition Failed"
[2]: /http/304-not-modified "304 Not Modified"
[3]: https://tools.ietf.org/html/rfc8144#section-3.2 "Unsuccessful Conditional State-Changing Requests"
[4]: https://tools.ietf.org/html/rfc7240#section-4.2
