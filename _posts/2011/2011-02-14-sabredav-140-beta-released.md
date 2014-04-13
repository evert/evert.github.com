---
date: 2011-02-14 13:00:00 UTC
layout: post
slug: sabredav-140-beta-released
title: "SabreDAV 1.4.0-beta released"
tags:
  - php
  - webdav
  - sabredav
  - caldav

---
<p>Last Saturday I put up version SabreDAV 1.4.</p>

<p>It's taken a while to get this one out. Much longer than I thought. The result was that there's been very little released over the past few months. In an effort to change this, I decided to release 1.4.0 as soon as possible, rather than when all the features are ready. I believe this is better for the end-user and for me as well (release early, release often, etc).</p>

<p>So there it is. These are the new major features:</p>

<ul>
  <li><a href="http://sabre.io/dav/acl/">WebDAV ACL</a> support. This part is not 100% done. It can be integrated into existing API's, but there's no central ACL store or ability to modify ACL's through the WebDAV protocol yet. These additional features will be added in subsequent versions.</li>
  <li><a href="http://sabre.io/dav/caldav-proxy/">CalDAV proxy</a> support. This is a proprietary apple extension, allowing users to delegate calendar access to other users.</li>
  <li>Integrated the 'VObject' library, which provides an easy way to read and write iCalendar objects with an api similar to SimpleXML.</li>
  <li>Added the <a href="http://sabre.io/dav/ics-export-plugin/">ICSExportPlugin</a>, allowing you to export iCalendar-formatted calendars.</li>
</ul>

<p><small><a href="https://github.com/fruux/sabre-dav/blob/1.4.0/ChangeLog">full changelog</a></small></p>

<p>To allow for a proper ACL implementation, much of the 'principal' functionality has been moved from Sabre_DAV_Auth to Sabre_DAVACL. There's a <a href="http://sabre.io/dav/upgrade/1.3-to-1.4/">Migration guide</a> available with all the details.</p>

<p>As usual, if you're not ready to migrate to 1.4 because of the API breaks or because it's still considered beta, I'll be maintaining 1.3 for at least another year. However, I'll be doing this on a strictly on-demand basis. So if you need a bugfix backported or a release, feel free to ask on the <a href="http://groups.google.com/group/sabredav-discuss">mailing list</a>.</p>

<p>Lastly, thanks to all the users. The number of deployments and feedback is steadily growing and that's very rewarding.</p>

<p><a href="https://github.com/fruux/sabre-dav/releases/">Download here</a>.</p>
