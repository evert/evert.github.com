---
date: 2015-03-02 21:12:50 UTC
layout: post
title: "Dropbox starts using POST, and why this is poor API design."
tags:
    - dropbox
    - http
    - rest
---

Today Dropbox announced in a blogpost titled
["Limitations of the GET method in HTTP"][1] that it will start allowing `POST`
requests for APIs that would otherwise only be accessible using `GET`.

It's an interesting post, and addresses a common limitation people run into
when developing RESTful webservices. How do you deal with complex queries?
Using URL parameters is cumbersome for a number of reasons:

1. There's a limitation to the amount of data you can send. Somewhere between
   [2KB and 8KB apparently][2].
2. URL parameters don't allow nearly enough flexibility in terms of how you
   can define your query. The percent-encoded string doesn't really have a
   universal way to define in what character set its bytes are,
3. The URL is not nearly as versatile and expressive as JSON, and let alone
   XML. 

Their solution to this problem is to now allow `POST` requests on endpoints
that traditionally only alowed `GET`.

Is this the best solution? Well, it's certainly a pragmatic one. We're clearly
running into artificial limitations here that are poorly solved by existing
technology.


The problem with `POST`
-----------------------

Switching to `POST` discards a number of very useful features though. `POST`
is defined as a non-safe, non-idempotent method. This means that if a `POST`
request fails, an intermediate (such as a proxy) cannot just assume they can
make the same request again.

It also ensures that HTTP caches no longer work out of the box for those
requests.


Using `REPORT` instead
----------------------

The HTTP specification has an [extension][3] that defines the `PATCH` request,
this spec is picking up some steam, and a lot of people are starting to use it
to solve common problems in API design.

In the same vein, there's been another standard HTTP method for a while with
the name `REPORT`, which specifically addresses some of the issues with `POST`.

The `REPORT` request:

1. Can have a request body
2. Is safe
3. Is idempotent

It appears in the [IANA HTTP Method list][4] and is actually quite great for
this use-case. The main reason it's off people's radar, is because it
originally appeared in a [WebDAV-related spec][5] a long time ago.

However, its semantics are well defined and it works everywhere. I would love
to see more people start picking this up and adding it to their HTTP API
toolbelt.


Using `GET` with a request body
-------------------------------

Whenever this topic comes up on Hacker News, there's almost guaranteed to be a
comment about using `GET` with a request body.

I wondered about this myself (6 years ago now apparently!) and it's
[my top question on stackoverflow][6]. Clearly a lot of people have the same
thinking process and wonder about this.

Using a request body with `GET` is bad. It might be allowed, but it's
specifically defined as meaningless. This means that any HTTP server, client or
proxy is free to discard it without altering the semantic meaning of the
request, and I guarantee that some of them will.

Furthermore, the benefits of using `GET` are then completely gone. Caching is
not based on request bodies, and these requests are not addressable with a
URI.

Literally the only reason why anyone would do this is because `GET` looks
nicer, it's an aesthetic decision, and nothing more.


Why real `GET` requests are great: addressability
-------------------------------------------------

Whether you use `POST` or the superiour `REPORT` request, you still miss the
biggest advantage of using `GET` requests.

A `GET` query is always a URI. Anyone can link from it. Parts of your service
can link to specific results. Even external services can integrate with you by
referring to specific reports.

A `POST` query can not be linked and neither can a `REPORT` query. All we can
do is explain that a certain URI accepts certain http methods with certain 
media-types, but this is not nearly as elegant as a simple URI. Linking rocks.


An alternative approach
-----------------------

One way to solve this issue entirely and fix all problems related to this, is
disconnect the query you are doing from its result.

To do this, you could create a `/queries` endpoint where you allow clients to
submit `POST` requests to, with request bodies containing all the details of
your query.

This operation could create a new 'query resource' and responds by saying that
the result of this query can be found at `/queries/1` using a
`Content-Location` header.

Then to fetch the result of the query, you can just issue a `GET` request on
`/queries/1`. This means that you:

1. Don't break the Web!
2. Resources in your API are still addressable and can be linked to.
3. The results are still cacheable, safe and idempotent.

We're still using a `POST` request here though, but there's a fundamental
difference: we are using `POST` to create a new 'query resource' and we don't
use it to do the query itself.

The drawback? It's definitely a bit more complicated to design this API and it
requires storage on the server (for the query and/or the result of the query).

But then, REST services are not meant to be simple. They are meant to be
robust and long-lasting, just like the web itself.


[1]: https://blogs.dropbox.com/developers/2015/03/limitations-of-the-get-method-in-http/
[2]: http://stackoverflow.com/questions/2659952/maximum-length-of-http-get-request
[3]: http://tools.ietf.org/html/rfc5789
[4]: http://www.iana.org/assignments/http-methods/http-methods.xhtml
[5]: http://tools.ietf.org/html/rfc3253
[6]: http://stackoverflow.com/questions/978061/http-get-with-request-body
