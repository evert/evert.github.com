---
date: 2010-05-24 16:08:42 UTC
layout: post
slug: sabredav-12-released-with-caldav-support
title: "SabreDAV 1.2 released (with CalDAV support)"
tags:
  - php
  - webdav
  - sabredav
  - caldav

---
<p style="padding: 0 0 2px 2px; float: left"><img src="http://code.google.com/p/sabredav/logo?logo_id=1264584796" title="In case you're wondering, this is indeed the SabreDAV logo. I'm not a designer, cut me some slack" /></p>

<p>It's taken almost 12 months, but I finally finished a CalDAV plugin for SabreDAV. I've stayed within the standard as much as possible, but had to leave out <a href="http://sabre.io/dav/standards-support/">some features</a> that failed to meet the cost/benefit requirement.</p>

<p>Most importantly, there's solid support for <a href="http://apple.com/ical">Apple iCal</a>, <a href="http://projects.gnome.org/evolution/">Evolution</a>, <a href="http://www.mozilla.org/projects/calendar/lightning/">Lightning</a>/<a href="http://www.mozilla.org/projects/calendar/sunbird/">Sunbird</a>, and the iPhone.</p>

<p>It all uses PDO, and it's tested on both SQLite3 and MySQL.</p>

<p>SabreDAV is primarily intended as a toolkit to implement these protocols in different applications. Despite that, it should be reasonably easy to setup your own CalDAV server. Head over to the <a href="http://sabre.io/dav/caldav/">instructions</a> to figure out how.</p>

<h3>Other changes and additions</h3>

<ul>
  <li>CalDAV (<a href="http://www.ietf.org/rfc/rfc4791.txt">RFC4791</a>).</li>
  <li>PDO backends for Locks, Authentication and Calendars.</li>
  <li>95% unittesting code coverage. 415 unittests. There's actually more unittesting code now than 'normal' code.</li>
  <li>ACL (<a href="http://www.ietf.org/rfc/rfc3744.txt">RFC3744</a>) principals. Note that privileges are not yet implemented.</li>
  <li>Support for Extended MKCOL (<a href="http://www.ietf.org/rfc/rfc5689">RFC5689</a>).</li>
  <li>Support for current-user-principal (<a href="http://www.ietf.org/rfc/rfc5397">RFC5397</a>).</li>
  <li>Now throwing an error if you're using Finder on an unsupported server (nginx, apache + fcgi, lighttpd).</li>
  <li>Support for If-Range, If-Modified-Since, If-Unmodified-Since, If-Match and If-None-Match.</li>
  <li>There's now 2 distributions. 1 unified zip with all the features, as well as 4 separate pear packages (Sabre, Sabre_HTTP, Sabre_DAV, Sabre_CalDAV).</li>
</ul>

<p>If you're upgrading from 1.0, some changes have been made. Take a look at the <a href="http://sabre.io/dav/upgrade/1.0-to-1.2/">migration guide</a> for more information.</p>

<p><a href="https://github.com/fruux/sabre-dav/releases/">Download</a>.</p>

<h3>Future plans</h3>

<p>The next big thing will be CardDAV. It won't take nearly as long as CalDAV support, as there are a lot of similarities. In general I feel I should spend a bit less time on this. I've been spending a large portion of my time in developing SabreDAV into a mature project, which can be hard to justify if it's not a source of income. I need to eat, after all.</p>

<p>I'm still enjoying it very much though and the best way to keep me motivated is to let me know you're using it or by <a href="https://github.com/fruux/sabre-dav/issues">requesting a new feature</a> =).</p>
