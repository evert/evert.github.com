---
date: 2013-06-25 20:13:14 UTC
layout: post
title: "OS X 10.9 will ship with PHP 5.3"
tags:
  - os x
  - mavericks
  - php

---

Looks like the next iteration of OS/X will still again not ship with a recent
PHP version. The reported version appears to be:

```
PHP 5.3.23 with Suhosin-Patch (cli) (built: May 22 2013 00:00:34)
Copyright (c) 1997-2013 The PHP Group
Zend Engine v2.3.0, Copyright (c) 1998-2013 Zend Technologies
```

While it's a version from March this year, PHP 5.4 was already released before
the release of the last OS X (10.8/Mountain Lion).

Thankfully we have [homebrew][1] and [Jose Diaz-Gonzalez][2], but it's still
pretty poor.

Update
------

Looks like I was in the wrong. The latest beta releases now do ship with PHP
5.4. Sorry for jumping to conclusions!

[1]: http://mxcl.github.io/homebrew/
[2]: https://github.com/josegonzalez/homebrew-php
