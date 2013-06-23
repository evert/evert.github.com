---
date: 2013-06-20 15:23:49 UTC
layout: post
title: "PHP 5.5.0 released!"
tags:
  - php

---

PHP 5.5 has been released! Quite exciting stuff, and pretty great to see the
pace of new releases. Props to the dev team!

Hopefully distros pick this version up quickly as well, so we can start making
use of these fancy new features.

The highlights:

Generators
----------

Generators provide an extremely easy way to create iterators. They introduce
a new `yield` keyword, which kinda works like `return`, but different:

```php
<?php

function daysOfTheYear() {

    $year = date('Y');
    $current = new DateTimeImmutable($year . '-01-01');

    do {

        yield $current;
        $current = $current->modify('+1 day');

    } while ($current->format('Y') === $year);

}

foreach(daysOfTheYear() as $dt) {

    // ...

}

?>
```

The benefit of this new syntax, is that you can now let these new generators
act as if they returned an array, loop through them as usual, but the actual
array doesn't need to be in memory in advance.

[More information on php.net][1].


Immutable DateTime object
-------------------------

In my previous example I used [`DateTimeImmutable`][4]. In my [job][2] I deal a
_lot_ with dates and times. [`DateTime`][3] is therefore my tool of choice.

One mild annoyance, is that whenever DateTime objects are passed as arguments
to any method, and you intend to do calculations based on them, you really
want to make sure that you're not modifying the original.

```php
<?php

function printUTCTime(DateTime $dt) {

    $dt->setTimeZone(new DateTimeZone('UTC'));
    echo $dt->format(DateTime::ATOM);

}

// Created in a local timezone
$dt = new DateTime('now');
printUTCTime($dt);

// Now $dt is suddenly in UTC.

?>
```

Because my function name was called `printUTCTime`, as a consumer of this
function it would go against my expectations that the object was also
modified. I'd expect it to just echo.

So, as a library developer I should first always clone any `DateTime` I
get, before doing anything with them.

`DateTimeImmutable` is a new object, similar to `DateTime`. The difference is
that it's, well, immutable. This means that after the object has been created,
it's guarenteed to never change.

Methods like `modify`, `setTimeZone` and `setTimeStamp` never alter the
object, but always return a modified copy.

Now, if we can also solve the following API usability feature, I'd be totally
happy:

```php
<?php

$dt = new DateTime('2013-06-20 16:00:00', new DateTimeZone('Europe/London'));
$dt->setTimeZone(new DateTimeZone('Europe/London'));

?>
```

The previous example is, as far as I know, the only way to create a `DateTime`
object in a specific timezone. The first timezone is needed to tell `DateTime`
what the reference timezone is, the latter to actually change it into that
timezone.

Anyway, as soon as my libraries require PHP 5.5, I'll be changing all my
`DateTime` objects to `DateTimeImmutable`.

Lists in foreach
----------------

This adds some syntax sugar for some foreach loops. I quite like it:

```php
<?php

$users = [
    ['Foo', 'Bar'],
    ['Baz', 'Qux'],
];

foreach ($users as list($firstName, $lastName)) {
    echo "First name: $firstName, last name: $lastName. ";
}

?>
```

Example was directly taken from the [wiki][5].

Finally keyword
---------------

Finally, the `finally` keyword is also implemented into the language. (sorry,
had to do it).

`finally` can be added to `try..catch` block, and guarantees that regardless
of what happened within that block, `finally` _will_ always be executed.

```php
<?php

try {

  echo "1";
  throw new Exception();

} catch (Exception $e) {

  // Handle exception
  echo "2";

} finally {

  echo "3";

}

?>
```

The preceeding example will output `123`. The benefit of finally, is that it's
contents will also be executed if the exception was not caught. If you need
any guaranteed cleanup, `finally` is your tool.

Class name resolution
---------------------

I write a lot of code that maps data structures to classes. An example of this
can be seen in [my vobject project][8].

As you can see there, that's a huge list with a ton of repetition. The reason
for this lies in the fact that when you specify a classname as a string, you
cannot use namespace resolution.

Simpler example:

```php
<?php

$class = 'Sabre\\VObject\\Property\\ICalendar\\CalAddress';
$obj = new $class();

?>
```

Well, starting from PHP 5.5, I can use a syntax like this instead:

```php
<?php

use Sabre\VObject\Property\ICalendar;

$class = ICalendar\CalAddress::class;
$obj = new $class();

?>
```

Much cleaner, and prettier! Especially if you have a hundred of those in one
file.

Opcode cache is now integrated and enabled by default in PHP
------------------------------------------------------------

For years we had to manually install [APC][6] as a first step after installing
PHP. It seemed silly that 'being fast' was not considered an essential
language feature.

Now it is, and it wasn't APC that made it into core, but rather an alternative
from Zend.

Some more info can be found [on the wiki][7].

Constant dereferencing
----------------------

This is really just a fancy word for being able to do the following:

```php
<?php

echo "Hello"[1]; // output 'e'
echo [1,2,3,4][3]; // output '4'

?>
```

Why is this cool? Not sure; I'm still trying to figure out when I'll use this,
but It's great to see that the PHP engine is getting more consistent.

To conclude
-----------

<img src="https://fruux.com/static/img/errorgifs/500.gif" title="I'm pretty happy" />

Missing something?
------------------

Suggest edits or additions on [GitHub][9]

[1]: http://uk3.php.net/manual/en/language.generators.syntax.php
[2]: https://fruux.com/
[3]: http://uk1.php.net/manual/en/class.datetime.php
[4]: http://uk1.php.net/manual/en/class.datetimeimmutable.php
[5]: https://wiki.php.net/rfc/foreachlist
[6]: http://php.net/manual/en/book.apc.php
[7]: https://wiki.php.net/rfc/optimizerplus
[8]: https://github.com/fruux/sabre-vobject/blob/master/lib/Sabre/VObject/Component/VCalendar.php#L45
[9]: https://github.com/evert/evert.github.com/blob/master/_posts/2013/2013-06-13-php-55-released.md
