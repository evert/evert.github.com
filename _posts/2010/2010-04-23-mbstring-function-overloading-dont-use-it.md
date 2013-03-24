---
date: 2010-04-23 18:22:50 UTC
layout: post
slug: mbstring-function-overloading-dont-use-it
title: "mbstring function overloading: don't use it"
tags:
  - php
  - unicode
  - encoding
  - mbstring

---
<p>As a library author, the worst thing I have to deal with is PHP settings that affect global behaviour. Some examples of this include:</p>

<ul>
  <li>Making sure that the library still works in your specific <a href="http://kr.php.net/manual/en/function.setlocale.php">locale setting</a>.</li>
  <li>Don't rely on a specific <a href="http://kr.php.net/manual/en/function.error-reporting.php">error_reporting</a> setting to catch errors.</li>
  <li>If it was 1997, don't rely on a specific magic_quotes or register_globals setting.</li>
  <li>Don't rely on the current setting of <a href="http://www.php.net/manual/en/function.mb-internal-encoding.php">mb_internal_encoding</a>, and instead always pass the desired encodings to the mb_* functions.</li>
</ul>

<p>Not only should I not rely on these settings, I also can't change them. I should assume that the application using my library might have a preference for a specific setting, so I can't dictate what the setting should be. The exception to this are cases where I change a setting temporarily and revert it.</p>

<p>Obviously I'm not perfect and not aware of every flag that changes the environment. When I come across incompatibility bug reports I'll quickly try to change the bits that affect this compatibility.</p>

<p>So now I'm faced with a <a href="http://code.google.com/p/sabredav/issues/detail?id=44">bug report</a> about my library failing when <a href="http://php.net/manual/en/mbstring.overload.php">mbstring function overloading</a> is turned on. Definitely something I've missed.</p>

<p>mbstring overloading alters the behaviour of 17 common PHP string functions, such as strpos and substr. Because I deal with binary data this fails on a number of places. The only solution is to look for all the instances where I'm using these functions and replace instances of strlen($string) with mb_strlen($string, '8bit');.</p>

<p>I'm using these functions on a ton of places though. I'm wondering in this case if I should simply throw an error when I find out function overloading is turned on.</p>

<h3>Conclusion</h3>

<p>To make a long story short. If you're ever intending to use external PHP libraries, there's a very good chance they haven't accounted for mbstring.func_overload. I can highly recommend always using the mb_* functions directly, and keep that setting off.</p>
