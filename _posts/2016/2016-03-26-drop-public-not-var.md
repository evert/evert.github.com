---
date: 2016-03-26 15:58:16 -0400
layout: post
title: "Drop 'public' not 'var'!"
tags:
  - bikeshedding
  - oop
  - php
geo:  [43.642392, -79.414486]
location: "Shank St, Toronto, ON, CA"
---

Bikeshedding time!

A [PHP RFC vote has started][1] to deprecate the `var` keyword in PHP 7.1 and
remove it in PHP 8. At the time of writing, there 23 who say it should be
removed, and 18 who say it should not.

I suspect that most people in the "no" camp, feel that way about `var` because

* There's not a big maintenance burden or overhead to keep `var`.
* They feel that it will break BC, with no strong benefit.

The "yes" camp feel mainly feels that it makes the language a bit cleaner.

I'd like to offer a different opinion: I think people should be using `var`
instead of `public`. I realize that this is as controversial as tabs vs.
spaces (as in: it doesn't really matter but conjures heated discusssions),
but hear me out!

Over the last year I've been going through all my open source projects, and
I've been removing all the `public` declarations where this was possible.

This means that if my class first looked like this:

```php
<?php

class ImConformist {

    static public $prop1;
    final public $prop2;

    public function __construct() {

    }

    public function getFoo() {

    }

    public function setFoo(Foo $foo) {

    }

    abstract public function implementMe();

    final public function dontTouchMe() {

    }

    static public function iShouldntBeHere() {

    }

}
```

Now, I write it like this:


```php
<?php

class HateGenerator {

    static $prop1;
    final $prop2;

    function __construct() {

    }

    function getFoo() {

    }

    function setFoo(Foo $foo) {

    }

    abstract function implementMe();

    final function dontTouchMe() {

    }

    static function iShouldntBeHere() {

    }

}
```

This change has generated interesting responses. A lot of people think it's
ugly. Some think I should just follow [PSR-2][2]. I also heard from a whole
bunch that weren't aware that ommitting `public` actually has no effect on
your code!

Yes, `public` is completely optional. `public` is the default, so adding it
does _nothing_ to your code.


Actually, it does do something. It makes your lines longer! Typically when
someone has to read your source and figure out what a class is doing, it
will take them slightly longer to read the method signatures.

So there's a small mental tax for a human to read and intereprete the entire
line. It's generally accepted that shorter lines are better, and when
'scanning' a file from top to bottom, it's better that the important keywords
(the name of the function) are closer to the left-edge of the screen.

That's my main argument for dropping the `public` keyword where possible. I
believe that the people who are against it, generally fall in three camps:


#1: Everyone doing the same thing is good
-----------------------------------------

This is the conformist argument, and the best one. There is definitely a case
to be made that if most PHP code-based look similar, it is easier for new
maintainers to get a jump start in the project.

I suspect that these people are also the most likely to use [PSR-2][2] when
they can.

I think it's good to be similar, but then, I think it's also good to sometimes
break the mold and do something new. If we always keep doing things the same
way, we never progress. Being consistent is good, but it's also good to be
open to change, especially if that change has real benefits.


#2: It's ugly!
--------------

The aesthetics argument! It's not an invalid one. I care quite a bit about
how my source 'looks'. I'm an "API over Implemenation" guy, and I think the
aesthetics of your source influence the ease of how someone can start using
it.

The case I want to present to you today though is that you think it's ugly,
because it's foreign to you. I felt the same way at first, and found out
pretty quickly that I got used to the new status quo and as soon as I lost
my earlier biases, the new way actually feels a lot more natural now.

Whenever I look at sources that use the `public` keyword, the feelings it's
giving me is "dense", "corporate" and "java-esk".

 
#3: The `public` keyword is useful to convey intent
---------------------------------------------------

On the surface this argument sounds reasonable, but ultimately I think people
who hold this opinion are suffering a form of denial. A new idea was
presented to them, they don't like it, so their brain works overtime to find
a possible counter argument that just coincidentally matches their existing
biases and world-view.

I believe that the people who feel this way are actually just in camp #2, but
lack self awareness.

The truth is that many languages popular scripting languages don't need the
keyword (ruby, javascript), or lack the functionality altogether (python).

Furthermore, did you ever wish you could `public` in front of your `class`, 
`interface` or `namespace`, or your regular non-class functions? What about
`public const`? Be honest! Have you really ever missed `public` there? Really?

Hey I do think it would be great to have private classes and private namespace
functions, but I definitely haven't "missed" being able to tack on the
`public` symbol to a constant. `public` is already implied.


So given those arguments, why does everyone add `public` everywhere?
--------------------------------------------------------------------

This is a theory: Back in the day when we all made the transition from PHP 4
to 5, everybody was just really really excited.

PHP 5 introduced a new object model that was just so much better than the PHP
4 one. The visibility keywords are just a small aspect of that. The game
changer was in how references are dealt with!

The object model was the number 1 selling point for PHP 5. There was some
criticism that PHP became too Java-like, but the vast majority of the community
was thrilled.

However, it took a bit before people could drop PHP 4 support. Only around PHP
5.2, the 5.x series became really good and people started migrating en-masse.

Using `public`, `protected` and `private` was, aside from the feature, almost
worn like a badge of honor. This is PHP 5 code and we love PHP 5. It says loud
and clear that PHP 4 is unsupported and behind us.

But since then, the PHP 5 object model became the new normal, and we've never
gone back and challenge the use of `public`.


But then, what about `var`?
---------------------------

The `public` keyword can be removed from every function and
every property declaration, with one exception: A non-static, non-final public
class property:

```php
<?php

class Foo {

    public $ew;

    // These are all fine:
    final $yay;
    static $whoo;    

}
```

It's the last place you'll find `public` in my source. So I've been toying
with the idea of ditching `public` there too and just start using `var`:

 
```php
<?php

class Foo {

    var $ninetiesThrowback;

}
```

The arguments for this are a bit weaker, but I think they're still valid:

1. If public is not anywhere else, it would be nice if you also don't need it
   for properties. If ditching `public` becomes the status-quo, then needing
   `public` for properties might actually become confusing.
2. I think `var` is more useful to convey intent than `public`. It's a
   "variable on a class" not "a public" in the same way that the `function`
   keyword is useful. I think this is better for newcomers to the language.


However, I haven't made this change from `public` to `var` yet, given the 
uncertain nature of it's future. So my plead to the PHP project is: "Keep
`var` and promise to maintain it. There's no overhead and it's a nice little
keyword. And to everyone else, consider ditching `public` too!

I've written [a little fixer][3] for [php-cs-fixer][4] that automatically
removes it for you. If you are able to recognize your biases and join me,
I guarantee that it won't take you long to be happy you made this change! 

[1]: https://wiki.php.net/rfc/var_deprecation
[2]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md "PSR-2"
[3]: https://github.com/fruux/sabre-cs/blob/master/lib/PublicVisibility.php
[4]: http://cs.sensiolabs.org/ "PHP CS Fixer"
