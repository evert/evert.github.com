---
title: "Authentication relation types"
date: "2019-10-02 20:36:00 UTC"
tags:
  - rest
  - hypermedia
  - links
  - authentication
  - oauth2
  - ietf
geo: [43.660773, -79.429926]
location: "Bloor St W, Toronto, Canada"
---

When you're building Hypermedia-style services, you might have used the
[IANA link relation types][1] list to find appropriate, generic keywords
for your `rel=""` attributes.

This list is the official registry for relation types such as `collection`,
`next`, `canonical` and others.

I had a need for adding a few generic relationship types for a generic
hypermedia client, so I wrote a IETF draft to define them and get them
added to this list.

The new relationship types I'm hoping to define are:

* `authenticate` - To find an endpoint where a client might authenticate, such
  as an OAuth2 login screen.
* `authenticated-as` - To find a resource associated with the user who is
  currently logged in. This is a sort of 'who am I' feature.
* `logout` - A link that can be followed to expire existing sessions.
* `register-user` - Which might be used to find for example a login form, or
  and API endpoint where new users can be created.

The full document can be read here: <https://tools.ietf.org/html/draft-pot-authentication-link-01>

If you think this is an interesting spec, or if you've already adopted this
or something similar, your feedback on the IETF Art list would be very
appreciated:

* [Thread][2].
* [List information][3].

You can also leave feedback, questions or suggestions on the [Github
project][4].

[1]: https://www.iana.org/assignments/link-relations/link-relations.xhtml
[2]: https://mailarchive.ietf.org/arch/msg/art/-A8FxwXNVhWr8MkhkI-sF-2AgJY
[3]: https://www.ietf.org/mailman/listinfo/art
[4]: https://github.com/evert/authentication-rels
