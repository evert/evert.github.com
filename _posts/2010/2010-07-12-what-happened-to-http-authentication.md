---
date: 2010-07-12 14:08:35 UTC
layout: post
slug: what-happened-to-http-authentication
title: "What happened to HTTP authentication?"
tags:
  - firefox
  - websec
  - authentication
  - http
  - browser
  - account manager
  - rant
  - featured
---
<p><strong>Rant warning</strong></p>

<p>We enter our usernames and password on pretty much all the sites we commonly visit. Authentication is probably one of the first things you're being taught when starting to work with PHP. For some reason, in 99% of the cases this is done through an HTML form, with the username and password submitted as a urlencoded string.</p>

<p>You probably know that HTTP also has native authentication, in the form of Basic and Digest authentication (<a href="http://evertpot.com/223">read my older article</a> if you want to know how). Every browser and pretty much any HTTP client does too. There's some big benefits to that, because it provides a very standardized mechanism to authenticate a client, whether you're a machine or human.</p>

<p>What baffles me is that HTTP authentication hasn't been developed further. HTTP Digest is pretty secure by itself, and has some nice features (hashed password, protection against man in the middle and replay attacks, message digests) which is way more advanced than an HTML POST form with a session cookie can provide.</p>

<h3>What's missing?</h3>

<ol>
  <li>There's no way for a user to see if they are authenticated to a site. Perhaps a username in the addressbar?</li>
  <li>Pretty much everybody always wonders how they can code a logout mechanism. Because there are no session cookies that can be destroyed, there are some hacks that trick the browser to ask for credentials again. There should be no need for the server to provide this functionality. The browser knows it's logged in, and HTTP applications are stateless. We need an in-browser log-out button.</li>
  <li>Less important, some javascript hooks that allow developers to still use html forms to setup HTTP authentication.</li>
</ol>

<p>Mozilla is doing some interesting things with their <a href="http://www.mozilla.com/en-US/firefox/accountmanager/">Account Manager Add-on</a> for firefox, but even that add-on does not support HTTP authentication. With Account Manager they are jumping through some hoops with javascript hooks so it works with regular authentication systems, but you'd think that if HTTP Authentication was used, things could be a lot more straightforward. The browser knows exactly who is logged in.</p>

<p>So, does anyone know how this happened? Is there a major flaw in HTTP authentication I'm just missing?</p>
