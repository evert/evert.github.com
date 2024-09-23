---
title: "Discovering features and information via HTTP OPTIONS"
date: "2024-09-23 02:44:00 UTC"
geo: [43.663961, -79.333157]
location: "Leslieville, Toronto, ON, Canada"
draft: true
tags:
  - rest
  - options
  - http
  - accept
  - content-negotiation
---

Say you have an API, and you want to communicate what sort of things a user can
do on a specific endpoint. You can use external description formats, but
sometimes it's nice to also communicate this on the API itself.

[`OPTIONS`][1] is the method used for that. You may know this HTTP method from
[CORS][2], but it's general purpose is for clients to passively find out 'What
can I do here?'.

A basic `OPTIONS` response might might look like this:

```http
HTTP/1.1 204 No Content
Date: Mon, 23 Sep 2024 02:57:38 GMT
Server: KKachel/1.2
Allow: GET, PUT, POST, DELETE, OPTIONS
```

Based on the [`Allow`][3] header you can quickly tell which HTTP methods
are available at a given endpoint. Many web frameworks emit this automatically
and generate the list of methods dynamically per route, so chances are that you
get this one for free.

To find out if your server does, try running the command below (with your
URL!):

    curl -X OPTIONS http://localhost:3000/some/

## Accept and Accept-Encoding

There's a number of other standard headers servers can use. Here's an
example showing a whole bunch at once:

```http
HTTP/1.1 204 No Content
Date: Mon, 23 Sep 2024 02:57:38 GMT
Server: KKachel/1.2
Allow: GET, PUT, POST, DELETE, OPTIONS
Accept: application/vnd.my-company-api+json, application/json, text/html
Accept-Encoding: gzip,brotli,identity
```

You may already be familiar with [`Accept`][4] and [`Accept-Encoding`][5] from
HTTP requests, but they can also appear in responses. `Accept` in a response
lets you tell the client which kind of mimetypes are available at an endpoint.
I like adding `text/html` to every JSON api endpoint and making sure that
API urls can be opened in browsers and shared between devs for easy debugging.

The `Accept-Encoding` lets a client know in this case that they can compress
their request bodies with either `gzip` or `brotli` (`identity` means no
compression).

## Patching, posting and querying

3 other headers that can be used are [`Accept-Patch`][6], [`Accept-Post`][7]
and [`Accept-Query`][8]. These three headers are used to tell a client what
content-types are available for the [`PATCH`][9], [`POST`][10] and
[`QUERY`][11] http methods respectively.

For all of these headers, their values effectively dictate what valid
values are for the `Content-Type` header when making the request.

```http
HTTP/1.1 204 No Content
Date: Mon, 23 Sep 2024 02:57:38 GMT
Server: KKachel/1.2
Allow: OPTIONS, QUERY, POST, PATCH
Accept-Patch: application/json-patch+json, application/merge-patch+json
Accept-Query: application/graphql
Accept-Post: multipart/form-data, application/vnd.custom.rpc+json
```

In the above response, the server indicates it supports both [JSON Patch][12]
and [JSON Merge Patch][13] content-types in `PATCH` requests. It also suggests
that GraphQL can be used via the `QUERY` method, and for `POST` it supports
both standard file uploads and some custom JSON-based format.

Typically you wouldn't find all of these at the same endpoint, but I wanted
to show a few examples together.


## Where's PUT?

Oddly, there's no specific header for `PUT` requests. Arguably you could say
that `GET` and `PUT` are symmetrical, so perhaps the `Accept` header kind of
extends to both. But the spec is not clear on this.

I think the actual reality is that `Accept-Patch` was the first header in
this category that really clearly defined this as a means of feature discovery
on `OPTIONS`. `Accept-Post` and `Accept-Query` followed suit. I think
`Accept-Patch` in `OPTIONS` was modelled after in-the-wild usage of `Accept`
in `OPTIONS`, even though the HTTP specific doesn't super clearly define this.

If I'm wrong with my interpretation here, I would love to know!

<small>
Also if you're wondering about `DELETE`, `DELETE` should never have a body.
If this is new to you to, [read my other article][18] about `GET` request
bodies. Most of the information there is applicable to `DELETE` as well.
</small>

## Linking to documentation

The `OPTIONS` response is also a great place to tell users where to find
additional documentation. In the below example, I included both a
machine-readable link to a documentation site, a link to an OpenAPI definition,
and a message intended for humans in the response body:

```http
HTTP/1.1 200 OK
Date: Mon, 23 Sep 2024 04:45:38 GMT
Allow: GET, QUERY, OPTIONS
Link: <https://docs.example.org/api/some-endpoint>; rel="service-doc"
Link: <https://api.example.org/openapi.yml>; rel="service-desc" type="application/openapi+yaml"
Content-Type: text/plain

Hey there!

Thanks for checking out this API. You can find the docs for this
specific endpoint at: https://docs.example.org/api/some-endpoint

Cheers,
The dev team
```

I recommend keeping the response body as mostly informal and minimal
any real information should probably just live on its own URL and be linked to.

I used the [`service-doc`][14] and [`service-desc`][17] link relationships here,
but you can of course use any of the [IANA link relationship types][15] here
or a custom one. Also see the [Web linking][16] spec for more info.

## Obscure uses

### WebDAV usage

WebDAV, CalDAV and CardDAV also use OPTIONS for feature discovery. For example:

```http
HTTP/1.1 204 No Content
Date: Mon, 23 Sep 2024 05:01:50 GMT
Allow: GET, PROPFIND, ACL, PROPPATCH, MKCOL, LOCK, UNLOCK
DAV: 1, 2, 3, access-control, addressbook, calendar-access
```

### The server-wide request

Normally HTTP requests are made to a path on the server, and the first line
looks a bit like the following in HTTP/1.1:

```http
GET /path HTTP/1.1
```

But, there are a few other "request line" formats that are rarely used. One of
them lets you discover features available on an entire server, using the
asterisk:

```http
OPTIONS * HTTP/1.1
```

The asterisk here is not a path. Normally asterisks aren't even allowed in
URIs. Many HTTP clients (including `fetch()`) don't even support this request.

Classic webservers like Apache and Nginx should support this. To try it out,
use CURL

```sh
curl -vX OPTIONS --request-target '*' http://example.org
```

## Final notes

If you have a reason to allow clients to discover features on an endpoint,
consider using `OPTIONS` instead of a proprietary approach! As you can
see in many of these examples, it's especially useful if you use [mimetypes][17]
well.

Do you have questions, other novel uses of `OPTIONS` or other ideas around
feature discovery.

[1]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
[2]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[3]: https://www.rfc-editor.org/rfc/rfc9110.html#field.allow "Allow header"
[4]: https://www.rfc-editor.org/rfc/rfc9110.html#name-accept "Accept header"
[5]: https://www.rfc-editor.org/rfc/rfc9110.html#name-accept-encoding "Accept-Encoding header"
[6]: https://www.rfc-editor.org/rfc/rfc5789#section-3.1 "Accept-Patch header"
[7]: https://www.w3.org/TR/ldp/#header-accept-post "Accept-Post header" 
[8]: https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-safe-method-w-body-05#name-the-accept-query-header-fie "Accept-Query header"
[9]: https://www.rfc-editor.org/rfc/rfc5789#section-2 "PATCH method"
[10]: https://www.rfc-editor.org/rfc/rfc9110.html#name-post "POST method"
[11]: https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-safe-method-w-body-05#name-query "QUERY method"
[12]: https://datatracker.ietf.org/doc/html/rfc6902 "JSON Patch"
[13]: https://datatracker.ietf.org/doc/html/rfc7386 "JSON Merge Patch"
[14]: https://www.rfc-editor.org/rfc/rfc8631.html#section-4.1 "service-doc link relationship"
[15]: https://www.iana.org/assignments/link-relations/link-relations.xhtml "IANA link relations registry"
[16]: https://datatracker.ietf.org/doc/html/rfc8288 "Web Linking"
[17]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types "Mime types"
[18]: https://www.rfc-editor.org/rfc/rfc8631.html#section-4.2 "service-desc link relationship"
