---
title: "Letting Curveball die"
date: "2024-12-29 10:00:00 -0500"
geo: [43.663961, -79.333157]
location: "Tango Coffee Place, Queen St E., Toronto, ON, Canada"
cover_image: https://evertpot.com/assets/cover/curveball-die.png
tags:
  - node
  - curveball
  - open-source
---

[Curveball][1] is a server-side webframework for Node.js. I've been working on
it for 6 years as a side-project, but it wasn't successful and it's time to let
it go. This is a hard thing to do, because I probably have 1000's of hours into
this project, and there's a strong sense of missed potential.

I'm writing this article because my psyche requires closure in order for them to
not take up space in my mind. This decision was probably a few years late.
Hopefully this creates more space for new things that aren't a frustrating drag.


Some quick numbers.
-------------------

* Number of [NPM packages][2]: **25**
* Number of released packages: **377**
* Total number of commits: **4882**
* Contributers: **32**
* Total downloads from NPM: **1,254,023**
* Active users: **10?**

Why build another framework
---------------------------

In 2018, Typescript just really started popping off and at the time I was
deeply interested in optimizing hypermedia-centric REST APIs, [Koa][3] was
a favourite framework of mine, but it was missing some features I was
particularly interested in. 

* Good Typescript support (This is pretty much fixed in Koa, but at the time
  it was buggy).
* The ability to do internal sub-requests without going over the network. Koa
  (and express) wrap the `http` Node.js library, and don't have a good
  internal abstraction for requests and responses. This makes sub-requests
  hard and deploying into non-node runtimes such as AWS Lambdas very painful.
  New frameworks like [Hono][4] do this perfectly these days, but this wasn't
  around at the time.
* Native ['JSX as a template engine'][6] support. [Hono][5] also does this.
* Deeply integrated Websockets. Probably [Bun][7] does this best at the
  moment. 
* Support HTTP/2. A big motivator for me was being able to push resources
  down the pipe with push, and [solve the N+1 problem for REST][8]. [Push is
  pretty much dead][9] now, so less of a priority.
* Good support for `103 Early Hints`. Not seeing a lot love for this in the
  new batch of frameworks.


Why did Curveball fail
----------------------

If I'm being generous with myself, I think the tech was decent and generally
liked by those using it. It was fairly sticky, but it never really reached
anything close to critical mass.

Documentation was bad, and crucially marketing was pretty much non-existant.
Over the entire 6 years it was mostly me working on it (with some great smaller
contributions!), but I have a very hard time with marketing and speaking about
the project with some consistency. The last time I blogged about a release was
in 2020. It never had a chance.

I made the same mistake I made many times before, thinking 'If I build it, they
will come' and I guess I had a hope it would attract some early strong
contributors that could help pick up the slack in areas where I was weak, but
obviously this never happened.

I also don't see how I could have gotten the time and motivation to promote
the project. I find self-promotion somewhat painful to do and Curveball was
always at best _just_ incrementally better than what was out there when I
started it, so not a lot of people are going to take the chance on something
with low user numbers, even if they were able to find it.

I'm still interested in Open Source and love building things, but probably the
biggest lesson here is that if I want it to be successful I need to do group
projects with people who make up for the qualities I lack.


I'm using Curveball for my project, now what?
---------------------------------------------

The project has been very stable and only had 1 major breaking change, which
was the move to ESM.

Express has gotten by without a major release in over a decade, so if you're
using Curveball today I think there's very little chance you need to do
anything in a long while. I will even fix bugs as they are reported, but this
blog post is effectively my statement that I'm no longer going to put much
energy in it. Curveball is stable. Don't use it for new projects. It's
techical debt, but it works and is very stable.

If you need advice on a migration path, I'm happy to do a free 30 minute
consultation! You probably know how to reach me.

If you like the project, why can't you work on it despite not having many users
--------------------------------------------------------------------------------

I get a lot of energy from working with people, getting feedback and seeing
my ideas validated. If this is not happening, to me it feels a bit like writing
a book that nobody reads. It's a constant reminder of failure.


Are there any bits salvagable?
------------------------------

* I'm going to rename [@curveball/http-errors][9] because it sucks less than
  some other HTTP error packages, it's not tied to the framework and is
  generally useful.
* I think the built-in [HATEOAS API browser][10] is great and I'm going to
  port it to a new framework. (most likely Hono as it's the closest in spirit).
* [a12n-server][11], which is an authn/authz server similar to keycloak is
  still very interesting to me. It needs its own brand and logo and will port
  this project to a different framework at some future date. Depsite being
  under the 'curveball' namespace I always saw this as its own project. This
  project does suffer from a similar problem though. Low uptake and just me
  maintaining it. I need to set some goals for 2025 and kill this as well if
  I don't meet them.

Thank you
---------

If you're a current user of Curveball: thank you for giving this a shot! I
hope this news is not too frustrating.

To my friends that gave me encouragement and feedback over the years: I love
you and appreciate you!


[1]: https://curveballjs.org/
[2]: https://www.npmjs.com/search?q=%40curveball
[3]: https://koajs.com/
[4]: https://hono.dev/
[5]: https://hono.dev/docs/guides/jsx
[6]: https://evertpot.com/jsx-template/
[7]: https://bun.sh/docs/api/websockets
[8]: https://evertpot.com/h2-parallelism/
[9]: https://www.npmjs.com/package/@curveball/http-errors
[10]: https://github.com/curveball/browser/
[11]: https://github.com/curveball/a12n-server 
