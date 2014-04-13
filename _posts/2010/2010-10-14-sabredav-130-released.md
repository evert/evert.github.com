---
date: 2010-10-14 20:44:19 UTC
layout: post
slug: sabredav-130-released
title: "SabreDAV 1.3.0 released"
tags:
  - webdav
  - sabredav
  - caldav

---
<p>I just released version 1.3.0 of SabreDAV. Uptake has been very strong, especially for the CalDAV components. The biggest change is a big performance boost for most tree operations.</p>

<p>To upgrade, download the new file <a href="https://github.com/fruux/sabre-dav/releases/">here</a>, or if you installed it using pear:</p>

    pear upgrade sabredav/Sabre_DAV
    pear upgrade sabredav/Sabre_CalDAV

<p>To install using pear:</p>

    pear channel-discover pear.sabredav.org
    pear install sabredav/Sabre_DAV
    pear install sabredav/Sabre_CalDAV

<p>There is a list of 4 (smallish) backwards compatibility breaks in the API. You can read about it in the <a href="http://sabre.io/dav/upgrade/1.2-to-1.3/">migration guide</a>.</p>

<p>Full list of changes:</p>

<ul>
<li>Added: Cache layer in the ObjectTree.</li>
<li>Added: childExists method to Sabre_DAV_ICollection. This is an api break, so if you implement Sabre_DAV_ICollection directly, add the method.</li>
<li>Changed: Almost all HTTP method implementations now take a uri argument, including events. This allows for internal rerouting of certain calls. If you have custom plugins, make sure they use this argument. If they don't, they will likely still work, but it might get in the way of future changes.</li>
<li>Changed: All getETag methods MUST now surround the etag with double-quotes. This was a mistake made in all previous SabreDAV versions. If you don't do this, any If-Match, If-None-Match and If: headers using Etags will work incorrectly. (Issue 85). </li>
<li>Added: Sabre_DAV_Auth_Backend_AbstractBasic class, which can be used to easily implement basic authentication.</li>
<li>Removed: Sabre_DAV_PermissionDenied class. Use Sabre_DAV_Forbidden instead.</li>
<li>Removed: Sabre_DAV_IDirectory interface, use Sabre_DAV_ICollection instead. </li>
<li>Added: Browser plugin now uses {DAV:}displayname if this property is available.</li>
<li>Added: Tree classes now have a delete and getChildren method.</li>
<li>Fixed: If-Modified-Since and If-Unmodified-Since would be incorrect if the date is an exact match.</li>
<li>Fixed: Support for multiple ETags in If-Match and If-None-Match headers.</li>
<li>Fixed: Improved baseUrl handling.</li>
<li>Fixed: Issue 67: Non-seekable stream support in ::put()/::get().</li>
<li>Fixed: Issue 65: Invalid dates are now ignored.</li>
<li>Updated: Refactoring in Sabre_CalDAV to make everything a bit more ledgable.</li>
<li>Fixed: Issue 88, Issue 89: Fixed compatibility for running SabreDAV on Windows.</li>
<li>Fixed: Issue 86: Fixed Content-Range top-boundary from 'file size' to 'file size'-1. </li>
</ul>

<p>I plan to fully keep supporting the 1.2.* branch, but I'll backport bugfixes strictly on an on-demand basis. So far there's been relatively little people stuck on older versions, so I'm only spending time on it in case anyone depends on it.</p>

<p>Thanks to all the people reporting bugs and posting patches!</p>
