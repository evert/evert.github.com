---
date: 2010-09-22 13:16:38 UTC
layout: post
slug: evercookie-the-cookie-that-just-wont-die
title: "Evercookie: the cookie that just won't die"
tags:
  - flash
  - websec
  - cookies
  - tracking
  - privacy

---
<p><a href="http://samy.pl/">Samy</a>, famous for his worm, released <a href="http://samy.pl/evercookie/">evercookie</a> this week. Evercookie stores cookies is various storage mechanisms such as Flash Local Shared Objects (also known as flookies), HTML5 storage mechanisms and even in the history and cache. When any of these are wiped by the user the script will repopulate it, making it very hard to get rid of your cookies.</p>

<p>This is technique is common to circumvent a users' privacy wishes, which Clearspring recently <a href="http://www.nytimes.com/2010/09/21/technology/21cookie.html">got sued for</a>, but it's put in overdrive.<p>

<p>One good use for it is banning users. In the past I've used ips + cookies to ensure a user stays banned, but it doesn't take much to change your ip address and clear your cookies. All these techniques together make it a lot harder to get through. Because Flash stores it's flookies in a central place in the operating system, the cookies often even live in multiple browsers and private browsing sessions.</p>

<p>Most of all, I think the tool is made to make a point. It's very hard for the average user to clear all the tracking information. It should be doable with a press of a button, without losing all your settings and history for every other site.</p>



