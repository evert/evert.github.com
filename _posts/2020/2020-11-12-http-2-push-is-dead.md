---
title: "HTTP/2 Push is dead"
date: "2020-11-12 20:40:06 UTC"
tags:
  - http
  - http2
  - push
  - chrome
geo: [43.686467, -79.328627]
location: "Monarch Park Ave, Toronto, Canada"
---

One of the hot features that came with HTTP/2 was PUSH frames. The main idea is
that if the server can predict what requests a client might want to make, the
server can preemptively send request/response pairs to the client and warm it's
cache.

This is a feature I've been very interested in for a long time. I feel that it
can be incredibly useful for APIs to invalidate & warm caches, remove the need
for compound requests (which I feel is a [hack][1], although sometimes a
necessary one). 

To help advance this idea, I've worked on a [Internet Draft][2] to let API
clients tell the server what resources they would like to have pushed, I built
a [Node.js framework][3] with first-class, deeply integrated Push support, and
added support for `Prefer-Push` to [Ketting][4].

Unfortunately HTTP/2 push always felt like feature that wasn't quite there yet.
It's usefulness was stunted due to [Cache-Digest for HTTP/2][5] being killed
off, and no browser APIs to hook into push events.

The Chrome team has considered removing Push support since at least 2018. The
main reason being that they hadn't really seen the performance benefit for
pushing static assets. At the time, I tried to [defend][7] the feature for
the API use-case.

Yesterday, the Chrome team [announced][6] to remove the feature from their 
HTTP/2 and HTTP/3 protocol implementations.

I'm a little sad that it never got to its full potential, but with this step,
I no longer think it's worthwhile to invest in this feature. So I'm ceasing
my work on `Prefer-Push`, and will also remove support from the next major
Ketting version.

On a positive note, I spent a lot of time thinking and working on this, but
it is sometimes nice to just be able to close a chapter, rather than to wait
and let it sizzle out. It's not an ideal conclusion, but it's a conclusion
nonetheless.

Current alternatives
--------------------

Lacking server-driver push, we're back to many small HTTP request, or compound
requests. This means you either have the N+1 problem, or (in the case of
compound requests) poor integration with HTTP caches. [More on this here][8].

If you're going the 'compound request' route, there is a draft of a similar
header as `Prefer-Push`; [`Prefer: transclude`][9], which Ketting also
supports.

A feature that I hoped would work well in the future with Server Push was
server-initiated cache invalidation. We never quite got that. To work around
this, we use Websockets and will keep doing this for the forseeable future.

To reduce general latency of fetching many things, the [`103 Early Hints`][9]
can help, although this is not supported _yet_ in Chrome, and this is also
only really useful for speeding up delivery of assets like images, css and
Javascript as there's no way to hook into 1xx responses programmatically in
a browser.

[1]: https://apisyouwonthate.com/blog/lets-stop-building-apis-around-a-network-hack
[2]: https://tools.ietf.org/html/draft-pot-prefer-push-00
[3]: https://github.com/curveball/core
[4]: https://github.com/badgateway/ketting
[5]: https://tools.ietf.org/html/draft-ietf-httpbis-cache-digest-05
[6]: https://groups.google.com/a/chromium.org/g/blink-dev/c/K3rYLvmQUBY/m/vOWBKZGoAQAJ?pli=1
[7]: https://evertpot.com/h2-push-for-apis/
[8]: https://evertpot.com/h2-parallelism/
[9]: https://evertpot.com/http/103-early-hints
