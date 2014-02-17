---
date: 2014-01-21 22:40:04 UTC
layout: post
title: "fpassthru broken on OS X"
tags:
  - fpassthru
- php

---

I've gotten a few strange bug reports about broken downloads in SabreDAV over
a certain size. I was admitedly a bit sceptical, because this always worked
pretty well.

I've unable so far to confirm this on other systems, but I'm very curious what
other people are seeing.

To test, create a large file. The following statement creates a 5GB file:

dd if=/dev/zero of=5gigs bs=1024 count=5242880

Next, we want to stream this with `fpassthru()`, the following script should
do this:

    $file = __DIR__ . '/5gigs';

    $h = fopen($file, 'r');
    fpassthru($h);

I've tried this at a few sizes:

* At 1.5 GB the download succeeds
* At 3 GB and 6GB the script crashes and I'm not getting an error message.
* At 5GB I'm consistently only receiving 1 GB worth of data, before the script
  dies without warning.

This is tested on PHP 5.5.7 on OS X 10.9, and the behavior is the same through
apache, or on the command line. If the previous file was called 'foo.php', you
can easily test by running:

    php foo.php > output

Output buffering and max execution time is off. Before I'm reporting a bug to
[bugs.php.net](http://bugs.php.net), I would love to know if I'm the only one
out there seeing this.

So unless I'm making a mistake somewhere, else:

Do not use fpassthru on OS X if you want to support large files!
----------------------------------------------------------------

The following workaround always works though:

    $file = __DIR__ . '/5gigs';

    $h = fopen($file, 'r');

    while(!feof($h)) {
        echo fread($h, 4096);
    }


