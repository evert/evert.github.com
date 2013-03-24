---
date: 2010-05-12 07:55:30 UTC
layout: post
slug: goodbye-old-firefox-profile
title: "Goodbye old Firefox profile"
tags:
  - firefox

---
<p>My firefox was getting a bit sluggish, which sucks.. because it's still my favourite browser. Today was just a disaster. The entire browser would just hang for seconds at a time, slow startup times.. etc.</p>

<p>I realized that firefox was running on a profile I made 4 years ago. It has seen Firefox 2.0 up until 3.6, as well as some beta and minefield builds. Dozens of add-ons have been installed, updated, removed and installed again and it has been migrated to 3 different computers. This couldn't be good for performance. Who knows what kind of settings, files and data is left hanging here and there.</p>

<p>So I went ahead today and created a new firefox profile. This is simply done by starting firefox with the --profilemanager argument.</p> 

<p>I needed my bookmarks, history and saved passwords though. To get these 3 items, copy the following files from your old, to your new profile (while firefox is not running!).</p>

<ul>
  <li><strong>places.sqlite</strong> - Contains history and bookmarks.</li>
  <li><strong>signon.sqlite</strong> - Contains all your saved passwords.</li>
  <li><strong>key3.db</strong> - Contains the encryption keys to decode your passwords.</li>
</ul>

<p>After that, it was just a matter of installing <a href="http://getfirebug.com/">Firebug</a>, <a href="https://addons.mozilla.org/addon/6683">Firecookie</a> and <a href="http://noscript.net/">noscript</a> again.</p>

<p>Right now the browser feels like new again. If you're seeing similar problems, I can highly recommend it.. but I can't be help responsible for losing any of your valuable data.. make backups! Your new profile will also have none of the customizations you've ever made.</p>

<h3>Some links</h3>

<ul>
  <li><a href="http://kb.mozillazine.org/Profile_Manager#Accessing_the_Profile_Manager">Accessing the profile manager</a></li>
  <li><a href="http://kb.mozillazine.org/Profile_folder">Where to find the profile folder</a>.</li>
</ul>
