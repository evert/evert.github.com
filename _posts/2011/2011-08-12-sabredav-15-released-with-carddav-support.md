---
date: 2011-08-12 14:08:57 UTC
layout: post
slug: sabredav-15-released-with-carddav-support
title: "SabreDAV 1.5 released with CardDAV support"
tags:
  - php
  - webdav
  - sabredav
  - caldav
  - carddav

---
<p style="float: right"><img alt="sabredav_200x60.png" src="http://evertpot.com/resources/files/logos/sabredav_200x60.png" width="197" height="60" /></p>

<p>Over the last month I've been working hard at the <a href="http://atmail.com/">Atmail</a> office in sunny Australia to get CardDAV support built into <a href="http://sabre.io/">SabreDAV</a>; and I've finally completed all the steps to do this release.</p>

<p>So there it is, CardDAV. Unfortunately there are not yet a lot of clients who actually use it, and it mainly comes down to iOS and OS/X, but I've been asked about CardDAV a lot and suspect more people will become interested in this protocol (especially if more vendors start supporting it).</p>

<p>So that's pretty much it; head over to <a href="https://github.com/fruux/sabre-dav/releases/">download page</a> to fetch a copy. I've had to break a couple of minor api's, you can read about those in the <a href="http://sabre.io/dav/upgrade/1.4-to-1.5/">migration document.</a></p>

<ul>
  <li><a href="https://github.com/fruux/sabre-dav/blob/1.5.0/ChangeLog">Full changelog</a></li>
  <li><a href="http://sabre.io/dav/upgrade/1.4-to-1.5/">Migration document for 1.4.x users</a></li>
  <li><a href="http://sabre.io/dav/carddav/">CardDAV documentation</a></li>
</ul>

<p>I tried my best to write good documentation for the new stuff, but it's always very time consuming, and not as good as I'd like If you have time and the will to write more, let me know!</p>

<p>Lastly, a big thank you to Nick Boutelier for creating the new SabreDAV logo!</p>
