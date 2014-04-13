---
date: 2011-11-29 15:55:58 UTC
layout: post
slug: phpincludes
title: "PHP Includes file generator"
tags:
  - php
  - phpincludes

---
<p>While profiling <a href="https://sabre.io/">SabreDAV</a>, I noticed a few times more than half of the request time was spent in the autoloader.</p>

<p>So instead of autoloading, now I prefer to unconditionally include every file for each package (there are 5 packages). For a while I manually maintained these files manually, but a while back I automated this process.</p>

<p>This is how you run it:</p>

    phpincludes . includes.php

<p>This will generate a file such as:</p>

```php
<?php

// Begin includes
include __DIR__ . '/Interface1.php';
include __DIR__ . '/Class1.php';
include __DIR__ . '/Class2.php';
include __DIR__ . '/Class3.php';
// End includes
```

<p>You can edit everything before "// Begin includes" and after "// End includes". Subsequent edits will only replace the lines in between those comments.</p>

<p>The script will automatically expand classes and interface dependencies and load them in the correct order. It also has support for a PHP 5.2-compatible syntax (dirname(__FILE__) instead of __DIR__).</p>

<p>If you like it, head over to <a href="https://github.com/evert/PHPIncludes">github</a>, or install it with:</p>

```

pear channel-discover pear.sabredav.org
pear install sabredav/PHPIncludes

```
