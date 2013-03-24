---
date: 2011-01-31 22:17:16 UTC
layout: post
slug: taking-advantage-of-php-namespaces-with-older-code
title: "Taking advantage of PHP namespaces with older code"
tags:
  - php
  - namespaces

---
<p>During <a href="http://akrabat.com/">Rob Allen's </a>ZF2 talk at <a href="http://conference.phpbenelux.eu/2011/">PHPBenelux</a> an audience member shouted this really useful tip, which I thought was worth sharing.</p>

<p>If you're running PHP 5.3 and you have to use pesky old code that uses long class prefixes (yea, so, pretty much all PHP code out there), you can still make use of namespace features to shorten them.</p>

```php

<?php
use Sabre_DAV_Auth_Backend_PDO as AuthBackend;
use Zend_Controller_Action_Helper_AutoComplete_Abstract as AutoComplete;

$backend = new AuthBackend();
?>

```

<p>Might have been super obvious to most of you, but it just hadn't occurred to me.</p>
