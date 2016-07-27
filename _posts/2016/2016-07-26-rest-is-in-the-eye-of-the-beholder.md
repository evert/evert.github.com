---
date: 2016-07-26 13:47:47 -0400
layout: post
title: "REST is in the eye of the beholder"
tags:
   - rest
   - webservices 
---

The first time I came across the term REST must have been around 2005 or
2006 via [Flickr][1], which was back then in many ways a pioneer in terms
of how web applications should be built and designed.

REST, at the time, was a breath of fresh air and it seemed very sane in
a world where SOAP and XML-RPC were dominant. I can look at a webservice
straight from my browser? Wow. Returning simple XML documents instead of
using XML as the transport made a lot of sense.

I'm not really sure if Flickr was the first to use the term REST for that
type of service, but in my memory it played a fairly big part in
popularizing it.

I used the [wayback machine][2] to find these early examples, but then
quickly realized that the Flickr API [has actually not changed][3]!


But it's not REST
-----------------

It took me some time, but I slowly started realizing that this was actually
not a REST service. Not before I deployed a similar API and stamped it "REST"
though.

As it turns out, REST is more than "simple documents". We learn we also
need to use correct HTTP Verbs such as `GET`, `PUT` and `DELETE` where
appropriate.

Over time the definition for me and many people around me evolves, which
eventually brought me to a point where I found out what the original
definition was all along.

REST stands for "Representational State Transfer" and was invented by Roy
Fielding, one of the authors of HTTP/1.1 and described in his
[dissertation][4].

REST has a specific meaning and a 'best practice way' to implement it
when using HTTP, and Flickr and pretty much anyone else joining the
REST hype is getting it wrong, [much to Fieldings annoyance (2008)][5].

And he's not alone. What follows is a storm of articles, conference talks,
tweets and even some books describing what REST is and describing in what
way many people got it wrong.


So what is REST?
----------------

Well, over time we've gotten better at describing what REST is. We now
have the term [HATEOAS][6], which rolls off the tongue amazingly. A service
cannot call itself REST unless it's also HATEOAS.

We also now have the [Richardson Maturity Model][7], which is a bit like
the seven stages of grief, but for REST. Basically, you cannot call your
service REST unless you're on Level 3 of the Maturity Model.

I'd highly recommend reading the fowler article, because it's one of the best
overviews. The maturity model maps out my personal learning curve as well.

But here's the issue
--------------------

I believe that "REST" is widely believed to be the "right" way to implement
web services. The term is also almost universally used to describe services
that actually are not hypermedia-driven a.k.a. not comformant with Level 3
of the Maturity Model.

Almost everyone gets it wrong.

But the thing that they got wrong is not necessarily the API they've built.
It might be good (enough) and appropriate for what they are trying to
accomplish. The thing they get wrong is that according to purists, they
should not be calling their service REST, because it aint.

I think doing HATEAOS correctly is overkill for most people.
Modelling it correctly is actually quite hard. It's also prone to a lot of
round trips.

A comment from [Fielding][9]:

> REST is software design on the scale of decades: every detail is intended to promote software longevity and independent evolution. Many of the constraints are directly opposed to short-term efficiency. Unfortunately, people are fairly good at short-term design, and usually awful at long-term design. Most don’t think they need to design past the current release. There are more than a few software methodologies that portray any long-term thinking as wrong-headed, ivory tower design (which it can be if it isn’t motivated by real requirements).

The reality is that a lot of us actually do see the value of achieving
short-term goals, preferring ease-of-use over correctness. We're not building
an API for the library of congress. Having lots of people use an API is
probably more important than that API being relevant for multiple decades.

What I'm really sugegstion is that 'correct REST' is wrong for most people, but
this leaves us with a major problem.

There's a massive body of work that calls itself REST but is not quite REST.
Any developer tasked with building a service might therefore come to the
conclusion "REST" is a good thing.

Now, this developer might have questions about the design of their new REST
service on Stack Overflow and find out that there's a wild range of different
answers based on the answerer's definition of REST.

A common one might be: what is a good way to design my REST url structure? A
'correct' answer might be, the url structure doesn't matter as all URLS must
be discovered.

Correct? Yes! Helpful? No!

Developers might fight their way through it and still end up with enough
resources and answers to develop their 'not quite REST'-service.

Or alternatively, the developer might go all the way down the rabbit hole,
and come to the conclusion:

1. REST is popular choice for good API's.
2. Therefore REST is good.
3. REST must be hypermedia-driven.
4. Therefore good API's must be hypermedia-driven.

I've seen many people fall for this logic trap, not realizing that it's based
on a false assumption. REST is not popular. Something that's not quite REST is
popular and everybody just calls it that.

We don't have a good popular term to describe simple web API's though, which
makes it difficult to research. Most REST books and presentations you'll find
tend to be about 'correct REST' not 'popular REST', but most services are
'popular REST' not 'correct REST'.

I think coming up with a new term and popularizing it is going to be very
difficult though, so I propose that we let the programming lingo evolve the
same way words' definitions in languages do. "REST" is far and wide used
to describe non-hypermedia API's, so I think it's safe to say that the term
has evolved from it's original meaning.

Sorry Roy. At least you still have HATEAOS.

Some further reading
--------------------

Microsoft released a pretty great [REST API Guidelines][11] document that's
actually not hypermedia.
If you're looking for a body of work that _does_ try to stick very close to
the original definition of REST, take a look at [Collection+JSON][8], which is
highly correct and highly impractical.


[1]: https://www.flickr.com/
[2]: https://web.archive.org/web/20071012104127/http://www.flickr.com/services/api/request.rest.html
[3]: https://www.flickr.com/services/api/request.rest.html
[4]: https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
[5]: http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven
[6]: https://en.wikipedia.org/wiki/HATEOAS
[7]: http://martinfowler.com/articles/richardsonMaturityModel.html
[8]: http://amundsen.com/media-types/collection/
[9]: http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven#comment-724
[10]: http://stackoverflow.com/questions/tagged/rest
[11]: https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md
