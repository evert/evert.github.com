---
title: "A new OAuth2 client for Javascript"
date: "2022-06-20 19:40:00 UTC"
geo: [45.686510, -79.328419]
location: "East York, ON, Canada"
tags:
  - oauth2
  - fetch
  - javascript
  - opensource
  - bearer
  - rfc6749
---

Frustrated with the lack of well maintained, minimal OAuth2 libraries, I [wrote
my own][5]. This new OAuth2 library is only **3KB** gzipped, mainly because it
has **0** dependencies and relies on modern APIs like `fetch()` and
[Web Crypto][4] which are built in Node 18 (but it works with Polyfills on
Node 14 and 16). 

It has support for key features such as:

* `authorization_code` with [PKCE][1] support.
* `password` and `client_credentials` grants.
* a `fetch()` wrapper that automatically adds Bearer tokens and refreshes them.
* OAuth2 endpoint discovery via the Server metadata document ([RFC8414][2]).
* OAuth2 Token Introspection ([RFC7662][3]).

If your server does support the meta-data document, here's how simple the
process can be:

## client_credentials example

```typescript
const { OAuth2Client } from '@badgateway/oauth2';

const client = new Client({
  clientId: '..',
  clientSecret: '..',
  server: 'https://my-auth-server.example'
});

const tokens = await client.clientCredentials();
```

Without the meta-data document, you will need to specify settings such as the
`tokenEndpoint` and possibly the `authorizationEndpoint` depending on which
flow you are using.


## authorization_code example

The `authorization_code` flow is a multi-step process, so a bit more involved.
The library gives you direct access to the primitives, allowing you to
integrate in your own frameworks and applications.

```typescript
import { OAuth2Client, generateCodeVerifier } from 'client';

const client = new OAuth2Client({
  server: 'https://authserver.example/',
  clientId: '...',
});

// Part of PCKE
const codeVerifier = await generateCodeVerifier():

// In a browser this might work as follows:
document.location = await authorizationCode.authorizationCode.getAuthorizeUri({
  redirectUri: 'https://my-app.example/',
  state: 'some-string',
  codeVerifier,
  scope: ['scope1', 'scope2'],
});
```

### Handling the redirect back

```typescript
const oauth2Token = await client.authorizationCode.getTokenFromCodeRedirect(
  document.location,
  {
    redirectUri: 'https://my-app.example/',
    state: 'some-string',
    codeVerifier,
  }
);

const oauth2Token = await authorizationCode.getToken(codeResponse);
```

## Docs and download

* [Github][5]
* [npmjs][6]

[1]: https://datatracker.ietf.org/doc/html/rfc7636 "Proof Key for Code Exchange by OAuth Public Clients"
[2]: https://datatracker.ietf.org/doc/html/rfc8414 "OAuth 2.0 Authorization Server Metadata"
[3]: https://datatracker.ietf.org/doc/html/rfc7662 "OAuth 2.0 Token Introspection"
[4]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API "Web Crypto API"
[5]: https://github.com/badgateway/oauth2-client "OAuth2 Client on github"
[6]: https://www.npmjs.com/package/@badgateway/oauth2-client "OAuth2 Client on npmjs.org"
