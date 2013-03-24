---
date: 2011-09-29 14:57:15 UTC
layout: post
slug: iconv_substr-vs-mbstring_substr
title: "iconv_substr vs mbstring_substr"
tags:
  - php
  - mbstring
  - iconv

---
<p>While working on an application I ran across a huge bottleneck which I isolated down all the way to the use of the iconv_substr function. If you ever wonder which is better to use, this should help your decision:</p>

<h3>Benchmark script</h3>

```php

<?php

$str = str_repeat("foo",100000);
$time = microtime(true);

iconv_substr($str,1000,90000,'UTF-8');

echo "iconv_substr: " . (microtime(true)-$time) . "\n";

$time = microtime(true);

mb_substr($str,1000,90000,'UTF-8');

echo "mb_substr: " . (microtime(true)-$time) . "\n";

$time = microtime(true);

substr($str,1000,90000);

echo "substr: " . (microtime(true)-$time) . "\n";
?>

```

<p>The results widely varied between machines, operating systems and PHP versions; but here are two results I recorded.</p>

<p>First, PHP 5.3.4 on OS/X:</p>

```

iconv_substr: 0.014400005340576
mb_substr: 0.00049901008605957
substr: 3.7193298339844E-5  # Note the E-notation, this was actually something like 0.00003 seconds.

```

<p>As you can see iconv took <strong>0.01</strong> seconds, while mbstring took only <strong>0.0004</strong> seconds. Already a significant difference (<strong>2800%</strong> slower), but the difference became more apparent when running this on a Debian box with PHP 5.2.13.</p>

```

iconv_substr: 8.3735179901123
mb_substr: 0.00039505958557129
substr: 4.8160552978516E-5

```

<p>Yup, it took 8.3 seconds. That's an increase of over <strong>2100000%</strong>. So next time you're wondering which of the two may be smarter to use, this may help you decide.</p>

<p>Important to note that OS/X uses libiconv as the 'iconv implementation' and my Debian test machine 'glibc', so it looks like libiconv is much, much faster than glibc. mbstring still leaves both in the dust though.</p>

<p>I'm interested to hear what your results are, especially if they differ.</p>
