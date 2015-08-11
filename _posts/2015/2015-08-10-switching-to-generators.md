---
date: 2015-08-10 12:22:22 -0400 
layout: post
title: "Save memory by switching to generators"
tags:
    - php
    - generators
    - iterators
    - featured
---

Since the release of PHP 5.5, we now have access to [generators][1].
Generators are a pretty cool language feature, and can allow you to
save quite a bit of memory if they are used in the right places.

To demonstrate, imagine that our model has a function that fetches
records from a database:

```php
<?php

function getArticles() {

   $articles = [];
   $result = $this->db->query('SELECT * FROM articles');

   while($record = $result->fetch(PDO::FETCH_ASSOC)) {

       $articles[] = $this->mapToObject($record);

   }

   return $articles;

}

?>
```

The preceding example is a fairly common pattern in CRUD application. In the
example, we're fetching a list of records from the database, and we apply
some function to the records before returning them.

Somewhere else in the application, this might be used like this in some view:

```php
<?php

foreach($model->getArticles() as $article) {

    echo "<li>", htmlspecialchars($article->title), "</li>";

}
?>

```

### The memory problem

If our `articles` table contains a lot of records, we're storing each one
of those in the `$articles` variable. This means that your "peak memory
usage" is dependent on how many records there are. For many smaller use-cases
this might not really be an issue, but sometimes you do have to work with
a lot of data.

It's not uncommon in complex applications for the result of a function like
our `getArticles` to be passed to multiple functions that mangle or modify
the data further.

Each of these functions tend to have a (foreach) loop and will grow in
memory usage as the amount of data goes up.

### Generators to the rescue

A generator allows you to return an 'array-like result' from a function, but
only return one record at a time.

It's possible to convert our `getArticles()` function to a generator
relatively easy. Here's our new function:

```php
<?php

function getArticles() {

   $result = $this->db->query('SELECT * FROM articles');

   while($record = $result->fetch(PDO::FETCH_ASSOC)) {

       yield $this->mapToObject($record);

   }

}

?>
```

As you can see from this, the function is actually shorter, and the
`$articles` variable no longer exists.

Our earlier "view" code does not need to be modified, this still works
exactly as-is:

```php
<?php

foreach($model->getArticles() as $article) {

    echo "<li>", htmlspecialchars($article->title), "</li>";

}
?>
```

The difference? Every time the `getArticles()` method 'generates' a new
record, the function effectively 'pauses', and for every iteration of the
`foreach` loop, the function is continued until it hits another `yield`.

### Things to look out for

The result of `getArticles()` now no longer returns an array, but it actually
returns an "iterator", which is an object.

Things like a foreach loop behave mostly the same, but not everything you can
do with an array, you can do on an iterator as well.

For instance, before we switched to generators, we would have been able to
access a specific record from `getArticles()` like this:

```php
<?php

$fifthArticle = $model->getArticles()[4];

?>
```

With generators you can no longer do this, and it will result in an error.
Switching to generators means that you must access the result in sequence.

### The big PHP fuck-up

Unfortunately, PHP also does not allow you to use the array traversal
functions on generators, including `array_filter`, `array_map`, etc.

You _can_ first convert the result of an iterator back into an array:

```php
<?php

$array = iterator_to_array(
    $model->getArticles()
);

?>
```

But, converting to an array defeats the point of using generators a little
bit.

To me, this is something that can instantly get added to the infamous
["fractal of bad design"][2] article. We've had generators since PHP 5.5,
iterators since PHP 5.0, and array_map since PHP 4.0, so PHP maintainers have
had over a decade to fix this shortcoming.

[1]: http://php.net/manual/en/language.generators.overview.php
[2]: http://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/
