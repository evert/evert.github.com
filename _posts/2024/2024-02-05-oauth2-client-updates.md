---
title: OAuth2 client updates 
date: "2024-02-05 15:00:00 UTC"
geo: [43.663961, -79.333157]
location: "Leslieville, Toronto, ON, Canada"
tags:
  - oauth2
  - open source
---

I just released v2.3.0 of [`@badgateway/oauth2-client`][1], which I wrote
because there weren't any lean, 0-dependency oauth2 clients with modern
features such as [PKCE][2].

This new version includes support for:

* Resource Indicators for OAuth 2.0 ([RFC8707][5]).
* OAuth2 Token Revocation ([RFC7009][6]).

Hope you like it!


[1]: https://www.npmjs.com/package/@badgateway/oauth2-client
[2]: https://datatracker.ietf.org/doc/html/rfc7636
[5]: https://datatracker.ietf.org/doc/html/rfc8707 "https://datatracker.ietf.org/doc/html/rfc8707"
[6]: https://datatracker.ietf.org/doc/html/rfc7009 "OAuth 2.0 Token Revocation"
