---
title: "An OAuth2 middleware for fetch()"
date: "2019-03-14 15:37:29 UTC"
tags:
  - fetch
  - typescript
  - javascript
  - opensource
  - oauth2
  - middleware
location: DiiD office, Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---

I was a bit frustrated with the existing offerings for OAuth2 clients in
Javascript. I heavily use the [Fetch API][2] directly, but Web API's haven't
really caught up to have deep integration with OAuth2.

We were using [client-oauth2][3], but the minified size of this library was
close to 40kb which ended up being a majority of the size of our total
Javascript code.

I realized what I really wanted was an OAuth2 client that acts as a
middleware-style layer for Fetch, making OAuth2 refreshes transparent, and is
a lot lighter in weight.

It only took 2 days to write a replacement that is good enough for my use-case,
and I made it open source. It's currently 3692 bytes minified, is written for
typescript and has 0 dependencies.

Find it on [Github][1]. The library handles the 'token' part of OAuth2 flow,
including:

* `authorization_code`, `password` and `client_credentials` grant types.
* It keeps an eye on access token expiry, and will automatically call
  `refresh_token` if they expired.
* It exposes a simple hook that gets called when tokens get updated, allowing
  you to store the new tokens somewhere else (like LocalStorage).

It doesn't however handle the 'authorization' part of OAuth2. Which means that
if you use the `implicit` or `authorization_code` flow, you are responsible
for redirecting the user, and when the user returns setting up the OAuth2
with the right `code` or `accessToken` value.

Example
-------

If you're using the `password` grant type:

```javascript
const OAuth2 = require('fetch-mw-oauth2');

const oauth2 = new OAuth2({
  grantType: 'password',
  clientId: '...',
  clientSecret: '...',
  userName: '...',
  password: '...',
  tokenEndPoint: 'https://auth.example.org/token',
});
```

After this setup is complete, and now you can use the `fetch` functon on the
`oauth2` object, instead of the global one. It takes exactly the same
parameters, as it just forwards the function with the correct `Authorization`
header:

```javascript
const result = await oauth2.fetch('https://api.example.org/article', {
   method: 'POST',
   body: '...',
 });
```

I hope this is useful to anyone else. Take a look at [the project][1] for more
info!

[1]: https://github.com/evert/fetch-mw-oauth2/
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[3]: https://www.npmjs.com/package/client-oauth2
