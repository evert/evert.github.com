---
title: "Testing the viability of HTTP/2 and Prefer-Push over compounded HTTP/1.1 responses in REST APIs"
date: "2019-12-22 11:20:00 UTC"
draft: true
tags:
  - http
  - http2
  - featured
---


<link href="/assets/css/request-simulator.css" rel="stylesheet" type="text/css" />
<script src="/assets/js/request-simulator.js"></script>

When building web services, a common wisdom is to try reduce the number of
HTTP requests to improve performance.

There are a variety of benefits to this, including less total bytes being
sent, but the predominant reason is that traditionally browsers will only make
6 HTTP requests in parallel for a single domain. Before 2008, most browsers
limited this to 2.

When this limit is reached, it means that browsers will have to wait until
earlier requests are finished until starting new ones. One implication is that
the higher the latency is, the longer it will take until all requests finish.

Take a look at an example of this behavior. In the following simulation we're
fetching a 'main' document. This could be the index of a website, or a some
JSON collection.

After getting the main document, the simulator grabs 99 linked items. These
could be images, scripts, or other documents from an API.

<div class="request-simulator" data-id="h1-nocache"></div>

The 6 connection limit has resulted in a variety of optimization techniques.
Scripts are combined and compressed, graphics are often combined into
'sprite maps'.

The limit and 'cost' of a single HTTP connection also has had an effect on web
services. Instead of creating small, specific API calls, designers of REST
(and other HTTP-) services are incentivized to pack many logical 'entities'
in a single HTTP request/response.

For example, when a API client needs a list of 'articles' from an API, usually
they will get this list from a single endpoint instead of fetching each article
by its own URI.

The savings are massive. The following simulation is similar to the last,
except now we've combined all entities in a single request.

<div class="request-simulator" data-id="h1-compound"></div>

If an API client needs a specific (large) set
of entities from a server, in order to reduce HTTP requests, API developers will
be compelled to either build more API endpoints, each to give a result
that is tailored to the specific use-case of the client or deploy systems
that can take arbitrary queries and return all the matching entities.

The simplest form of this is perhaps a collection with many query parameters,
and a much more complex version of this is [GraphQL][1], which effectively uses
HTTP as a pipe for its own request/response mechanism and allows for a wide range
of arbitrary queries.

## Drawbacks of compounding documents

There's a number of drawbacks to this. Systems that require compounding of
entities typically need additional complexity on both server and client.

Instead of treating a single entity as some object that has an URI, which
can be fetched with `GET` and subsequently cached, a new layer is required
on both server and client-side that's responsible for teasing these entities
apart.

Re-implementing the logic HTTP already provides also has a nasty side-effect
that other features from HTTP must also be reimplemented. The most common
example is caching.

On the REST-side of things, examples of compound-documents can be seen in
virtually any standard.  [JSON:API][2], [HAL][3] and [Atom][4] all have
this notion.

Most full-featured JSON:API client implementation will ship with some kind
of 'entity store', allowing it to keep track of which entities it received,
effectively maintaining its own HTTP Cache.

Another issue is that for some of these systems, is that it's typically
harder for clients to just request the data they need. Since they are often
combined in compound documents it's all-or-nothing, or significant complexity
on client and server (see GraphQL).

A more lofty drawback is that API designers may have trended towards systems
that are more opaque, and are no longer part of the web of information due
to a lack that interconnectiveness that linking affords.

## HTTP/2 and HTTP/3

HTTP/2 is now widely available. In HTTP/2 the cost of HTTP requests is
significantly lower. Whereas with HTTP/1.1 it was required to open 1 TCP
connection per request, with HTTP/2 1 connection is opened per domain. Many
requests can flow through them in parallel, and potentially out of order.

<div class="request-simulator" data-id="h2-nocache"></div>

Instead of delegating paralellism to compound documents, we can now actually
rely on the protocol itself to handle this.

Using many HTTP/2 requests instead of compound HTTP/1.1 requests has many
advantages:

* It's no longer required for (browser) applications to tease out many
  entities from a single response. Everything can just be fetched with `GET`.
  Instead of collections embedding their items, they can just point to
  them.
* If a browser has a cached copy of (some of) the items in a collection,
  it can intelligently skip the request or quickly get a `304 Not Modified`
  back.
* It's possible for some items to arrive faster than others, if they were
  done earlier. Allowing interfaces to render items as they arrive, instead
  of waiting for everything to arrive at once.


## HTTP/2 Push

There are still benefits that combined requests have over many responses.

Lets use a real example. We're building a blog api that has a list of articles.
When we request the list, instead of returning every article we're now just
returning a list of links:

```http
GET /articles HTTP/2
Host: api.example.org
```

```http
HTTP/2 200 OK
Content-Type: application/json

{
  "_links": {
    "item": [
      { "href": "/articles/1" },
      { "href": "/articles/2" },
      { "href": "/articles/3" },
      { "href": "/articles/4" },
      { "href": "/articles/5" },
      { "href": "/articles/6" },
      { "href": "/articles/7" }
    ]
  },
  total: 7
}
```

For a client to get the full list of articles, it first needs to fetch
the collection, wait for the response and then fetch every item in parallel.
This doubles the latency.

Another issue is that the server now needs to process 8 requests. One for
the collection, and then 1 per item. It's often much cheaper to generate the
entire list at once. This is sometimes referred to as the N+1 Query problem.

The problem might potentially be eliminated with HTTP/2 Server Push. Server
Push is a new feature in HTTP/2 that allows the server to take the initiative
to send additional responses before the client has actually requested them.

<div class="request-simulator" data-id="h2-push"></div>

Unfortunately this method also has a drawback. The server does not know
what resources a client already has cached. It can only assume it must
send everything, or try to intelligently guess what they might need.

There was a [proposal in the works][5] to resolve this, by letting the browser
inform the server of their cache via a bloom filter. I believe this is
unfortunately now abandoned.

So you can either fully eliminate the initial latency, or you can have
a reduced amount of traffic due to caching, but not both.

The ideal might be a mixture of this. I've been working on a specification
for allowing HTTP clients to specify what link relationships they would
like to receive via a HTTP header. It's called [Prefer Push][6], and a
request looks a little bit like this:

```http
GET /articles HTTP/2
Prefer-Push: item
Host: api.example.org
```

If a server supports this header, it knows that the client will want
all the linked resources with the 'item relationship' and start pushing
them as early as possible.

On the server-side, a fictional controller in a fictional framework might
handle this request as follows:

```javascript
function articlesIndex(request, response, connection) {

  const articles = articleServer.getIndex();
  response.body = articles.toLinks();

  if (request.prefersPush('item')) {
    
    for(const article of articles) {
      connection.push(
        article.url,
        article.toJson();
      };
    }

}
```

## The CORS problem

A major drawback that's worth pointing out, is [CORS][7]. CORS originally
opened the door to making it easier to do HTTP requests from a web application
that's hosted on some domain, to an API hosted on another domain.

It does this with a few different facilities, but one that specifically kills
performance is the pre-flight request.

When doing 'unsafe' cross-domain requests, the browser will start off by doing
a `OPTIONS` request, allowing the server to explicitly opt-in to requests.

In practice most API requests are 'unsafe'. The implication is that the latency
of each individual HTTP request at least doubles.

<div class="request-simulator" data-id="h2-cors"></div>

WHat's interesting is that Macromedia Flash also had this issue, and they
solved with by creating a domain-wide cross-origin request policy. All you had
to do is create a `crossdomain.xml` file on the root of your domain, and once
Flash read the policy it would remember it.

Every few months I search to see if someone is working on this, and this time
I've found a [W3C Draft Specification][8]. Here's hoping browser vendors pick
this up!

A less elegant workaround to this, is to host a 'proxy script' on the API's
domain. Embedded via an IFrame, it has unrestricted access to its own 'origin'.

The parent web application can communicate to it via
[`Window.postMessage()`][9].

## The perfect world

In a perfect world, HTTP/3 is already widely available, improving performance
even further, browsers have a standard mechansim to send [cache digests][5],
clients inform the server of the link-relationships they want, allowing API
servers to push any resources clients may need, as early as possible, and
domain-wide origin policies are a thing.

This last simulation show an example of how that might look like. In the below
example the browser has a warmed up cache, and an ETag for every item.

When doing a request to find out if the collection has new entries or updated
items, the client includes a cache digest and the server responds by pushing
just the resources that have changed.

<div class="request-simulator" data-id="h2-cached"></div>

## Real-world performance testing

We're lacking some of these 'perfect world' features, but we can still work
with what we got. We have access to HTTP/2 Server Push, and requests are cheap.

Since HTTP/2, 'many, small HTTP endpoints' felt to me like it was the most
elegant design, but do the numbers hold up? Some evidence would could really
help.

My goal for this performance test is fetch a collection of items in the
following different ways:

1. `h1` - Invididual HTTP/1.1 requests
2. `h1-compound` - A HTTP/1.1 compound collection.
3. `h2` - Invididual HTTP/2 requests
4. `h2-compound` -  HTTP/2 compound collection.
5. `h2-cache` - A HTTP/2 collection + every item invividually fetched. Warm
   cache.
6. `h2-cache-stale` - A HTTP/2 collection + every item invividually fetched,
   Warm cache but needs revalidation.
7. `h2-push` - HTTP/2, no cache, but every item is pushed.

## My prediction

In theory, the same amount of information is sent and work is done for a
compound request vs. HTTP/2 pushed responses.

However, I think there's still enough overhead to HTTP requests in HTTP/2
that the compound request will will win.

The real benefit will show when caching comes in to play. For a given
collection in a typical API I think it's fair to assume that many items may
be cached.

It seems logical to assume that the tests that skip 90% of the work are
also the fastest.

So from fastest to slowest, this is my prediction. 

1. `h2-cache` - A HTTP/2 collection + every item invividually fetched. Warm
   cache.
2. `h2-cache-stale` - A HTTP/2 collection + every item invividually fetched,
   Warm cache but needs revalidation.
3. `h2-compound` -  HTTP/2 compound collection.
4. `h1-compound` - A HTTP/1.1 compound collection.
5. `h2-push` - HTTP/2, no cache, but every item is pushed.
6. `h2` - Invididual HTTP/2 requests
7. `h1` - Invididual HTTP/1.1 requests

## First test setup and initial observations

I initially started testing with a local Node.js service, version 12.
All HTTP/1.1 tests are done over SSL, and HTTP/2 tests run over a different
port.

To simulate latency, I added a delay to every HTTP request between 40 and 80
milliseconds.

I ran into a number of issues right away. Chrome disables the cache with self-
signed certificates. I was not really able to figure out how to get Chrome to
accept my self-signed certificate on localhost, so I initially gave up on this
and tested with Firefox.

On Firefox, Server Push seems unreliable. It often only worked the second time I
ran the Push test.

But, the most surprising thing was that in Firefox, serving items from the
local cache was only marginally faster than serving fresh responses with my
artificial latency. Running these tests several times, in many cases serving
items from cache was actually *slower* than going to the server and requesting
a new copy.

<figure>
  <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><g transform="translate(40,0)"><text x="-40" y="-7" style="font-size: 10px; font-family: Arial, Helvetica;">undefined</text><g class="y axis" style="font-size: 10px; font-family: Arial, Helvetica;" transform="translate(0,0)" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"><path class="domain" stroke="#000" d="M-6,550.5H0.5V0.5H-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></path><g class="tick" opacity="1" transform="translate(0,550.5)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">0.0</text></g><g class="tick" opacity="1" transform="translate(0,531.6417795302589)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">0.2</text></g><g class="tick" opacity="1" transform="translate(0,512.7835590605177)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">0.4</text></g><g class="tick" opacity="1" transform="translate(0,493.9253385907766)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">0.6</text></g><g class="tick" opacity="1" transform="translate(0,475.0671181210355)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">0.8</text></g><g class="tick" opacity="1" transform="translate(0,456.20889765129436)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">1.0</text></g><g class="tick" opacity="1" transform="translate(0,437.35067718155324)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">1.2</text></g><g class="tick" opacity="1" transform="translate(0,418.4924567118121)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">1.4</text></g><g class="tick" opacity="1" transform="translate(0,399.634236242071)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">1.6</text></g><g class="tick" opacity="1" transform="translate(0,380.77601577232986)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">1.8</text></g><g class="tick" opacity="1" transform="translate(0,361.91779530258873)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">2.0</text></g><g class="tick" opacity="1" transform="translate(0,343.0595748328476)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">2.2</text></g><g class="tick" opacity="1" transform="translate(0,324.2013543631065)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">2.4</text></g><g class="tick" opacity="1" transform="translate(0,305.34313389336535)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">2.6</text></g><g class="tick" opacity="1" transform="translate(0,286.4849134236242)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">2.8</text></g><g class="tick" opacity="1" transform="translate(0,267.6266929538831)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">3.0</text></g><g class="tick" opacity="1" transform="translate(0,248.7684724841419)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">3.2</text></g><g class="tick" opacity="1" transform="translate(0,229.91025201440084)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">3.4</text></g><g class="tick" opacity="1" transform="translate(0,211.05203154465966)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">3.6</text></g><g class="tick" opacity="1" transform="translate(0,192.19381107491859)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">3.8</text></g><g class="tick" opacity="1" transform="translate(0,173.33559060517746)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">4.0</text></g><g class="tick" opacity="1" transform="translate(0,154.47737013543627)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">4.2</text></g><g class="tick" opacity="1" transform="translate(0,135.61914966569515)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">4.4</text></g><g class="tick" opacity="1" transform="translate(0,116.76092919595413)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">4.6</text></g><g class="tick" opacity="1" transform="translate(0,97.90270872621295)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">4.8</text></g><g class="tick" opacity="1" transform="translate(0,79.04448825647182)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">5.0</text></g><g class="tick" opacity="1" transform="translate(0,60.186267786730696)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">5.2</text></g><g class="tick" opacity="1" transform="translate(0,41.32804731698951)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">5.4</text></g><g class="tick" opacity="1" transform="translate(0,22.46982684724844)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">5.6</text></g><g class="tick" opacity="1" transform="translate(0,3.6116063775073144)"><line stroke="#000" x2="-6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" x="-9" dy="0.32em">5.8</text></g></g><rect transform="translate(0,0)" class="bar" x="13" width="84" y="448.0713183610492" height="101.92868163895082" style="fill: rgb(88, 109, 201);"></rect><rect transform="translate(0,0)" class="bar" x="106" width="84" y="519.3553917366706" height="30.64460826332936" style="fill: rgb(88, 109, 201);"></rect><rect transform="translate(0,0)" class="bar" x="199" width="84" y="0" height="550" style="fill: rgb(88, 109, 201);"></rect><rect transform="translate(0,0)" class="bar" x="292" width="84" y="422.80130293159607" height="127.19869706840393" style="fill: rgb(88, 109, 201);"></rect><rect transform="translate(0,0)" class="bar" x="385" width="84" y="462.5921481227499" height="87.4078518772501" style="fill: rgb(88, 109, 201);"></rect><rect transform="translate(0,0)" class="bar" x="478" width="84" y="531.8961083490485" height="18.103891650951482" style="fill: rgb(88, 109, 201);"></rect><rect transform="translate(0,0)" class="bar" x="571" width="84" y="420.8211897822733" height="129.17881021772672" style="fill: rgb(88, 109, 201);"></rect><rect transform="translate(0,0)" class="bar" x="664" width="84" y="421.95268301045775" height="128.04731698954225" style="fill: rgb(88, 109, 201);"></rect></g><g class="x axis" style="font-size: 10px; font-family: Arial, Helvetica;" transform="translate(40,550)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"><path class="domain" stroke="#000" d="M0.5,6V0.5H760.5V6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></path><g class="tick" opacity="1" transform="translate(55.5,0)"><line stroke="#000" y2="6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" y="9" dy="0.71em">H1,90% cache</text></g><g class="tick" opacity="1" transform="translate(148.5,0)"><line stroke="#000" y2="6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" y="9" dy="0.71em">H1,Compound</text></g><g class="tick" opacity="1" transform="translate(241.5,0)"><line stroke="#000" y2="6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" y="9" dy="0.71em">H1,No Cache</text></g><g class="tick" opacity="1" transform="translate(334.5,0)"><line stroke="#000" y2="6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" y="9" dy="0.71em">H2,90% 304 Not Modified</text></g><g class="tick" opacity="1" transform="translate(427.5,0)"><line stroke="#000" y2="6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" y="9" dy="0.71em">H2,90% cache</text></g><g class="tick" opacity="1" transform="translate(520.5,0)"><line stroke="#000" y2="6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" y="9" dy="0.71em">H2,Compound</text></g><g class="tick" opacity="1" transform="translate(613.5,0)"><line stroke="#000" y2="6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" y="9" dy="0.71em">H2,No cache</text></g><g class="tick" opacity="1" transform="translate(706.5,0)"><line stroke="#000" y2="6" style="shape-rendering: crispedges; fill: none; stroke: rgb(204, 204, 204);"></line><text fill="#000" y="9" dy="0.71em">H2,push</text></g></g></svg>
  <figcaption>
    Relative speed of fetching a collection with Firefox.
    Smaller bars = faster.
  </figcaption>
</figure>

This led me to a few decisions:

* I need to put the test server on a AWS instance and get real network
  behavior. This also increases the chance of other interference, but I feel
  that real network conditions are likely going to give more accurate results
  than me faking it with a single `setTimeout()`.
* I also need to have this server running online somewhere to get results
  from Chrome.
* I need more accurate timings to see if this time is really being spent
  waiting getting things from the Cache, or elsewhere.
* I should run my browsers with clean profiles and no add-ons.

<figure>
  <video src="video/first_test/h2-cached.mp4" controls></video>
  <figcaption>Testing HTTP/2 with cache</figcaption>
</figure>

## Second test

Second test set up:

1. Correctly set up SSL with a real certificate.
2. I'm running on AWS, `t2.medium` instance in `us-west-2`.
3. My testing is done over residential internet, repeated 50 times.
4. I'm testing with multiple browsers with add-ons disabled.

<iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRU5VxjIyDKRpMfsMipSJjmx0lnVjRWc73EKvUKlBvvLEPmEdIxmFfpYNt8p_tdF4kujKubfbNINOK4/pubchart?oid=1598353869&amp;format=interactive"></iframe>


[1]: https://graphql.org/
[2]: https://jsonapi.org/
[3]: https://tools.ietf.org/html/draft-kelly-json-hal-00
[4]: https://tools.ietf.org/html/rfc4287
[5]: https://tools.ietf.org/html/draft-ietf-httpbis-cache-digest-05
[6]: https://tools.ietf.org/html/draft-pot-prefer-push
[7]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[8]: https://wicg.github.io/origin-policy/ "Origin Policy"
[9]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage "MDN: Window.postMessage()"
