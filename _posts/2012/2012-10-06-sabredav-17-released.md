---
date: 2012-10-06 12:47:38 UTC
layout: post
slug: sabredav-17-released
title: "SabreDAV 1.7 released"
tags:
  - webdav
  - sabredav
  - icalendar
  - caldav
  - vcard
  - carddav
  - vobject
  - composer

---
<p style="float: right"><img alt="sabredav_200x60.png" src="http://evertpot.com/resources/files/logos/sabredav_200x60.png" width="197" height="60" /></p>

<p>I just released <a href="http://sabre.io/">SabreDAV 1.7</a>, after about 7 months of work. A lot of work has gone into optimizing operations, and a bunch of new features have been added. I also stopped supporting the PEAR packages, and fully migrated to <a href="http://getcomposer.org/">composer</a>. If you download the zip, the required composer files are actually shipped along.</p>

<p>SabreDAV's uptake and contributions has also been very encouraging. This is especially nice since it solves such a niche problem :).</p>

<p>Most relevant new stuff:</p>

<ul>
  <li>A bunch of REPORT queries got a lot faster. Especially some CalDAV-related requests can be exponentially faster. Some larger operations sped up from several minutes, to several seconds.</li>
  <li>The VObject library has spun off into a separate project: <a href="http://sabre.io/vobject/">sabre-vobject</a>.</li>
  <li>Experimental support for caldav-sharing and caldav-notifications.</li>
  <li>Added a VCFExportPlugin, similar to the ICSExportPlugin.</li>
  <li>Added a bunch of free-busy reports that now make it possible for iCal to use them.</li>
  <li>Added support for a PATCH format for binary updates</li>
  <li>Switched to using the Composer autoloader.</li>
  <li>Stronger validation of both iCalendar and vCard files.</li>
  <li>Support for Brief and Prefer: return-minimal headers.</li>
</ul>

<h3>Some links</h3>

<ul>
<li><a href="https://github.com/fruux/sabre-dav/blob/master/ChangeLog">Full changelog</a></li>
<li><a href="http://sabre.io/dav/upgrade/1.6-to-1.7/">Upgrade instructions</a></li>
<li><a href="http://packagist.org/packages/sabre/dav">Composer package</a></li>
<li><a href="https://github.com/fruux/sabre-dav/releases/">Zip download</a></li>
</ul>

<p>A big thank you to everybody involved!</p>
