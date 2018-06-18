---
date: 2016-12-14 21:42:38 -0500
layout: post
title: "Working with HAL in PUT requests"
tags:
   - rest
   - hypermedia
   - hal
   - http
   - put
---

At my [new company][1], we're developing a REST api. We're trying to strike
the balance between 'easy to use' and sticking to the rules of REST, and
that's given us more than a few unforseen benefits. When you work within a
framework that a lot of people have spent time thinking about, there's a
lot of answers if you know where to look.

Originally this service was built using the [JSON API][2] specification, but
we've thankfully adjusted our course early in the process and rewrote
everything to use [HAL][3] instead.

Whereas JSON API is almost like an "ORM over HTTP", HAL does a lot less for
you though, so it's not really an apples-to-apples type of comparison.

HAL really is just a document format for a hypermedia API, like HTML is for
hypertext. It doesn't tell you how to express your domain model, and doesn't
really tell you how to use HAL to submit changes.

Expressing relationships
------------------------

The way a relationship should be expressed in HAL is using a link. For
example, every `user` might be part of a `team`, so when I `GET` a user, I
might receive something like this:

```json
{
  "firstName" : "Evert",
  "lastName" : "Pot",

  "_links" : {
    "self" : { "href" : "/team/5/user/4234" },
    "team" : { "href" : "/team/5" }
  }
}
```

Here we see the link `self`, which is the uri for this user, and the `team` it
belongs to. This works pretty well. We made a really strong effort to
absolutely _never_ expose database `id`'s anywhere in our documents, as the URI
is ultimately the real identifier, and we don't want clients to start
composing these urls on their own. We also don't want to create two types of
unique identifiers (database id's and URIs) and force users to have to think
about which to use in which situation.


Adding a new user
-----------------

In this example, adding a new user to a team is fairly simple. Since this user
relation to the team is a sort of 'belongsTo' relationship, a new user could be
added using a request such as this:

```http
POST /team/5/user HTTP/1.1
Content-Type: application/vnd.foo-bar.hal+json

{
  "firstName" : "Roxy",
  "lastName" : "Kesh"
}
```

Since the target 'collection' is `/team/5/user` we can infer from that
that the team for this will be `/team/5`.

It turns out that most of our relationships actually follow that model. Lots
of them are basically a '1 to many' relationship. It's not always possible to
follow this model though.

Expressing relations in a PUT request
-------------------------------------

I have another fictional example that's somewhat similar to our real-life
problem. Say we have a list of blog posts. They all need to be in one category.

For reasons I won't go into, it did not make sense to have a structure such
as:

    /category/personal/post/5

So we have 2 distinct URL structures. Our categories might look a bit like this:

    /category/personal
    /category/animals
    /category/vomit

And the response to a GET request to a blog post might look like this:

```json
{
   "title": "Why I ran away",
   "date" : "2016-12-14T20:43:23Z",
   "contents" : "...",

   "_links": {
      "self" : { "href" : "/post/5" },
      "category" : { "href" : "/category/animals" }
   }
}
```

Pretty simple. There's a blog post, and it expresses via a `category` relation
type in what category it's in. But now we want to change the category with `PUT`.

There's not that much information out there from people who do this.

On the [HAL Primer][4] page for PhlyRestfully, the following is straight-up
mentioned:

> If POST-ing, PUT-ting, PATCH-ing, or DELETE-ing a resource, you will usually
> use a Content-Type header of either application/json, or some vendor-specific
> mediatype you define for your API; this mediatype would be used to describe
> the particular structure of your resources _without_ any HAL “_links”.
> Any “_embedded” resources will typically be described as properties of the
> resource, and point to the mediatype relevant to the embedded resource.

This is one of the top hits for this Google search and pretty much implies that
a HAL document (with `_links`) is only meant to be returned from a `GET` request
and not sent along with a `PUT`. Two different media-types depending on which
direction the data flows.

They can get away with it though, because they express relationship as both id's
and links, which I definitely believe is the wrong way to go about it. So when
PhlyRestfully updates a resource, they follow a bit of an odd convention. If I
followed it, my `PUT` request should look like this:

```json
{
   "title": "Why I ran away",
   "date" : "2016-12-14T20:43:23Z",
   "contents" : "...",

   "category" : { "id" : "animals" }
}
```

When I asked him about this, part of his answer was:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/evertp">@evertp</a> I see HAL more as a response format, not a request format. But there&#39;s nothing saying you can&#39;t use it in either direction.</p>&mdash; weierophinney (@mwop) <a href="https://twitter.com/mwop/status/780506625958305792">September 26, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Anyway, this was a bit unsatisfying. Not only because it meant introducing the
`id` everywhere, but I also really want clients to be able to just do a `GET`
request, make minimal modifications to the document and use the exact same
format for `PUT`.

When reading the HAL mailing list, it certainly does seem that many just provide
links in the `PUT` request. Here's a good example:

<https://groups.google.com/forum/?fromgroups=#!searchin/hal-discuss/put/hal-discuss/0-CYh0oFUUo/wx8fBLqKSVUJ>

Here poster asks whether he should use `_embedded` in `PUT` requests. Having
the `_links` there seem like a given.

However, looking again at a whole bunch of the public HAL apis that exists,
most of them completely ignore the notion of using `_links` as a real relationship
and either use id-properties as well, or just provide `_links` separately,
completely redundant.

Here's a bunch:

* [viagogo API][5]
* [artsy API][6]
* [SlimPay API][7].

Apparently both Amazon and Comcast also use HAL, but I had trouble finding their
API documentation.


Our decision
------------

We're gonna stick to our guns and let clients create new relationships using
a `_links` property in a `PUT` request.

If you are creating a new blog post, and want it to be filed under a certain
category, this how how it looks like:

```http
POST /blog/ HTTP/1.1
Content-Type: application/vnd.blog.hal+json

{
   "title": "Why I came back",
   "date" : "2016-01-15T08:44:23Z",
   "contents" : "...",

   "_links": {
      "category" : { "href" : "/category/animals" }
   }
}
```

### `_links` is optional

Because `_links` are almost always server-controlled with a few exceptions,
and might be a bit confusing for new users, we decided that we're going to make
specifying the `_links` in `PUT` requests optional. For the most part they are
'meta data' and not part of the core resource representation, and want to keep
it somewhat simple.

This goes somewhat against the rules if you follow HTTP strictly. After all, a
`PUT` request should completely replace the target resource. This is definitely
something I choose to not strictly follow though. It rarely makes real sense.

But making `_links` optional creates a new problem. What if the `category` in
our blog post is optional, and we want to to remove the `category` from an
existing post.

Well, since `_links` normally is optional, this would not do the trick:


```http
PUT /blog/6 HTTP/1.1
Content-Type: application/vnd.blog.hal+json

{
   "title": "Why I came back",
   "date" : "2016-01-15T08:44:23Z",
   "contents" : "...",
}
```

Instead, we're opting for using the `about:blank` to specifically mark the
link as removed:


```http
PUT /blog/6 HTTP/1.1
Content-Type: application/vnd.blog.hal+json

{
   "title": "Why I came back",
   "date" : "2016-01-15T08:44:23Z",
   "contents" : "...",

   "_links" : {
      "category" : { "href" : "about:blank" }
   }
}
```

Is this crazy? It seemed like the sane solution to us. If you have an opinion,
I would love to hear it!


[1]: https://getturnstyle.com/
[2]: http://jsonapi.org/
[3]: http://stateless.co/hal_specification.html
[4]: http://phlyrestfully.readthedocs.io/en/latest/halprimer.html
[5]: http://developer.viagogo.net/
[6]: https://developers.artsy.net/
[7]: https://api-sandbox.slimpay.net/
