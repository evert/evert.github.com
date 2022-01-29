---
title: "Request bodies in GET requests"
date: "2022-01-29 19:14:00 UTC"
geo: [60.183984, -46.400107]
location: "IE127, Above the Atlantic"
draft: true
---

12 years ago I asked on Stack Overflow: [Are HTTP GET requests allowed to
have request bodies?][1]. This got a 2626 upvotes and a whopping 1.6 million
views, so clearly it's something lots of people are still curious about, and
in some cases disagree with the accepted answer.

[![Stack overflow screenshot](/assets/posts/get-body/so-screenshot.png)][1]

Because it keeps popping up in my Stack Overflow notifications (and
I compulsively visit the site), the question has lived in my head
rent-free. I've been meaning to write a few thoughts about for a few
years now it in hopes to evict it.

Anyway, if you're just looking for an answer, it's 'No, you shouldn't do
this.'.

Undefined behavior
------------------

A number of people (most famously [ElasticSearch][2]) have gotten this wrong,
but why? I think it's because of this sentence in the [HTTP Spec][3]:

> A payload within a GET request message has no defined semantics

That sentence could easily suggest that there's no specific behavior associated
to request bodies with `GET` requests, and that the behavior is left up to the
implementor.

The reality is that this is more like [Undefined behavior][4] from languages
like C/C++. My understanding is that leaving certain aspects of the language
undefined (instead of for example requiring an error to be thrown) leaves room for
compiler implementations to make certain optimizations. Some compilers also
have fun with this; GCC [starts a video game][5] in a specific case
of undefined behavior.

If you were to write a C program that relies on how a compiler dealt with
specific undefined behavior, it means your program is no longer a portable
C program, but it's written in variant of C that only works on some compilers.

The same applies for HTTP as well. It's true that undefined behavior means
that *you* as a server developer can define it, but you are not an island!

When working with HTTP, there's servers but also load balancers, proxies,
browsers and other clients that all need to work together. The behavior isn't
just undefined server-side, a load balancer might choose to silently drop
bodies or throw errors. There's many real-world examples of this. `fetch()`
for example will throw an error.

This hasn't stopped people from doing this anyway. OpenAPI [removed][11]
support for describing `GET` request bodies in version 3.0 (and `DELETE`,
which has the same issue!), but was quitely [added back in 3.1][12] to not
prevent people from documenting their arguably broken APIs.

Why it's not defined
--------------------

The best source I have is this quote from Roy Fielding in 2007. Roy is one
of the main authors of the HTTP/1.1 rfcs, and also invented REST.

> Yes. In other words, any HTTP request message is allowed to contain a message body, and thus must parse messages with that in mind. Server semantics for GET, however, are restricted such that a body, if any, has no semantic meaning to the request. The requirements on parsing are separate from the requirements on method semantics.
>  So, yes, you can send a body with GET, and no, it is never useful to do so.
> This is part of the layered design of HTTP/1.1 that will become clear again once the spec is partitioned (work in progress).
>
> ....Roy

(<small>His message was originally sent to the now-dead rest-discuss
group on Yahoo Groups, but I found an [archive in JSON format][6]</small>)

However, I always found this answer unsatisfying. I understand that you might
want a lower-layer protocol design that just deals with methods, bodies and
headers and not concern itself with method-specific behavior.

This design goal doesn't preclude `GET` from specifically rejecting request
bodies though, and it also doesn't preclude the spec from mentioning that
request bodies should not be emitted.

So, unless there's a different reason for this I'm going to have to assume
that this was well-intentioned but just not written clearly enough.

Despite this explanation from one of the authors of the HTTP spec itself,
I noticed some people will still claim a different interpretation, making
a sort of a ['death of the author'][8] argument. It's a bit funny to think
about 'death of the author' in technical specs, but I think they have a
point. I believe that the definition of a 'standard' such as HTTP is not
the written RFC, it's how everyone actually implements it.

The goal of the spec is to accurately describe the standard, not to define
it. If what everyone is doing is different from the author's intention,
the spec has failed to accurately describe the standard, not vice versa.

The HTTP believes this too, which is why we've seen new releases of `HTTP/1.1`,
without increasing the version. In each iteration major steps are taken
to capture real-world usage, sometimes even in conflict with the original
RFC2616.

However, in this case it's irrelevant. Many popular HTTP implementations
will throw errors when seeing `GET` bodies, such as `fetch()`. Using `GET`
bodies will give you such poor interopability that it's worth continuing to
not do this.

In 2019 I've [opened a ticket][7] to request to fix this in the next
HTTP spec which was taken seriously and now the upcoming HTTP/1.1 is
going to include the following text:

> Although request message framing is independent of the method used,
> content received in a GET request has no generally defined semantics,
> cannot alter the meaning or target of the request, and might lead
> some implementations to reject the request and close the connection
> because of its potential as a request smuggling attack (Section 11.2
> of [HTTP/1.1]).>A client SHOULD NOT generate content in a GET
> request unless it is made directly to an origin server that has
> previously indicated, in or out of band, that such a request has a
> purpose and will be adequately supported.>An origin server SHOULD
> NOT rely on private agreements to receive content, since participants
> in HTTP communication are often unaware of intermediaries along the
> request chain.

[Source][9].

Why should `GET` have a body?
-----------------------------

I think we feel this way, because we've been told over and over again that
it's a good idea to use protocols in a 'semantically correct' way.

But why should be care about semantics? 2 reasons:

1. If you do things in a semantically correct way, other systems can make
   assumptions about how it should behave. For example: A `PUT` request
   may be automatically repeated if it failed the first time due to a network
   failure or 5xx error. A `GET` request may be cached if it contained a
   `Cache-Control` header.
2. It's self-documenting behavior. If you see a `GET` request it tells a
   developer something is being retrieved.

So it makes sense to want to use `GET` for something like a complex search.
Unfortunately if we can't put the search in the body, our only options
are headers and the URL. There's a number of issues with this: Encoding UTF-8
is unclear, no real support for documents/mine-types, length limitations.
It's a bit of a mess!

Why doesn't it support bodies?
------------------------------

Most developers working with HTTP and learning about it is in the context
of APIs, but this is not the original use-case.

HTTP and HTML used to be inseperable. The world wide web was mainly a
distributed hypertext document system, where every document has a global
unique identifier called a URL.

To retrieve a hypertext document, you would do a `GET` on this url, to
replace or create the document a `PUT` and to remove the document `DELETE`.
(<small>Note that it took longer to get a writable web, but I wanted to
illustrate what I think the intended design is without being encumbered
by facts</small>).

Taken from this perspective, the idea of 'parameters' makes less sense.
`GET` doesn't just mean "Do a [safe][9] request and read something from the
server", it means: 'Give me the document with this name'.

This specific feature is in part why the web was so successful. Given that
the URL comprehensively describes to a client exactly how to connect to
a server and retrieve a document, it made the `<a>` HTML work. It also let
people make bookmarks, share links via email/chat and paint it on
store-fronts.

The URL is the web's superstar and killer feature. HTTP just let you find
documents associated with the URL. [HTTP/0.9 didn't even have headers and
can be read during a bathroom break][13].


Our needs have evolved, why hasn't HTTP?
----------------------------------------

I still maintain that even if you're building a REST api, it's good to think
of your endpoints as documents, and the `GET`, `PUT` and `DELETE` as the most
important HTTP methods to manipulate these, using the URL as the primary key.

But, sometimes we need to do something more complicated and it would be nice
if HTTP had a prescribed way to handle cases where we want to describe a
search query as a document.

The answer traditionally was to just use `POST`. `POST` is kind of your
no-guarantees catch all method. Often also used to tunnel other protocols
that don't really speak HTTP well, such as SOAP, XMLRPC and more recently
GraphQL.

But there's a new condenter. Now I think your best option is [`QUERY`][10].
This is a new method, that's not quite standard yet but any compliant HTTP
client and server should already support it. The goal of `QUERY` is
specifically for this use-case.

`QUERY` solves the following problems:

1. It's basically a 'safe' `POST`. This means the implication is that it's
   for reading and safe to repeat.
2. It also is self-descriptive. It tells a developer that this is a API
   that's focused on reading.
3. The spec also makes it cachable.

I think you should still continue the use `GET` for the majority of cases,
but there's a clear answer now for what to do when that doesn't fit.

Anyway...
---------

That's a lot of writing for what seemingly is a simple question. It's just
one of those things that's been bouncing around my head for a bit too long.

I hope it's out of my system!

Wanna discuss?
--------------

Hit me up on [Twitter](https://twitter.com/evertp) or use chat on
[Github Discussions](https://github.com/evert/evert.github.com/discussions/42).

[1]: https://stackoverflow.com/questions/978061/http-get-with-request-body
[2]: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html#search-search-api-desc
[3]: https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1
[4]: https://en.wikipedia.org/wiki/Undefined_behavior
[5]: https://feross.org/gcc-ownage/
[6]: https://github.com/jam01/rest-discuss-archive/blob/262d6768f83cdf811c2a997564105fc74bad8987/rest-discuss/9962.json
[7]: https://github.com/httpwg/http-core/issues/202 
[8]: https://en.wikipedia.org/wiki/The_Death_of_the_Author
[9]: https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-semantics#section-9.3.1
[10]: https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-safe-method-w-body-02
[11]: https://swagger.io/docs/specification/describing-request-body/
[12]: https://github.com/OAI/OpenAPI-Specification/pull/2117 
[13]: https://www.w3.org/Protocols/HTTP/AsImplemented.html
