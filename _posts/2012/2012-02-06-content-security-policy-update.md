---
date: 2012-02-06 22:57:04 UTC
layout: post
slug: content-security-policy-update
title: "Content Security Policy update"
tags:
  - firefox
  - html
  - websec
  - javascript
  - csp
  - internet explorer
  - safari
  - chrome

---
<p>A quick update about CSP. Browsers are well on their way to all adopt the <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html">specification.</a></p>

<p>An early draft was already adopted by Firefox 4, and I just found out that it's also working in Chrome, Safari and IE 10.</p>

<p>IE10 and FF are using the following header:</p>

```

X-Content-Security-Policy: default-src 'self'

```

<p>While Safari and Chrome use:</p>

```

X-Webkit-CSP: default-src 'self'

```

<p>When the specification is finalized, the X- will be dropped, and it will simply be 'Content-Security-Policy'.</p>

<h3>A call for support</h3>

<p>Hi Developers! Start implementing this feature! It's important for the future and security of the web. The web's biggest vulnerability, from what I understand, is still <a href="https://en.wikipedia.org/wiki/Cross-site_scripting">XSS</a>, but if people start to properly implement CSP, XSS can effectively be a thing from the past.</p>

<p>So even if you don't want to risk using CSP on a production environment, at least consider adding the headers in your development environment. It will force you to write better code, by not embedding javascript directly into the HTML source. By considering this right now, you will also make it much easier if you do decide to adopt CSP at some point in the future.</p>

<p>I'm implementing CSP full-on in a new project, and one of the things I've noticed already is that some of the javascript we embed from 3rd parties use eval() and inline html events (onclick & friends). For the sake of security we will most likely decide to only use 3rd party code if they are indeed CSP-compatible.</p>
