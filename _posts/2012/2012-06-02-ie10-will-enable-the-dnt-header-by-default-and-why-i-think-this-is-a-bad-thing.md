---
date: 2012-06-02 13:49:47 UTC
layout: post
slug: ie10-will-enable-the-dnt-header-by-default-and-why-i-think-this-is-a-bad-thing
title: "IE10 will enable the DNT header by default, and why I think this is a bad thing."
tags:
  - firefox
  - ie
  - dnt

---
<p>Microsoft recently <a href="https://blogs.technet.com/b/microsoft_on_the_issues/archive/2012/05/31/advancing-consumer-trust-and-privacy-internet-explorer-in-windows-8.aspx?Redirected=true">announced</a> that they will automatically enable the 'Do Not Track' header in Internet Explorer 10.</p>

<p>The DNT header allows a user to opt-out of being tracked by websites. This was introduced by Firefox, and now also has support from Opera and Safari (but not Chrome).</p>

<p>This header is a great feature. Before, the ad providers had to ask the user on their website to opt-out, and this actually was usually implemented using a Cookie.</p>

<p>Although not every ad publisher supports the DNT header yet, it's gaining traction. However, publishers are not forced to comply with this. They do have to provide an opt-out mechanism to comply with many countries' laws, but there's nowhere stated this has to be done using the DNT header.</p>

<p>Currently, browsers have the DNT setting disabled by default. If IE10 enables it, this means that IE10 users will have to explicitly opt-in to allow publishers to track them. This is very different from how Firefox and other browsers deal with this, as they've chosen for the explicit opt-out.</p>

<p>I strongly suspect that publishers will feel that their tracking ability will now be severely diminished by supporting the header. Since they are not forced to support the DNT header, there will be much less of an incentive to start supporting it. They can just provide their own inferior cookie mechanism. I can even see some publishers that already support the DNT header reverse this decision.</p>

<p>So while I commend Microsoft for putting the consumer first; If we want the DNT header to work, publishers must either want to support it, or must be forced to by law. Until the latter is the case, I hope Microsoft reverses this decision to ensure that the DNT header stays useful.</p>

<h3>References</h3>

<ul>
  <li><a href="http://blog.mozilla.org/privacy/2012/05/31/do-not-track-its-the-users-voice-that-matters/">Mozilla privacy blog</a></li>
  <li><a href="https://blogs.technet.com/b/microsoft_on_the_issues/archive/2012/05/31/advancing-consumer-trust-and-privacy-internet-explorer-in-windows-8.aspx?Redirected=true">Microsoft Technet article</a></li>
  <li><a href="http://tools.ietf.org/html/draft-mayer-do-not-track-00">IETF proposal for the DNT header</a></li>
</ul>
