---
title: "Who uses HATEOAS?"
date: "2021-02-20 16:00:00 UTC"
tags:
  - hypermedia
  - rest
  - http
  - hateoas
draft: true
---

* [Amazon AWS](https://docs.aws.amazon.com/apigateway/api-reference/) uses
  [HAL][1] for their API Gateway service.
* [Foxy](https://api.foxycart.com/docs) uses HAL to express relationships
  between entities across the board.
* [Github REST API](https://docs.github.com/en/rest) uses a custom format,
  but links are used across the board to find related resources.
* [Huddle](https://github.com/Huddle/huddle-apis/wiki/Link) has custom.
  JSON (and XML) hypermedia format, and also uses [HTTP Link headers][2]
* [Mailchimp](https://mailchimp.com/developer/marketing/api/) uses a custom
  hypermedia format that looks a bit like HAL, but isn't.
* [PayPal](https://developer.paypal.com/docs/api/reference/api-responses/)
  heavily relies on a custom hypermedia format and links to let clients
  discover actions/affordances.
* [Swedbank Pay](https://developer.swedbankpay.com/) uses a custom hypermedia
  format with extensive use of URIs as identifiers and `operations` for
  hypermedia controls.
* [The Guardian](https://www.programmableweb.com/news/how-guardian-approaching-hypermedia-based-api-infrastructure/2015/04/27)
  appears to be using [Argo][3] for some of their internal APIs.
* [Visa](https://developer.visa.com/capabilities/vpp/docs-how-to) uses HAL
  for their payments processing API.


[1]: https://tools.ietf.org/html/draft-kelly-json-hal-08
[2]: https://tools.ietf.org/html/rfc8288
[3]: https://github.com/argo-rest/spec
