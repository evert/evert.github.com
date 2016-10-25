---
date: 2016-10-25 00:26:18 -0400
layout: post
title: "Switching to Google AMP and back"
tags:
   - amp
---

A few months ago I added support for [AMP][1] to this blog. Not that it
desperately needed it, but [the premise][2] seemed interesting and I figured it
would be good to get some experience with new technology. The real selling
point for me is how fast this website would appear in search results.


The switch to AMP
-----------------

This website is built with [Jekyll][3], hosted on [Github pages][4], and
behind a [Cloudflare][5] proxy. Why cloudflare? Same reason for using AMP!
Websites are pretty much my business, and I want my own home to be powered by
both TLS and HTTP/2!

What this meant for AMP though is that I had to change my main site into an
AMP site. Dynamic websites unlike this might be able to create both an AMP and
non-AMP website.

In practice these are the things I had to do:

* Inline stylesheets. This was fairly easy with jekyll, I just had to change
  my linked stylesheets to an `{% raw %}{% include .. %}{% endraw %}`.
* Add a bunch of AMP boilerplate.
* Add JSON-LD in my website header. The AMP website says it's not required,
  but without it you're not going to get AMP support in google results.
* Changing all `<img>` tags to `<amp-img>` tags.
* Removing all javascript. The only bits of JS I had was for google analytics,
  which gets replaced with `<amp-analytics>`.
* And.. [Disqus][6]. This was a bit harder to solve.

### Disqus

Disqus requires javascript. I figured the best solution for using Disqus with
AMP is to have the Disqus comment box run in an iframe. This created a few more
challenges:

AMP doesn't allow javascript, but it does allow iframes using `<amp-iframe>`,
but there's a caveat. If you want to run javascript inside that iframe, the
iframe has to be hosted on a different domain for security reasons.

I tried to trick it with some domain variations, and a redirect, but had no
luck. I ended up creating a separate github repository specifically for
serving my Disqus comments.

This worked, but there was a second issue. Disqus itself _also_ uses an iframe
to embed comments. To ensure that this Disqus iframe is large enough, it will
dynamically resize based on its contents.

I had to do something similar. I had to detect when the inner Disqus iframe
resized, so I could resize the outer amp iframe. I had trouble doing this with
my usual javascript events. After I while I realized that Disqus itself must
send a message from the iframe to the top document. I figured it would likely
do this with the `postMessage` javascript API. And I was right!

So all I had to do is listen for the resize messages the Disqus application
sends out, and then forward the resize messages to the AMP document. A total
hack, but here is a snippet:

```js
window.addEventListener('message', function(ev) {
    if (String(ev.data).charAt(0)!=='{') {
        // Not a disqus event
        return;
    }
    var data = JSON.parse(ev.data);
    if (data.name !== "resize") return;
    // We just got a resize event from disqus.
    // This means we need to tell AMP in the parent
    // to also resize the parent iframe.
    window.parent.postMessage({
        sentinel: 'amp',
        type: 'embed-size',
        height: document.body.scrollHeight
    }, '*');
}, false);
```

You can find the full iframe source [here][8].

A few months later Disqus themselves officially [announced][13] support for
AMP as well, rendering my solution pointless, but as it turns out
[their solution][9] is pretty much the same as my own hack!

But! I wasn't out of the woods. As it turns out, AMP iframes are only allowed
to be placed 'below the fold'. Their definition of this is at least 600px from
the top or not within the first 75% of the page.

I have a few articles on my blog that are just 1 paragraph, so as a result for
those Disqus boxes simply would not load. Bummer!


Switching back to HTML
----------------------

Today I'm switching back from AMP to regular HTML. One reason is that I found
that Disqus didn't always reliably resizes, but there's a few others.

I've always been pretty big on web standards, and AMP is basically a deviation
from that. I really didn't enjoy changing my `<img>` to `<amp-img>` tags. The
weird boilerplate and new dependency on javascript didn't help either. I
believe my blog should be useful and useable in in places where Javascript is
not enabled, and after removing AMP, this is true once more.

I believe that web standards will always win, so bending
to the will of Google Engineers that make the web less open for something that
is likely a fad didn't seem right to me.

Another issue is that google effectively takes over your traffic, and replaces
your url with their own. This means that if people want to share a link to
your site, they'll link to google, not you.

I still like the idea of AMP, and I would be happy to restrict myself to a
stricter subset of HTML and CSS for better performance and to be allowed to
be preloaded in google search results on mobile, but I refuse to tie myself
to a superset. For AMP for me to be an option, the following has to be true:

1. Don't require javascript for normal website operations.
2. Don't rely on proprietary extensions, and let me use standard HTML for
   basic features like `<img>`.
3. Provide an easy way for users to discover the real URL.

The real question I would have though, is why didn't they just use Atom or RSS
for this? (Atom the xml format, not the bulky text editor).

Some benefits of Atom:

1. Allows embedding of full articles in HTML.
2. It's widely accepted that Atom is going to be consumed in places that
   don't allow javascript, and tend to have minimal markup, describing content,
   not presentation.
3. Is extremely widely, almost universally supported by news agencies and
   blogs, which seems to be the target audience for AMP.
4. Contains meta-data related to publishing, so it doesn't require embedding
   JSON-LD blobs.

Anyway, welcome back to the HTML website!

Some more reading:

* [Why Do Websites Publish AMP Pages? - Daring Fireball][10].
* [Google May Be Stealing Your Mobile Traffic][12].
* [Platforms like Facebook’s Instant Articles and Google AMP are making it harder, not easier, to publish to the web][11].


[1]: https://www.ampproject.org/
[2]: https://www.ampproject.org/learn/about-amp/
[3]: https://jekyllrb.com/
[4]: https://pages.github.com/
[5]: http://cloudflare.com/
[6]: https://disqus.com/
[7]: https://github.com/ampproject/amphtml/blob/master/extensions/amp-iframe/amp-iframe.md
[8]: https://github.com/evert/everts-blog-disqus
[9]: https://github.com/disqus/disqus-install-examples/tree/master/google-amp
[10]: http://daringfireball.net/linked/2016/10/21/google-amp
[11]: http://www.recode.net/2016/10/20/13318746/online-publishing-platform-amp-facebook-instant-articles-apple-news
[12]: https://www.alexkras.com/google-may-be-stealing-your-mobile-traffic/
[13]: https://blog.disqus.com/disqus-now-compatible-with-google-amp
