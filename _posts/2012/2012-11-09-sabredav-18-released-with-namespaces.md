---
date: 2012-11-09 12:50:59 UTC
layout: post
slug: sabredav-18-released-with-namespaces
title: "SabreDAV 1.8 released (with namespaces!)"
tags:
  - php
  - namespaces
  - webdav
  - sabredav
  - caldav
  - carddav

---
<p style="float: right"><img alt="sabredav_200x60.png" src="http://evertpot.com/resources/files/logos/sabredav_200x60.png" width="197" height="60" /></p>

<p>Only a month after 1.7 I just released <a href="http://sabre.io/">SabreDAV 1.8</a>.</p>
<p>Not that much changes since 1.7, except that I migrated all old prefix-style code to PHP 5.3 namespaces.</p>

<p>This means that when you used to refer to a class as "Sabre_DAV_Server", this is now "Sabre\DAV\Server".</p>

<p>So for the most part it's a simple mapping, but there were a few exceptions. While "Sabre_CardDAV_Backend_Abstract" is a valid PHP class name, "Sabre\CardDAV\Backend\Abstract" is not, because the last bit (abstract) is a keyword.</p>

<p>I migrated all 343 classes and interfaces by hand(!). There are some tools out there that do the conversion automatically, but I didn't just want to apply a blanket patch, I wanted to make sure I 'use' the right classes and namespaces in a way that it made sense. Nothing beats the human touch.</p>

<h3>Some links</h3>

<ul>
<li><a href="https://github.com/fruux/sabre-dav/blob/master/ChangeLog">Full changelog</a></li>
<li><a href="http://sabre.io/dav/upgrade/1.7-to-1.8/">Upgrade instructions</a></li>
<li><a href="http://packagist.org/packages/sabre/dav">Composer package</a></li>
<li><a href="https://github.com/fruux/sabre-dav/releases/">Zip download</a></li>
</ul>
