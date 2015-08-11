---
date: 2012-05-04 20:44:14 UTC
layout: post
slug: new-http-status-codes
title: "New HTTP status codes"
tags:
  - http
  - featured

---
<p><a href="http://tools.ietf.org/html/rfc6585">RFC 6585</a> has been published quite recently. This document describes 4 new HTTP status codes.</p>

<p>So in case you were wondering, yes.. HTTP is still evolving :), and these new statuses may be quite useful for developing your REST, or otherwise HTTP-based service. This post describes why they are important, and when you should use them.</p>

<h3>428 Precondition Required</h3>

<p>A precondition is something a client can send along with a HTTP request. This condition needs to be met in order for the request to complete.</p>

<p>A good example is the If-None-Match header, which is often used along with GET requests. If the If-None-Match is specified, the client can request to <em>only</em> receive the response if the ETag changed.</p>

<p>Another example of a precondition, is the similar 'If-Match' header. An If-Match header is usually sent along with PUT requests to indicate to only update the resource if it <em>hasn't changed</em>. This is useful if multiple clients are using a HTTP-based service, and they want to make sure they are not overwriting each others contents.</p>

<p>Using the <a href="http://tools.ietf.org/html/rfc6585#section-3">428 Precondition Required</a> status, the server can now indicate that the client *must* send along one of those headers to perform the request. This is effectively a way for the server to force clients to prevent this 'lost update' problem.</p>

<h3>429 Too Many Requests</h3>

<p>This status code is useful in cases where you want to limit the amount of requests a client may want to do on your API (also known as rate limiting).</p>

<p>In the past different status codes have been used, such as '509 Bandwidth Limit Exceeded'. <a href="https://dev.twitter.com/docs/error-codes-responses">Twitter uses 420</a> for some stuff (which is an unused status code). Thus it was important enough to give it it's own code.</p>

<p>So if you limit the number of requests clients may do on your server, <a href="http://tools.ietf.org/html/rfc6585#section-4">429 Too Many Requests</a> is the way to go. Include a 'Retry-After' response header to indicate to a client when they are allowed to make requests again.</p>

<h3>431 Request Header Fields Too Large</h3>

<p>I was surprised to see that this was a common enough usecase to warrant it's own status code, but here it is!</p>
<p>In a case where a client is sending a HTTP request header that's too big, the server can respond with <a href="http://tools.ietf.org/html/rfc6585#section-5">431 Request Header Fields Too Large</a> to indicate exactly that.</p>

<p>I have no idea why they skipped over 430 though. I tried to search around, but couldn't quite find the reasoning. My best guess is that a lot of people may have mistyped '403 Forbidden' as '430 Forbidden', and they wanted to avoid complications. If you know, let me know!</p>

<h3>511 Network Authentication Required</h3>

<p>This status code is very interesting to me. You will not have to deal with this if you're writing a server, but it can be important if you're writing a (desktop) HTTP client.</p>

<p>If you move around with your laptop or smartphone a lot, you may have noticed that a lot of public wifi services now require you to accept their license agreement, or just log in before the web works.</p>

<p>This is generally done by intercepting the HTTP traffic and presenting a redirect and login when the user tries to access the web. Quite nasty, but that's the way it is.</p>

<p>Using these 'intercepting' clients can have some nasty side effects. There are two great examples mentioned in the RFC to illustrate this.</p>

<ul>
  <li>If you hit a website before logging in, the network device intercepts the first request. These devices also tend to have a 'favicon.ico' stored. After logging in, you'll notice that the favicon is now cached for the website you tried to visit, and it may follow you around for quite some time.</li>
  <li>If a client uses HTTP requests to find documents, the 'network' may respond with a login page, instead of the json or other document you expected. Your client may (in error) assume it's a 'normal' response and use that instead. This can put clients in a broken or irrecoverable state. I've noticed this in real life a few times working on a CalDAV system as well.</li>
</ul>

<p> So to fix this <a href="http://tools.ietf.org/html/rfc6585#section-6">511 Network Authentication Required</a> is introduced.</p>

<p>So if you write an application that runs on an desktop or phone and use HTTP, you should ideally check for this HTTP response code. In a way, it simply means that a network is not yet available and you should pretty much ignore anything coming back until it is. You could even provide the user with the returned login page, like iOS and OS X 10.7 do.</p>

