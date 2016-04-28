---
date: 2016-04-28 15:56:19 +0700 
layout: post
title: "Writing SQL that works on PostgreSQL, MySQL and SQLite"
tags:
   - sql
   - postgresql
   - mysql
   - sqlite
   - php
---

I am one of those crazy people who attempts to write SQL that works on
[SQlite][1], [MySQL][2] and [PostgreSQL][3]. First I should explain why:

This is all for my project [sabre/dav][4]. sabre/dav is a server for CalDAV,
CardDAV and WebDAV. One of the big design goals is that it this project has to
be a library first, and should be easily integratable into existing
applications.

To do this effectively, it's important that it's largely agnostic to the host
platform, and one of the best ways (in my opinion) to achieve that is to have
as little dependencies as possible. Adding dependencies such as [Doctrine][5]
is a great idea for applications or more opinionated frameworks, but for
sabre/dav lightweight is key, and I need people to be able to understand the
extension points fairly easily, without requiring them to familiarize them
with the details of the dependency graph.

So while you are completely free to choose to add Doctrine or [Propel][6]
yourself, the core adapters (wich function both as a default implementation
and as samples for writing your own), all only depend on an instance of
[PDO][7].

The nice thing is that ORMs such as Doctrine and Propel, you can get access
to the underlying PDO connection object and pass that, thus reusing your
existing configuration.

For the longest time we only supported SQLite and MySQL, but I'm now working
on adding PostgreSQL support. So I figured, I might as well write down my
notes.


But how feasable is it to write SQL that works everywhere?
----------------------------------------------------------

Well, it turns out that this is actually not super easy. There is such as
thing as [Standard SQL][8], but all of these databases have many of their
own extensions and deviations.

The most important thing is that this will likely only work well for you if
you have a very simple schema and simple queries.

Well, this blog post is not intended as a full guide, I'm just listing the
particular things I've ran into. If you have your own, you can [edit this blog
post][9] on github, or leave a comment.


### My approach

* I try to keep my queries as simple as possible.
* If I can rewrite a query to work on every database, that query will have the
  preference.
* I avoid stored procedures, triggers, functions, views. I'm really just
  dealing with tables and indexes.
* Even if that means that it's not the most optimal query. So I'm ok with
  sarcrificing some performance, if that means my queries can stay generic,
  within reason.
* If there's no possible way to do things in a generic way, I fall back on
  something like this:

    <?php

    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql') {

        $query = "...";

    } else {

        $query = "...';

    }

    $stmt = $pdo->prepare($query);


    ?>


### DDL

First there is the "Data Definition Language" and "Data Manipulation Language"
the former is used for queries starting with `CREATE`, `ALTER`, `DROP`, etc,
and the latter `SELECT`, `UPDATE`, `DELETE`, `INSERT`.

There really is no sane way to generalize your `CREATE TABLE` queries, as the
types and syntax are vastly different.

So for those we have a [set of .sql files][10] for every server.

### Quoting

In MySQL and SQlite you can use either quotes `'` or double quotes `"` to wrap
a string.

In PostgreSQL, you always have to use single quotes `'`.

In MySQL and SQLite you use backticks for identifiers. PostgreSQL uses single
quotes. SQlite can also use single quotes here if the result is unambigious,
but I would strongly suggest to avoid that.

This means that this MySQL query:

    SELECT * FROM `foo` WHERE `a` = "b"

is equivalent to this PostgreSQl query:

    SELECT * FROM 'foo' WHERE "a" = 'b'

Luckily you can often just write this query, which works for all databases:

    SELECT * FROM foo WHERE a = 'b'

But keep in mind that when you create your tables, using double quotes will
cause PostgreSQL to retain the upper/lower case characters. If you do not use
quotes, it will normalize everything to lower case.

For compatibility I would therefore suggest to make sure that all your table
and column names are in lower case.


### REPLACE INTO

The `REPLACE INTO` is a useful extension that is supported by both SQLite and
MySQL. The syntax is identical `INSERT INTO`, except that if it runs into a
key conflict, it will overwrite the existing record instead of inserting a new
one.

So `REPLACE INTO` basically either updates or inserts a new record.

This works on both SQLite and MySQL, but not PostgreSQL. Since version 9.5
PostgreSQL gained a new feature that allows you to achieve the same effect.

This statement from MySQL or SQLite:

    REPLACE INTO blog (uuid, title) VALUES (:uuid, :title)

then might become something like this in PostgreSQL:

    INSERT INTO blog (uuid, title) VALUES (:uuid, :title)
    ON CONFLICT (uuid) DO UPDATE SET title = :title

So the major difference here is with PostgreSQL we specifically have to tell
it which key conflict we're handling (`uuid`) and what to do in that case
(`UPDATE`). 

In addition to `REPLACE INTO`, MySQL also has this syntax to do the same thing:

    INSERT INTO blog (uuid, title) VALUES (:uuid, :title)
    ON DUPLICATE KEY UPDATE title = :title 

But as far as I know SQLite does not have a direct equivalent.

### BLOB

SQLite and MySQL have a `BLOB` type. This type is used for storing data as-is.
Whatever (binary) string you store, you will retrieve again and no conversion
is attempted for different character sets.

PostgreSQL has two types that have a similar purpose: [Large Objects][11] and
the [bytea][12] type.

The best way to describe large objects, is that they are stored 'separate' from
the table, and instead of inserting the object itself, you store a reference to
the object (in the form of an id).

`bytea` is more similar to `BLOB`, so I opted to use that. But there are some
differences.

First, if you do a select such as this:

    <?php

        $stmt = $pdo->prepare('SELECT myblob FROM binaries WHERE id = :id');
        $stmt->execute(['id' => $id]);
        
        echo $stmt->fetchColumn();

    ?>

On MySQL and Sqlite this will just work. The `myblob` field is represented as
a string.

On PostgreSQL, `byta` is represented as a PHP stream. So you might have to
rewrite that last statement as:

    <?php

        echo stream_get_contents($stmt->fetchColumn());

    ?>

Or:

    <?php

        stream_copy_to_stream($stmt->fetchColumn(), STDOUT);

    ?>

Luckily in sabre/dav we pretty much support streams where we also support
strings, so we were already agnositic to this, but some unittests had to be
adjusted.

Inserting `bytea` is also a bit different. I'm not a fan of of using
[`PDOStatement::bindValue`][13] and [`PDOStatement::bindParam`][14], instead
I prefer to just send all my bound parameters at once using `execute`:

    <?php

        $stmt = $pdo->prepare('INSERT INTO binaries (myblob) (:myblob)');
        $stmt->execute([
            'myblob' => $blob
        ]);

    ?>

This doesn't work in PostgreSQL. Instead you must do:

    <?php

        $stmt = $pdo->prepare('INSERT INTO binaries (myblob) (:myblob)');
        $stmt->bindParam('myblob', $blob, PDO::PARAM_LOB);
        $stmt->execute();

    ?>

Luckily this also works in SQlite and MySQL.


### String concatenation

Standard SQL has a string concatenation operator. It works like this:

    SELECT 'foo' || bar'
    // Output: foobar

This works in PostgreSQL and Sqlite. MySQL has a function for this:

    SELECT CONCAT('foo', 'bar')

PostgreSQL also has this function, but SQLite does not. You can enable Standard
SQL concatenation in MySQL by enabling it:

    SET SESSION sql_mode = 'PIPES_AS_CONCAT'

I'm not sure why this isn't the default.


### Last insert ID

The `PDO` object has a `lastInsertId()` function. For SQLite and MySQL you can
just call it as such:

    <?php

        $id = $pdo->lastInsertId();

    ?>

However, PostgreSQL requires an explicit sequence identifier. By default this
follows the format `tablename_idfield_seq`, so we might specifiy as this:

    <?php

        $id = $pdo->lastInsertId('articles_id_seq');

    ?>

Luckily the parameter gets ignored by SQLite and MySQL, so we can just specify
it all the time.


### Type casting

If you have an `INT` field (or similar) and you access it in this way:

    <?php

        $result = $pdo->query('SELECT id FROM articles');
        $id = $result->fetchColumn();

    ?>

With PostgreSQL `$id` will actually have the type `INT`. In MySQL and SQlite
everything is a string though, which is unfortunate.

The sane thing to do is to cast everything to int after the fact, so you can
correctly do PHP 7 strict typing with these in the future.


Testing
-------

I unittest my database code. Yep, you read that right! I'm one of those people.
It's been tremendously useful.

Since adding PostgreSQL I was able to come up with a nice structure. Every
unittest that does something with PDO now generally looks like this:

```php
<?php

abstract PDOTest extends \PHPUnit_Framework_TestCase {

    abstract function getPDO();

    /** all the unittests go here **/

}
```

Then I create one subclass for PostgreSQL, Sqlite and MySQL that each only
implement the `getPDO()` function.

This way all my tests are repeated for each driver.

I've also rigged up [Travis CI][16] to have a MySQL and a PostgreSQL database
server running, so everything automatically gets checked every time.

If a developer is testing locally, we detect if a database server is running,
and automatically just skip the tests if this was not the case. In most cases
this means only the Sqlite tests get hit, which is fine. 


Conclusions
-----------

1. Created a monster.
2. PostgreSQL is by far the sanest database, and I would recommend everyone to
  move from MySQL towards it. 



[1]: https://www.sqlite.org/
[2]: https://www.mysql.com/
[3]: http://www.postgresql.org/ 
[4]: http://sabre.io/dav/ "sabre/dav"
[5]: http://www.doctrine-project.org/ "Doctrine project"
[6]: http://propelorm.org/ "Propel ORM"
[7]: http://ca2.php.net/manual/en/book.pdo.php "PHP PDO documentation"
[8]: https://en.wikipedia.org/wiki/SQL-92 "SQL-92"
[9]:
[10]: https://github.com/fruux/sabre-dav/tree/master/examples/sql "sabre/dav sql samples"
[11]: http://www.postgresql.org/docs/9.5/static/largeobjects.html "PostgreSQL large objects"
[12]: http://www.postgresql.org/docs/9.5/static/datatype-binary.html "PostgreSQL byeta type"
[13]: http://php.net/manual/en/pdostatement.bindvalue.php "PDOStatement::bindValue"
[14]: http://php.net/manual/en/pdostatement.bindparam.php "PDOStatement::bindParam"
[15]: http://php.net/manual/en/pdo.lastinsertid.php
[16]: https://travis-ci.org/
