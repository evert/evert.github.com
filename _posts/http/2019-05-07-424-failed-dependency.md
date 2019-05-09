---
date: "2019-05-07 15:00:00 UTC"
title: "424 Failed Dependency"
permalink: /http/424-failed-dependency
tags:
   - http
   - http-series
geo: [40.711305, -73.941324]
location: "Maujer St, Brooklyn, NY, USA"
---

The [`424 Failed Dependency`][1] status-code does not appear in the base
HTTP specification, but is part of [WebDAV specification][4], which is an
extension to HTTP.

WebDAV has a concept of 'properties' that are associated with resources.
They are a little bit like [extended file attributes][2], which is a feature
on many modern filesystems

WebDAV uses the [`PROPPATCH`][3] HTTP method to update these. Many can be
updated in 1 single HTTP request. 

Generally HTTP requests are 'all or nothing'. In other words, they should
either completely succeed or completely fail.

WebDAV uses HTTP status codes in response bodies to indicate if a property
update was successful or not. If a `PROPPATCH` was issued, and one property
update failed (with for example `403 Forbidden`) then automatically every
other property update will also fail with `424 Failed Dependency`.

`424 Failed Dependency` will therefore never appear on a HTTP response
status line, and only ever in HTTP response bodies that have a
[`207 Multi-Status`][5] response code.

Example
-------

```http
PROPPATCH /folder HTTP/1.1
Host: www.example.org
Content-Type: application/xml

<?xml version="1.0"?>
<d:propertyupdate xmlns:d="DAV:">
 <d:set>
   <d:prop>
      <d:getcontentlength>1</d:getcontentlength>
      <d:displayname>Evert</d:displayname>
   </d:prop>
 </d:set>
</d:propertyupdate>
```

Response:

```http
HTTP/1.1 207 Multi-Status
Content-Type: application/xml
Content-Length: xxxx

<?xml version="1.0"?>
<d:multistatus xmlns:d="DAV:">
 <d:response>
   <d:href>/folders</d:href>
   <d:propstat>
     <d:prop><d:displayname/></d:prop>
     <d:status>HTTP/1.1 424 Failed Dependency</d:status>
   </d:propstat>
   <d:propstat>
     <d:prop><d:getcontentlength /></d:prop>
     <d:status>HTTP/1.1 403 Forbidden</d:status>
   </d:propstat>
 </d:response>
</d:multistatus>
```

The above response indicates that `getcontentlength` was not allowed to be
updated, and this caused the update to `displayname` to fail with `424`.

Usage on the web
----------------

This HTTP status code should probably not be used outside of WebDAV

References
----------

* [RFC4918, Section 11.4][1] - 424 Failed Dependency
* [RFC4918, Section 9.2][3] - PROPPATCH method method


[1]: https://tools.ietf.org/html/rfc4918#section-11.4 "424 Failed Dependency"
[2]: https://en.wikipedia.org/wiki/Extended_file_attributes
[3]: https://tools.ietf.org/html/rfc4918#section-9.2 "PROPPATCH method"
[4]: https://tools.ietf.org/html/rfc4918 "WebDAV specification"
[5]: /http/207-multi-status
