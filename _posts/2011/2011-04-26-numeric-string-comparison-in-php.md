---
date: 2011-04-26 10:05:10 UTC
layout: post
slug: numeric-string-comparison-in-php
title: "Numeric string comparison in PHP"
tags:
  - php
  - type juggling

---
<p>Although PHP's loose comparison type juggling tends to invoke some negative responses, I don't think it has really ever worked against me, and works quite comfortably in my opinion. As long as you make sure you always use strict checking (=== and !==) where you can, and fall back to the loose checks when you must.</p>

<p>As a PHP developer, I think it's very important to understand and memorize exactly how these work, whether you're writing new code, or maintaining existing code.</p>

<p>A few days ago on PHP-internals I saw a behavior that was completely new to me, and very much counter-intuitive.</p>

```php

if( '20110204024217300000' == '20110204024217300264' )
  echo 'equal';
else
  echo 'not equal';

```

<p>Guess what the output is.</p>

<p>PHP will for loose comparisons always try to convert numeric strings, even when both sides of the comparisons are strings. Because the numbers are too big to fit in an integer, they are converted to floats. For both numbers this conversion ends up in the number: "2.0110204024217E+19" (give or take, based on the standard precision settings).</p>

<p>In my mind it makes sense to do this type juggling when a comparison is done with <, >, <= or >=, but it definitely feels like a bug when doing an equals check.</p>

<p>The moral is: always do strict checks when you are able to.</p> 

<p><small>Thanks to Matt Palmear for <a href="http://marc.info/?l=php-internals&m=130348253124215&w=2">pointing this out</a>.</small></p>
