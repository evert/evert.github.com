---
date: "2019-09-10 15:00:00 UTC"
title: "511 Network Authentication Required"
permalink: /http/511-network-authentication-required
tags:
   - http
   - http-series
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

[`511 Network Authentication Required`][1] is a status that can be used by
for example captive portals to signal to computers that they need to go
through some kind of sign-in after connecting to a WiFi network.

You might see these kind of sign-in screens when for example connecting to
the WiFi at a coffee shop.

Most operating systems and browsers detect this log in screen by making a HTTP
request to a standard url. These are some real examples:

* http://www.msftconnecttest.com/connecttest.txt
* http://connectivitycheck.gstatic.com/generate_204
* http://captive.apple.com/hotspot-detect.html
* http://detectportal.firefox.com/success.txt

Browsers and operating systems will do an HTTP request to one of those urls,
and expect a string like `success` to appear. If it doesn't appear, it means
a router might be blocking it and a pop-up will appear to log into the network.

One of the issues with this approach is that it might not be possible to for
a client to distingish a 'correct' response, vs. a HTTP response that was
intercepted by the network and a captive portal being served instead.

It is a type of man-in-the-middle attack, so returning a captive portal
interface instead of the real response might cause systems to malfunction and
caches to be primed with bad data.

The `511 Network Authentication Required` status code was invented as a
default status code for captive portals to return when intercepting a HTTP
request. This status signals that it was returned by an intermediate.

The full HTTP response should contain a link to where the user may log in.

The example given from the [RFC][2] is as follows:

```http
HTTP/1.1 511 Network Authentication Required
Content-Type: text/html

<html>
  <head>
     <title>Network Authentication Required</title>
     <meta http-equiv="refresh"
           content="0; url=https://login.example.net/">
  </head>
  <body>
     <p>You need to <a href="https://login.example.net/">
     authenticate with the local network</a> in order to gain
     access.</p>
  </body>
</html>
```

References
----------

* [RFC6585, Section 6.1][1] - 511 Network Authentication Required

[1]: https://tools.ietf.org/html/rfc6585#section-6.1 "511 Network Authentication Required"
[2]: https://tools.ietf.org/html/rfc6585 "Additional HTTP Status Codes"
