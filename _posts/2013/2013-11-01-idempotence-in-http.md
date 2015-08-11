---
date: 2013-11-01 16:22:09 UTC
layout: post
title: "On idempotence in HTTP"
tags:
  - http
  - idempotence
  - featured
---

Today I came across a [blogpost][1] arguing idempotence of the HTTP `DELETE`
method, and how this works in practice.

The blogpost itself is rather confusing, as it corrects and changes itself
in a few edits, but the last conclusion as of 11am today is as follows:

> When perfoming a HTTP DELETE method on a resource that succeeds, and
> afterwards performing the exact same HTTP DELETE method again, the HTTP
> status code should not change.

This conclusion is incorrect, and frankly it was suprising to see that both
on that blog, as well as the [reddit thread][2] people were confused about the
correct answer here.

Hence this post.

HTTP and Idempotence
--------------------

The following HTTP methods are all considered idempotent:

* PUT
* DELETE
* GET
* HEAD
* OPTIONS
* TRACE

[Httpbis][3] defines idempotence as follows:

> Idempotent methods are distinguished because the request can be
> repeated automatically if a communication failure occurs before the
> client is able to read the server's response.  For example, if a
> client sends a PUT request and the underlying connection is closed
> before any response is received, then it can establish a new
> connection and retry the idempotent request because it knows that
> repeating the request will have the same effect even if the original
> request succeeded.  Note, however, that repeated failures would
> indicate a problem within the server.

To be fair, this definitition alone is not entirely clear on wether the
response to subsequent requests needs to be identical.

However, this can be inferred from other parts of the specification.

A much clearer example of an idempotent request with varying responses
is PUT. See for example the following (simplified) sequence of requests.

```
PUT /resource HTTP/1.1
If-Match: "1111-1111"
```

```
HTTP/1.1 200 OK
ETag: "2222-2222"
```

```
PUT /resource HTTP/1.1
If-Match: "1111-1111"
```

```
HTTP/1.1 412 Precondition Failed
ETag: "2222-2222"
```

As you can see the second request, although identical, resulted in a different
HTTP response. This is the only correct response.

A server _can not_ remember if a particular client made the request before,
because of the state-less nature of HTTP.

This behavior also extends to `DELETE`. `DELETE` with an `If-Match` header must
return 412 Precondition Failed if the resource was already deleted.

If no `If-Match` header was provided, the server must return `404 Not Found`,
or in some situations `410 Gone` if the server kept track of deleted
resources.

Accoding to [Nicoon][4] on reddit, this was even incorrectly stated in
O'Reilly's [RESTful Web Services Cookbook][5]. An excerpt:

> "The DELETE method is idempotent. This implies that the server must return
> response code 200 (OK) even if the server deleted the resource in a previous"

[source][6]

I guess this is just a subtle reminder that beceause it uses dead trees as
medium, it doesn't necessarily it's correct ;).

The book implies with that statement that a REST server must actually keep
track of every previously deleted resource, just so it can return a 2xx status
code and pretend that the `DELETE` succeeded again. This is absolutely false.

### tl;dr

When a HTTP method is idempotent, this means that when you do a HTTP request
once, the outcome is the same as performing the identical HTTP request more
than once.

Outcome in this sentence does not refer to the literal HTTP response, which
is usually different anyway as most HTTP servers send back a `Date:` header.

Outcome refers to the state of the resource on the server. If I do the same
`DELETE` more than once, the first `DELETE` that comes through will return
a `2xx` status code, and any subsequent `DELETE` will return a `4xx` status
code because the resource has already been removed.

On HTTP 200 vs 204
------------------

This was also addressed in the [blog post][1], and I felt it was worth
explaining the difference here too.

`204 No Content` is often used as the standard response to a successful
`DELETE`. However, `200 OK` is also a perfectly valid response code.

The only different between `200 OK` and `204 No Content` is that with `200`
some response body is expected, and with `204 No Content` no response is
allowed to be sent back.

So it is also perfectly acceptable to send back a `204` as a response to a
`PUT` or `POST` request. There's also nothing in the specification that seems
to argue against the idea of using a `204` as a response to a `GET` request,
As long as the `Content-Length` of the response is 0.

[1]: http://www.duckheads.co.uk/is-a-http-delete-requests-idempotent/491
[2]: http://www.reddit.com/r/PHP/comments/1pohye/is_a_http_delete_request_idempotent/
[3]: http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-24#section-4.2.2
[4]: http://www.reddit.com/r/PHP/comments/1pohye/is_a_http_delete_request_idempotent/cd4ftuw
[5]: http://shop.oreilly.com/product/9780596801694.do
[6]: http://books.google.ca/books?id=ed5ml0T3zyIC&pg=PA11&lpg=PA11&dq=%22The+DELETE+method+is+idempotent.+This+implies+that+the+server+must+return+response+code+200+%28OK%29+even+if+the+server+deleted+the+resource+in+a+previous%22&source=bl&ots=56jp4hMPmv&sig=wlVwErh80soFvy7QkF0N3gFi2UU&hl=en&sa=X&ei=4tJzUvHbO8qYyAHgh4DwDw&ved=0CDIQ6AEwAQ#v=onepage&q=%22The%20DELETE%20method%20is%20idempotent.%20This%20implies%20that%20the%20server%20must%20return%20response%20code%20200%20%28OK%29%20even%20if%20the%20server%20deleted%20the%20resource%20in%20a%20previous%22&f=false
