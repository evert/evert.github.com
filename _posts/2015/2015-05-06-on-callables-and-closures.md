---
date: 2015-05-06 17:03:34 UTC
layout: post
title: "PHP's callable typehint too loose?"
tags:
    - php
    - callable
    - closure
    - typehint
---

PHP got support for closures in version 5.3, and in PHP 5.4 we got support for
a `callable` typehint, that can be used as such:

```php
<?php

function callMe(callable $callBack) {

    $callBack();

}

?>
```

All these little changes make it feel more comfortable to apply functional
programming concepts to PHP, but occasionally we need to drop back to using
less aesthetically pleasing code.

To use our `callMe` function to call back directly to a object method, we
use this syntax:

```php
<?php
callMe([$object, 'method']);
?>
```

This also works with static methods:

```php
<?php
callMe(['\\Namespace\\MyClass', 'method']);
?>
```

Or if you are on PHP 5.5:

```php
<?php
callMe([MyClass::class, 'method']);
?>
```

These all work, because when you execute this code:

```php
<?php
$foo = [$object, 'method'];
$foo();
?>
```

...PHP will actually correctly execute `method` on our `$object`. But there's an
exception. Aside from the previous syntax for calling static methods, PHP also
allows this to fulfill the `callable` typehint:

```php
callMe('MyClass::method');
```

Unfortunately, this will [trigger the following error][1]:

```
Fatal error: Call to undefined function MyClass::method() in /in/Kkr3F on line 14
Process exited with code 255.
```

The only remedy is to change our original function from:

```php
<?php

function callMe(callable $callBack) {

    $callBack();

}

?>
```

to:


```php
<?php

function callMe(callable $callBack) {

    call_user_func($callBack);

}

?>
```

`call_user_func($callBack);` does what `$callBack()` does, but it's less
aesthetically pleasing.

So if you rely on the `callable` typehint, or the `is_callable()` function, be
aware that you _need_ to use `call_user_func()` to get reliable results.

Lastly
------

I came to write this because I got a bug report from someone who wanted to be
able to use the `'MyClass::method'` syntax. I was a bit surprised this didn't
work, as I had always used `['MyClass', 'method']`. So, before changing all my
`$x()` to `call_user_func($x)`, I first had to figure out how this was
possible.

What do you think? Is this a PHP bug? Or was I wrong to think that this should
have worked in the first place?

[1]: http://3v4l.org/Kkr3F
