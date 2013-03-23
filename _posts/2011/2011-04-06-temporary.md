---
date: 2011-04-06 20:48:03 UTC
layout: post
slug: temporary
title: Temporary

---
<p>I'm officially stopping development for my <a href="http://code.google.com/p/sabreamf">SabreAMF</a> and <a href="http://code.google.com/p/dropbox-php/">Dropbox php library</a>. I'm not using either myself anymore, which is detrimental for my interest and time I devote. So I felt like it's better to make it official.</p>

<p>I'm hoping for both projects they get forked and picked up by other people. I'm happy to transfer control of the sites to a different developer, if he or she can show good coding skills and some dedication. <a href="http://code.google.com/p/dropbox-php/source/checkout">Dropbox-php</a> has a mercurial repository so it's easy to clone / fork, and I just migrated SabreDAV from svn to <a href="https://github.com/evert/SabreAMF">git(hub)</a>.</p>

<h3>Dropbox</h3>

<p>Dropbox was a short ride. When the API first came out I had some projects in mind I wanted to write for it, and there wasn't yet a PHP library. I tried to took it up myself to make one, but my interests quickly moved to different subjects. Bugs are there, and left unrepaired for too long. If you know of a good replacement library, post it in the comments.</p> 

<h3>SabreAMF</h3>

<p>While the Dropbox lib is from pretty recent, SabreAMF is from somewhere early 2006. It was my first open source project, and it has been quite a ride. It's interesting to think back to where I was in life back then.</p>

<p>It kind of went downhill when Zend_AMF got released in late 2008. Originally I was helping the (paid) developer with the implementation, but then communication went silent. I only heard about it again when it was announced with much fanfare as the Adobe/Zend partnership.</p>

<p>This left me with a bit of a sour taste. The developer at the time was struggling with decoding the AMF0/3 bits, which was just released as an open spec at the time. I originally was the first to figure out the AMF3 some time before, which was a struggle of several months, as there was no previous open-source AMF3 implementation. I was reverse engineering blindly (with help from the excellent <a href="http://www.xk72.com/">Karl Von Randow</a>). Having a working implementation after that time felt like a great achievement.</p>

<p>After checking out Zend_AMF, I found that the developer didn't bother trying decoding himself, but effectively just took my design and renamed a few methods. Mind you, these were only a couple of classes but they were the core of the project and my blood sweat and tears. I wouldn't have minded actually if I could have been a part of it, which I thought I did for a bit. Since then the Zend_AMF library has greately improved, so the evidence is stowed away in much older subversion revisions. </p>

<p>I mean no harm to said developer, his perspective may well be very different from mine. I just wanted to write this out as it has been bugging me for quite some time.</p>

<h3>However,</h3>

<p>I had tons of fun learned even more.  Very much a thanks to the users, and the people that helped me out in various occasions. I still believe there's room for a 'SabreAMF', as the main message I've always heard from people was that the alternatives are too heavy.</p>

<p>I've since then moved away from flash-work as much as possible, with the exception of the occasional feature that flash provides well, but browsers don't yet (video). If you're thinking you need an 'AMF'-like solution, I would first highly recommend to see if JSON does not already fit your needs. There are some benefits to the binary protocol, but they only tend to apply with large scale. Most people don't fit in that category. If you do, check out Zend_AMF.</p>