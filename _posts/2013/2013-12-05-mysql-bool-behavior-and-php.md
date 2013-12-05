---
date: 2013-12-05 06:52:14 UTC
layout: post
title: "MySQL 5.6 BOOL behavior when using PDO and prepared statements"
tags:
  - mysql
  - pdo
  - php

---

I recently updated my workstation to run MySQL 5.6.13. It didn't take very
long for things to start breaking, and since I couldn't find any other
information about this on the web, I figured this may be useful to someone
else.

The main error that started popping up was:

```
Fatal error: Uncaught exception 'PDOException' with message 'SQLSTATE[HY000]: General error: 1366 Incorrect integer value: '' for column 'my_bool' at row 1' in test.php
```

This exception happens under the condition that you use [PDO][1], prepared
statements and booleans.

The easiest way to replicate this, is as follows:

```php
<?php

$pdo = new PDO('mysql:host=localhost;dbname=test','root');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec(<<<SQL
CREATE TEMPORARY TABLE foo (
   my_bool BOOLEAN
)
SQL
);

$stmt = $pdo->prepare('INSERT INTO foo (my_bool) VALUES (?)');
$stmt->execute([false]);

?>
```

What we are doing here, is inserting a new record in the `foo` table. The
`foo` table has a field `my_bool` that's a `BOOLEAN`. Note that this is also
true for `BOOL` or `TINYINT(1)`.

We use ->execute to supply the value for the bound parameter, but this should
work just the same with `bindValue`.

The way prepared statements are implemented in PDO for MySQL, is that by
default every value is cast to a string.

So at one point this will result in the following query:

```sql
INSERT INTO foo (my_bool) VALUES ('')
```

Which was valid for MySQL versions before 5.6. Now this throws an error.

There are two relatively easy solutions. You must either switch to integers
(0 and 1), or use `bindValue` and explicitly supply a type.

```php
<?php

// So either:
$stmt = $pdo->prepare('INSERT INTO foo (my_bool) VALUES (?)');
$stmt->execute([0]);

// Or:
$stmt = $pdo->prepare('INSERT INTO foo (my_bool) VALUES (?)');
$stmt->bindValue(1, false, PDO::PARAM_BOOL); // 1st param gets value false.
$stmt->execute();

?>
```

Now the second example may seem like quite a convoluted fix if you just want to
insert a boolean, but if you have some kind of database abstraction layer,
this may make more sense instead of converting every boolean to an integer
first. Whatever floats your boat.

An aside on the LIMIT clause
----------------------------

Often the question comes up why it's not possible to use bound parameters in
conjuction with LIMIT, such as this:

```php
<?php

$stmt = $pdo->prepare('SELECT from FOO LIMIT ?, ?');
$stmt->execute([15,5]);

?>
```

The cause for this is the same, by default PDO will treat every parameter as
a string, resulting in this query:

```sql
SELECT from FOO LIMIT '15', '5'
```

Normally when you are inserting integers, or adding where clauses based on
integers, surrounding these with quotes works without issue. This is not the
case for the LIMIT clause, which is why this is happening.

This always works though:

```php
<?php

$stmt = $pdo->prepare('SELECT from FOO LIMIT ?, ?');
$stmt->bindValue(1, 15, PDO::PARAM_INT); // 1st param gets value 15
$stmt->bindValue(2, 5, PDO::PARAM_INT); // 2nd param gets value 5
$stmt->execute();

?>
```

Why the choice was made in PDO to default every value to string beats me, I
feel that it would be much more sensible to automatically map PHP types to
MySQL types.

Update: STRICT_TRANS_TABLES
---------------------------

Morgan Tocker points out in the comments that this is due to a new default
configuration value: `STRICT_TRANS_TABLES`.

Disabling this will get you the old behavior back. Dynom mentions that it
may not be a bad idea regardless to keep this on, as well as a few other
settings to let MySQL behave more strictly.

[1]: http://php.net/manual/en/book.pdo.php
