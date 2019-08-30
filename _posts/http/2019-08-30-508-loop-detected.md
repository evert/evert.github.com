---
date: "2019-08-30 18:30:00 UTC"
title: "508 Loop Detected"
permalink: /http/508-loop-detected
tags:
   - http
   - http-series
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

[`508 Loop Detected`][1] is a status code that's introduced by an 
[extension of the WebDAV specification][2].

The specific extension adds support for a 'Binding' feature. WebDAV itself
is a bit like a filesystem protocol over HTTP, and the Binding extension
adds support for a 'hardlink'-like feature via the `BIND` and `UNBIND`
methods.

WebDAV has a few features that allows a client to get information from
a server and ask for an entire directory tree. The binding extension makes
it possible to make a link from 1 resource, and create the target somewhere
in it's own tree.

This makes it hypothetically possible to create a directory structure that's
'infinitely deep', because it always keeps looping back into itself.

When this happens, a server can respond with `508 Loop Detected` to tell a
client it's not possible to return a result of infinite size.

It's extremely rate to run into it, as there's few WebDAV servers that
implement support for it.

```http
HTTP/1.1 508 Loop Detected 
Content-Type: text/plain

There was a loop detected in the directory tree, which means that we're not
able to return a full directory tree.
```

Should I use this?
------------------

Maybe. Even though this is a WebDAV feature, other types of APIs might have
support for a feature that allows recursively linking structures. If such an
API also has a feature to flatten and return entire trees, this status code
could be appropriate and doesn't hurt.

Although, the choice of the 5xx status code is a little odd. If a system allows
recurively linking structures, and the user requested this, it's really the
client that's at fault.


References
----------

* [RFC5842, Section 7.2][1] - 508 Loop Detected. 

[1]: https://tools.ietf.org/html/rfc5842#section-7.2
[2]: https://tools.ietf.org/html/rfc5842 "Binding Extensions to Web Distributed Authoring and Versioning (WebDAV)"
