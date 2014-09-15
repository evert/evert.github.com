---
date: 2014-09-15 17:55:21 UTC
layout: post
title: "Accessing protected properties from objects that share the same ancestry."
tags:
    - php
    - oop
---

I realized something odd about accessing protected properties the other day.
It's possible in PHP to access protected properties from other objects, as
long as they are from the same class, as illustrated here:

```php
<?php

class MyClass {

    protected $val;

    function __construct($newVal = 'default') {

        $this->val = $newVal;

    }

    function output(MyClass $subject) {

        echo $subject->val, "\n";

    }
}


$obj1 = new MyClass();
$obj2 = new MyClass("hello world");

$obj1->output($obj2);
// Output: hello world

?>
```

I always thought that `protected` strictly allows objects to access things
from the current inheritence tree, but didn't realize that this also extends
to other instances of the same object.

This behavior works for properties and methods, and also when they are defined
as `private`.

The other day, I realized though that this even works for objects of other
classes, as long as you are accessing members that are defined in a class that
also appears in the accessing class' ancestry.

Sounds a bit complicated, so here's the example:

```php
<?php

class Ancestor {

    protected $val = 'ancestor';

}


class Child1 extends Ancestor {

    function __construct() {

        $this->val = 'child1';

    }

}

class Child2 extends Ancestor {

    function output(Ancestor $subject) {

        echo $subject->val, "\n";

    }

}

$child1 = new Child1();
$child2 = new Child2();

$child2->output($child1);
// Output: child1

?>
```

Interestingly, if the last example is modified so that the properties are not
set in the constructors, but instead by overriding the property, this will
break:

```php
<?php

class Ancestor {

    protected $var = 'ancestor';

}


class Child1 extends Ancestor {

    protected $var = 'child1';

}

class Child2 extends Ancestor {

    function output(Ancestor $subject) {

        echo $subject->var, "\n";

    }

}

$child1 = new Child1();
$child2 = new Child2();

$child2->output($child1);
// Output: Fatal error: Cannot access protected property Child1::$var

?>
```

Because the third example throws an error, but the second does not, this makes
me feel that I've simply stumbled upon an edge-case of the PHP engine, and
that this feature is not by design. If it were designed as such, both should
imho work.

After all if a certain behavior (in this case a property) works for an
ancestor, the liskov substitution principle dictates it should also work for
any sub-classes.

In addition, PHP normally only allows you to modify a property's visibility to
become more visible.

Still, I just ran into a case where the behavior of example #2 is super handy,
but I'm not entirely sure if it's a good idea to rely on this behavior, or to
assume that this behavior is merely 'undefined' and could be altered without
notice in a subsequent PHP version.

The PHP spec does not explictly disallow it though. This is the relevant text:

> A member with protected visibility may be accessed only from within its own
> class and from classes derived from that class. [source][1]

Of course the PHP spec is likely not finished yet, and not sure if it's vetted
by the PHP team at all.

So I'm left not really knowing wether relying on this behavior is a good idea,
but at the very least it's immediately a good example of why having a correct
and official PHP standard is a great idea.

[1]: https://github.com/php/php-langspec/blob/master/spec/14-classes.md
