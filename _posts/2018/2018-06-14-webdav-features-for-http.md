---
title: WebDAV features that might be useful for HTTP services.
date: 2018-06-14 23:03:18 -0700
tags:
  - webdav
  - rest
  - http
---

While [WebDAV][1] is no longer really used as the foundation for new HTTP
services, the WebDAV standard introduced a number of features that are
applicable to other types of HTTP services.

WebDAV comprises of [many][2] standards that each build on the HTTP protocol.
Many of the features it adds to HTTP are not strictly tied to WebDAV and are
useful in other contexts. And even though it 'extends' HTTP, it does so within
the confines of the HTTP framework, so you can take advantage of them using
standard HTTP clients and servers.

MOVE & COPY
-----------

WebDAV adds 2 HTTP methods for moving and copying resources. If you were to
stick to typical HTTP/REST semantics, doing a move operation might imply you
need several requests.

```
GET /source <-- retrieve a resource
PUT /destination <-- create the new resource
DELETE /source <-- remove the old one
```

One issue with this approach is that it's not an atomic operation. In the
middle of this process there is a short window where both the source and
destination exist.

If an atomic move operation is required, a typical solution might be to create
a `POST` request with a specific media-type for this, and this is a completely
valid solution.

A POST request like that might look like this:

```http
POST /source HTTP/1.1
Content-Type: application/vnd.move+json

{
  "destination": "/destination"
}
```

The WebDAV `MOVE` request looks like this:

```
MOVE /source HTTP/1.1
Destination: /destination
```

Both the `MOVE` and `COPY` request use the `Destination` header to tell the
server where to copy/move to. The server is supposed to perform this operation
as an atomicly, and it must either completely succeed or completely fail.

Using `POST` for this is completely valid. However, in my mind using a HTTP
method with more specific semantic can be nice. This is not that different
from using `PATCH` for partial updates. Anything that can be done with `PATCH`,
could be done with `POST`, yet people tend to like the more specific meaning
of a `PATCH` method to further convey intent. 

* [RFC4918, section 9.8: COPY method][5].
* [RFC4918, section 9.9: MOVE method][4].


REPORT & SEARCH
---------------

Sometimes it's required to do complex queries for information on a server. The
standard way for retrieving information is with a `GET` request, but there's
times where it's infeasable to embed the entire query in the url.

There's more than one way to solve this problem. Here's a few common ones:

1. You can use `POST` instead. This is by far the most common, and by many
   considered the most pragmatic.
2. Create a "report" resource, expose a separate "result" resource and fetch it
   with `GET`. This is considered a better RESTful solution because you still
   get a way to reference the result by its address.
3. Supply a request body with your `GET` request. This is a really bad idea, and
   goes against many HTTP best practices, but some products like
   [Elasticsearch][6] do this.

If you are considering option #1 (`POST`) you're opting out of one of the most
useful features of HTTP/Rest services, which is the ability to address specific
resources.

However, you are giving up another feature of `GET`. `GET` is considered a
'safe' and 'idempotent' request, but `POST` is neither.

If that last issue is something you care about, you might want to consider
using `REPORT` or `SEARCH` instead. The requests and response bodies could
identical if you were to use `POST`, but these methods are both idempotent,
and safe.

* [RFC3252, section 3.6: REPORT method][7].
* [RFC5323, section 2: The SEARCH method][8].

Note that the rfc's above focus on WebDAV semantics and XML requests and
responses. However, I don't believe there's anything wrong with defining your
own (json-based?) media-types and semantics.


The If header
-------------

HTTP has a bunch of headers for [conditional requests][9]. Specifically, these
are:

* `If-Match`
* `If-None-Match`
* `If-Modified-Since`
* `If-Unmodified-Since`
* `If-Range`

WebDAV defines another header for conditional requests that's much more
powerful: `If`.  It can do the same as `If-Match` and `If-None-Match`, but
adds a number of features on top.

Here's some examples of `If` and their equivalent `If-[None-]Match` headers:

```
If-Match: "foo-bar"
If-None-Match: "foo-bar"

If: (["foo-bar"])
If: (NOT ["foo-bar"])
```

This doesn't seem much like a benefit, but `If` can do more. For instance,
it's possible to make a request conditional on the etag state of a second
resource.

The following PUT request only succeeds if the etag on `/resourceB` equals
`"foo-bar"`.

```
PUT /resourceA HTTP/1.1
If: </resourceB> (["foo-bar"])
```

A specific example where this is useful might actually be the earlier
mentioned `COPY` and `MOVE` operations. Because those methods affect
resources not specified in the request-URI, you might want to check the etag
of both the source and destinations to avoid conflicts.

```
COPY /source HTTP/1.1
Destination: /destination
If: </source> (["etag1"]) </destination> (["etag2"]).
```

Another possibility is to validate against 2 etags with "OR".

```
PUT /foo
If: (["etag1"]) (["etag2"]).
```

Another possibility is to use `AND`, although in this example this would
always fail:

```
PUT /foo
If: (["etag1"] ["etag2"]).
```

### Conditions on custom flags

There's another feature that's very powerful. In every previous example we
always made our requests conditional on ETags. HTTP itself also allows
conditions based on the `Last-Modified` header, but that's really it. The `If`
header allows for conditions on your own custom flags & extensions.

The following is a purely fictional example, but imagine that we have a "user"
resource, and that user has a flag indicating whether or not they paid for
a service.

This flag could be expressed as a uri. For example,
`https://example.org/flags/user-has-paid`. Note that this uri doesn't actually
need to 'work'. You could use a `urn:uuid:` or even `gopher://` if you wish.

The following `PUT` request would only succeed if the user has paid:

```
PUT /foo
If: </user/234> (<https://example.org/flags/user-has-paid>).
```

This example is a bit contrived, but I tried to find a simple one. The
underlying idea is that conditional requests can sometimes be useful, and
'ETag' is not always the best way to express certain states on the server.

* [RFC4918, section 10.4: If header][10]. 


Conclusion
----------

I'm not sure yet it's a good idea to use these features for HTTP or RESTish
services, because it kind of breaks the principe of least surprise.

However, they provide useful semantics that the base specs don't have a
perfect answer for.

I'm not sure yet how to weight these trade-offs, but at least it's interesting.


What didn't make the list
--------------------------

* The [MKREDIRECT][11] method to create new redirects on the server.
* The [LOCK][12] and [UNLOCK][13] method to lock resources.
* [BIND][14] and [UNBIND][15] for implementing a 'hard-link' type of feature.

[1]: https://tools.ietf.org/html/rfc4918 "HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)"
[2]: http://sabre.io/dav/standards-support/ 
[3]: https://tools.ietf.org/html/rfc5789 "PATCH Method for HTTP"
[4]: https://tools.ietf.org/html/rfc4918#section-9.9 "MOVE Method"
[5]: https://tools.ietf.org/html/rfc4918#section-9.8 "COPY Method"
[6]: https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-multi-get.html
[7]: https://tools.ietf.org/html/rfc3253#section-3.6 "REPORT Method"
[8]: https://tools.ietf.org/html/rfc5323#section-2 "The SEARCH Method"
[9]: https://tools.ietf.org/html/rfc7232 "Hypertext Transfer Protocol (HTTP/1.1): Conditional Requests" 
[10]: https://tools.ietf.org/html/rfc4918#section-10.4 "If Header"
[11]: https://tools.ietf.org/html/rfc4437 "Web Distributed Authoring and Versioning (WebDAV) Redirect Reference Resources"
[12]: https://tools.ietf.org/html/rfc4918#section-9.10 "LOCK Method"
[13]: https://tools.ietf.org/html/rfc4918#section-9.11 "UNLOCK Method"
[14]: https://tools.ietf.org/html/rfc5842#section-4 "BIND Method"
[15]: https://tools.ietf.org/html/rfc5842#section-5 "UNBIND Method"
