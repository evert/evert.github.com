---
title: "Does OAuth2 have a usability problem? (yes!)"
date: "2023-04-27 02:18:00 UTC"
geo: [43.64793345752491, -79.42044389030917]
location: "Bad Gateway Office"
tags:
  - oauth2
  - opensource
  - javascript
  - typescript
---

I read an [interesting thread][7] on Hackernews in response to a post:
"Why is OAuth still hard in 2023". The post and comments bring up a lot
of real issues with OAuth. The article ends with a pitch to
use the author's product [Nango][8] that advertises support
for supporting OAuth2 flows for 90+ APIs and justifying the existence
of the product.

We don't need 90 browsers to open 90 websites, so why
is this the case with OAuth2? In a similar vain, the popular [passport.js][10]
project has 538(!) modules for authenticating with various services,
most of which likely use OAuth2. All of these are NPM packages.

Anyway, I've been wanting to write this article for a while. It's not
a direct response to the Nango article, but it's a similar take with
a different solution.

My perspective
-------------

I've been working on an [OAuth2 server][11] for a few years now, and last
year I released an open source [OAuth2 client][1].

Since I released the client, I've gotten several new features and requests
that were all contributed by users of the library, a few of note are:

* Allowing `client_id` and `client_secret` to be sent in request bodies
  instead of the `Authorization` header.
* Allow 'extra parameters' to be sent with some OAuth2 flows. Many servers,
  including Auth0 require these.
* Allow users to add their own HTTP headers, for the same reason.

What these have in common is that there's a lot of different OAuth2 servers
that want things in a slightly different/specific way.

I kind of expected this. It wasn't going to be enough to just implement
OAuth2. This library will only work once people start trying it with different
servers and run into mild incompatibilities that this library will have to
add workarounds for.

Although I think OAuth2 is pretty well defined, the full breadth of specs and
implementations makes it so that it's not enough to (as an API developer) to just
tell your users: "We use OAuth2".

For the typical case, you might have to tell them something like this:

* We use OAuth2.
* We use the `authorization_code` flow.
* Your `client_id` is X.
* Our 'token endpoint' is Y.
* Our 'authorization endpoint' is Z.
* We require PKCE.
* Requests to the "token" endpoint require credentials to be sent in a body.
* Any custom non-standard extensions.

To some extent this is by design. The OAuth2 spec calls itself: "The OAuth 2.0
Authorization Framework". It's not saying it is _the_ protocol, but rather it's
a set of really good building blocks to implement your own authentication.

But for users that want to use generic OAuth2 tooling this is not ideal.
Not only because of the amount of information that needs to be shared, but also
it requires users of your API to be familiar with all these terms.

A side-effect of this is that API vendors that use OAuth2 will be more likely
roll their own SDKs, so they can insulate users from these implementation details.
It also creates a market for products like Nango and Passport.js.

Another result is that I see *many* people invent their own authentication flows
with JWT and refresh tokens from scratch, even though OAuth2 would be good fit.
Most people only need a small part of OAuth2, but to understand *which* small
part you need you'll need to wade through and understand a dozen IETF RFC
documents, some of wich are still drafts.

_Sidenote: [OpenID Connect][12] is another dimension on top of this. OpenID Connect builds on
OAuth2 and adds many features and another set of dense technical specs that are
(in my opinion) even harder to read._

OAuth2 as a framework is really good and very successful. But it's not as good
at being a generic protocol that people can write generic code for.

Solving the setup issue
-----------------------

There's a nice OAuth2 feature called "OAuth 2.0 Authorization Server Metadata",
defined in [RFC8414][4]. This is a JSON document sitting at a predictable URL:
`https://your-server/.well-known/oauth-authorization-server`, and can tell
clients:

* Which flows and features are supported
* How to pass credentials
* URLs to every endpoint.

Here's an example from my server:

```json
{

    "issuer": "http://localhost:8531",
    "authorization_endpoint": "/authorize",
    "token_endpoint": "/token",
    "token_endpoint_auth_methods_supported": [
        "client_secret_basic"
    ],
    "token_endpoint_auth_signing_alg_values_supported": [
        "RS256"
    ],
    "jwks_uri": "http://localhost:8531/.well-known/jwks.json",
    "scopes_supported": [
        "openid"
    ],
    "response_types_supported": [
        "token",
        "code",
        "code id_token"
    ],
    "grant_types_supported": [
        "client_credentials",
        "authorization_code",
        "refresh_token"
    ],
    "id_token_signing_alg_values_supported": [
        "RS256"
    ],
    "service_documentation": "http://localhost:8531",
    "ui_locales_supported": [
        "en"
    ],
    "introspection_endpoint": "/introspect",
    "revocation_endpoint": "/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic"
    ]

}
```

If your server and client supports this, it can simplify the setup a great
deal. Here's an example using my client:


```typescript
import { OAuth2Client } from '@badgateway/oauth2-client';

const client = new OAuth2Client({
  server: 'https://my-auth-server/',
  clientId: 'my-client-id'
});
```

The problem is majority of OAuth2 servers and clients don't support this,
so even if your server did, your setup instructions would still need to
include all the 'setup info' for clients that don't support the discovery
document.

And for the clients that _do_ support it, you would need to call out that
your users' client needs support for RFC8414.

So while I think the discovery spec is great and solves real problems;
it alone cannot solve the OAuth2 usability problem.

My proposal
-----------

Currently work is underway to define [OAuth 2.1][6]. OAuth 2.1 will remove
features that are considered insecure or bad practices (such as `implicit`
and `password` flows) and PKCE is brought in as a core feature.

If you're a OAuth 2 client or server maintainer and kept up with the specs,
you likely are already compatible with OAuth 2.1.

I don't think OAuth 2.1 goes far enough.

I think that this proposal should _require_ support for the discovery document
and make it a required step to find features and endpoints. I also think
it should have an opinion on how clients should support custom extensions and
how they might work. (or forbid them).

This version of OAuth should also provide a way to discover the discovery
endpoint (hear me out).

If a client makes a HTTP request to an API, and the API replies with `401`, it
should tell the client where to find the discovery document and which
flow(s) to use.

Lastly, I think that it should be renamed to OAuth 3, so API vendors no longer
have to state:

* We use OAuth 2.
* We use the `authorization_code` flow.
* Your `client_id` is X.
* Our 'token endpoint' is Y.
* Our 'authorization endpoint' is Z.
* We require PKCE.
* Requests to the "token" endpoint require credentials to be sent in a body.
* Any custom non-standard extensions.

But instead:

* We use OAuth 3.
* Your `client_id` is X.

A nice aspect of this proposal is that OAuth 2 clients can still talk to
OAuth 3 servers, it also doesn't obsolete the OAuth 2 framework.

Perhaps you could name this "OAuth 2.1: the good parts", but I think increasing
the major version number sends a clear signal to users they should be looking
for a OAuth 3 library.

Then _maybe_, 10 years from now we no longer need 538 Passport.js modules for
538 APIs. Perhaps browsers could even facilitate authentication.

Final notes
-----------

* A future OAuth version should also explicitly allow `http://localhost` as
  a `redirect_url`. We need to be able to test.
* I'm aware that there was a OAuth 3 proposal, which is now called [XYZ (or
  maybe GNAP?)][12]. I'm not very familiar with this proposed protocol.
* [XKCD 927][14] is funny, but ultimately a conversation stopper and a bit
  cynical.


[1]: https://github.com/badgateway/oauth2-client
[2]: https://oauth.net/2/pkce/
[3]: https://www.npmjs.com/package/@badgateway/oauth2-client
[4]: https://www.rfc-editor.org/rfc/rfc8414
[6]: https://www.ietf.org/archive/id/draft-ietf-oauth-v2-1-08.html
[7]: https://news.ycombinator.com/item?id=35713518
[8]: https://www.nango.dev/
[9]: https://www.nango.dev/blog/why-is-oauth-still-hard
[10]: https://www.passportjs.org/
[11]: https://github.com/curveball/a12n-server
[12]: https://openid.net/connect/
[13]: https://oauth.xyz/
[14]: https://xkcd.com/927/
