---
date: "2018-08-07 08:00:00 -0700"
title: "205 Reset Content"
permalink: /http/205-reset-content
location: "Paris, FR"
geo: [48.852491, 2.374439]
tags:
   - http
   - http-series
---

[`205 Reset Content`][1] is somewhat similar to [`204 No Content`][2]. It's
especially meant for hypertext applications.

Imagine if a user is filling in a HTML form, and this form gets submitted
to the server.

If the server sends back a `204`, a browser could act on this by telling
the user the form submission was successful and NOT refresh the page.

If the server sent back a `205`, a browser can reset the form, similar to a
a reset button a HTML form:

```html
<input type="reset" />
```

Browsers _could_ implement this, but at least according to [an article from 2008
by Ben Ramsey][3], they don't. Implementing this status by a HATEOAS client could
definitely still make sense though.


Example response:

```http
HTTP/1.1 205 Reset Content
Server: foo-bar/1.2
Connection: close
```

References
----------

* [RFC7231][1] - `205` status code.
* [Ben Ramsey on 204 and 205][3].

[1]: https://tools.ietf.org/html/rfc7231#section-6.3.6
[2]: /http/204-no-content
[3]: https://benramsey.com/blog/2008/05/http-status-204-no-content-and-205-reset-content/
