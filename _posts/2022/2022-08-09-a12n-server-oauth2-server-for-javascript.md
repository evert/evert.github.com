---
title: "a12n-server, a lightweight OAuth2 server."
date: "2022-08-09 21:35:00 UTC"
geo: [44.393052, -79.532495]
location: "East York, ON, Canada"
draft: true
tags:
  - oauth2
  - fetch
  - javascript
  - opensource
  - bearer
  - rfc6749
---

In mid 2018, I just quit a bad job and slowly started getting interested in
building things again.

I started working on an application, and needed an OAuth2 server. I was looking
for a lightweight open source OAuth2 server library for Node. There were some
alternatives available, but they were either very bulky, didn't use Typescript
or didn't feel like they had the right abstractions or polish. A side-quest
was born!

Building my own server let me get a better grasp on Typescript itself, test
some other ideas I was playing with and I wanted to get to a point where I
could say I *fully* grasp OAuth2.

It was pretty simple, a headless OAuth2 server with some database tables for
access tokens, clients and users.

Fast forward 4 years, and this project has slowly grown from a hobby
side-project to what I believe should be a strong contendor for devs looking
to *not* build registration, login but want to keep this on-premise.

The project is called [a12n-server][7], and has the following features:

* Login, registration, Lost password.
* Runs on MySQL, PostgreSQL and Sqlite.
* An access control model.
* A browsable REST api, using HAL, HAL-Forms and HTML.
* A simple admin interface.
* OAuth2
  * Supported grants: `client_credentials`, `authorization_code` and `password`.
  * [OAuth2 discovery document][1].
  * [PKCE][3].
  * [OAuth 2 Token Introspection][2].
  * [JSON Web Key Sets][4].
  * [OAuth2 Token Revocation][5]
* MFA
  * Google Authenticator (TOTP).
  * WebauthN / Yubikeys
* A simple, flat, permission model.
* [`secret-token:` URI scheme][6].


Demo
----

If you want to try it out, run the following:

```sh
mkdir a12n-server
cd a12n-server
npx @curveball/a12n-server
```

This creates a sqlite and .env in your current directory and starts the server.
You can browse around `http://localhost:8531`, but data persists so this
doubles as a dev environment.


Screenshots
-----------


<figure>
  <img class="fill-width" src="/assets/posts/a12n/admin.png" alt="The admin account creation form" />
  <figcaption>Creating the first account</figcaption>
</figure>

<figure>
  <img class="fill-width" src="/assets/posts/a12n/totp.png" alt="Setting up TOTP" />
  <figcaption>Setting up TOTP</figcaption>
</figure>

<figure>
  <img class="fill-width" src="/assets/posts/a12n/home.png" alt="The a12n-server home screen" />
  <figcaption>The a12n-server home screen</figcaption>
</figure>


Next steps
----------

If you're checking a12n-server, I would love to hear if it works for you, but
especially if it doesn't. Where did you get stuck?

The project also desperately needs a new name and look, but hopefully I'll have
some updates in the next few months.

<https://github.com/curveball/a12n-server>


[1]: https://tools.ietf.org/html/rfc8414 "OAuth 2.0 Authorization Server Metadata"
[2]: https://tools.ietf.org/html/rfc7662 "OAuth 2 Token Introspection"
[3]: https://tools.ietf.org/html/rfc7636 "Proof Key for Code Exchange by OAuth Public Clients"
[4]: https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets
[5]: https://datatracker.ietf.org/doc/html/rfc7009
[6]: https://datatracker.ietf.org/doc/html/rfc8959
[7]: https://github.com/curveball/a12n-server
