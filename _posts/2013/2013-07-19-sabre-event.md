---
date: 2013-07-19 14:12:23 UTC
layout: post
title: "sabre-event, a simple event management library for PHP 5.4"
tags:
  - sabre-event
  - php

---

I just released version 1.0 of [sabre-event][1], a simple event management
library for PHP, heavily inspired by both nodejs' [EventEmitter][2], and Igor
Wielder's [Événement][3].

This library has a few extra features not in Événement that I really needed,
and Igor had no plans adding it to his library, so I wrote my own.

In a nutshell, this is how you use it:

```php
<?php

use Sabre\Event\EventEmitter;

include 'vendor/autoload.php';

$eventEmitter = new EventEmitter();

// subscribing
$eventEmitter->on('create', function() {

    echo "Something got created, apparently\n"

});

$eventEmitter->emit('create');

?>
```

The EventEmitter object can also be integrated into existing objects, by
extending it, or using it as a trait:

```php
<?php

use Sabre\Event;

class MyNotUneventfulApplication implements Event\EventEmitterInterface
{

    use Event\EventEmitterTrait;

}

?>
```

It differs from Événement in two features:

1. It's possible to prioritize listeners, and let them trigger earlier or
   later in the event chain.
2. It's possible for listeners to break the event chain, much like
   javascript's `preventDefault()`.

I hope it will be useful to others. You can find the full documentation on
[GitHub][1], and the preferred installation method is through [Composer][4].

[1]: https://github.com/fruux/sabre-event
[2]: http://nodejs.org/api/events.html#events_class_events_eventemitter
[3]: https://github.com/igorw/evenement
[4]: https://packagist.org/packages/sabre/event
