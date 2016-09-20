---
date: 2016-09-19 23:08:53 +0400
layout: post
title: "sabre/event 4 released for PHP 7"
tags:
   - event
   - promises
   - coroutines
   - eventemitter
   - php
   - php7
---

I just released sabre/event 4. This version is PHP-7 only, and allowed me to
figure out what it means for a project to take advantage of type-hints in PHP
7.

I decided to put the `declare` statement right on the first line of every PHP
file, so every file starts like this:

```php
<?php declare (strict_types=1);

?>
```

It just made the most sense to me.

If you haven't checked the library out, [go take a look!][1]. It's one of the
lightest event libraries around, and features a `Promise` object that's
self-contained and does not have a crazy dependency graph like most other
Promise implementations in PHP. For that reason it's a great way to wrap your
head around the Promise and it's used as a learning tool.

It also features an as-simple-as-possible event loop, that works with
`stream_select` and doesn't require extensions. It also has 0-dependencies,
100% unittested and has a fairly stable surprise-free API.

Version 4 tightens the Promise API a bit and adds support for an event emitter
that has support for listening to events via a wildcard. Example:

```php
<?php declare (strict_types=1);

use Sabre\Event\WildcardEmitter;

$ee = new WildcardEmitter();
$ee->on('create:*', function() {

    // Hey!

});

$ee->emit('create:bicycle');


?>
```

[1]: http://sabre.io/event/
