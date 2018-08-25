---
date: "2018-08-28 08:00:00 -0700"
title: "208 Already Reported"
permalink: /http/208-already-reported
location: "San Francisco, US"
tags:
   - http
   - http-series
---

[`208 Already Reported`][1] is, like [`207 Multi-Status`][2] a HTTP status
code specific to WebDAV. It's even more obscure, because it's defined in a
rarely used [extension of WebDAV][1].

The extension adds 'Binding' extensions to WebDAV. WebDAV is a bit like a
filesystem over HTTP, and the Binding extensions add support for a feature
similar to [Hard links][4] to this filesystem.

When a client asks information about resources (files/directories), due to
the bindings it becomes possible that a response lists the same file/directory
twice, because 2 things can link to the same underlying resource. This means
that duplicated data is sent over the wire, which is wasteful.

Another issue is that a Directory (or Collection in WebDAV terminology) might
contain a resource that loops back on itself. If a recursive query is used,
this can cause an infinite loop.

The `208 Already Reported` allows a client to tell the server that the same
resource (with the same binding) was mentioned earlier. This solves both those
problems.

The `208` status never appears as a true HTTP response code in the status
line, and only appears in bodies.

Example from the specification:

```http
HTTP/1.1 207 Multi-Status
Content-Type: application/xml; charset="utf-8"
Content-Length: 1241

<?xml version="1.0" encoding="utf-8" ?>
<D:multistatus xmlns:D="DAV:">
  <D:response>
    <D:href>http://www.example.com/Coll/</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>Loop Demo</D:displayname>
        <D:resource-id>
          <D:href>urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf8</D:href>
        </D:resource-id>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>
  <D:response>
    <D:href>http://www.example.com/Coll/Foo</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>Bird Inventory</D:displayname>
        <D:resource-id>
          <D:href>urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf9</D:href>
        </D:resource-id>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>
  <D:response>
    <D:href>http://www.example.com/Coll/Bar</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>Loop Demo</D:displayname>
        <D:resource-id>
          <D:href>urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf8</D:href>
        </D:resource-id>
      </D:prop>
      <D:status>HTTP/1.1 208 Already Reported</D:status>
    </D:propstat>
  </D:response>
</D:multistatus>
```

I don't think it makes sense to use `208 Already Reported` for a true HTTP
response. I would not recommend using it.

References
----------

* [RFC5842, Section 7.1][1] - 208 Already Reported
* [207 Multi-Status][2]

[1]: https://tools.ietf.org/html/rfc5842#section-7.1
[2]: /http/207-multi-status
[3]: https://tools.ietf.org/html/rfc5842
[4]: https://en.wikipedia.org/wiki/Hard_link
