---
title: "MySQL examples in Node.js"
date: "2019-01-09 17:00:00 UTC"
tags:
  - node
  - mysql
geo: [43.647805,-79.389551]
location: Adelaide St West, Toronto, ON, CAnada
---

If you're integrating your Node.js service with MySQL, you probably want to
execute queries.

I've seen a fair bit of ugly code to do this, often using callbacks. I thought
I would share some of my own patterns here. Maybe this is useful to others
to read.

I don't typically use ORM's. If you're already happy with [sequalize][1],
this article is probably not for you.

Prequisites
-----------

The most popular NPM package for MySQL is [mysql][2], but I use the
[mysql2][3] package instead.

The `mysql2` package is also very popular, but has a few advantages.
The advantage I care about is support for promises. The authors of this
package have actually teamed up with the authors of the `mysql` package to
reduce double efforts, and was made to be compatible with `mysql` so for many
people it's a drop-in replacement.

Creating a pool
---------------

```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

A pool manages multiple connections. I create a pool once per node.js server.

Note: if you are migrating from the `mysql` to `mysql2` package, you probably
don't want to require `mysql2/promise`. You can instead require `mysql2` to get
full backwards compatibility and use the `promise()` functions to get access
to promisified versions of the APIs.

Note2: `mysql2` uses the `utf8mb4` charset by default. If you don't know what
this means trust that it's the right choice. If you do know what this is,
rejoice that somebody finally picked a sane default.


Executing a `SELECT` query
--------------------------

Generally I don't need transactions for `SELECT` queries, because of this I
can simply ask the pool to execute the query.

```javascript
async function getBlogPost(id) {

  const result = await pool.query('SELECT * from posts WHERE id = ?', [id]);
  if (!result[0].length < 1) {
    throw new Error('Post with this id was not found');
  }
  return result[0][0];

}
```

`result[0][0]` looks a bit weird, this is because the result of the query
returns a tuple (array) with 2 items. The first item has the result of the
query, and the second has the meta data. This subtle decision is my #1
complaint about the library because it makes a lot of things slightly uglier
than they need to be.

So if we want just the first record of the result, you can access it with
`result[0][0]`.

Whenever I write a function that should return exactly 1 item, I will either
return an item or throw an error. I don't return `undefined` or `null`.

A `SELECT` query that returns multiple records is more elegant:


```javascript
async function getAllBlogPost() {

  const result = await pool.query('SELECT * from posts');
  return result[0];

}
```

Whenever I write a function that returns 0 or more items, this function
always returns an array with 0 or more items. If the collection is empty,
I return an empty array.

Note: sometimes there is a distinction between an empty collection or a
collection not existing. If that distinction exists, I do throw an error
in the latter case.


Executing an `INSERT` query
---------------------------

Generally when doing `INSERT` queries, most people use the following syntax:

```sql
INSERT INTO posts (title, body) VALUES (?, ?)
```

MySQL also has a second system for inserting that is less popular, and looks
more like an `UPDATE` statement:

```sql
INSERT INTO posts SET title = ?, body = ?
```

The second syntax is the one I use. A big advantage is that the 'value' is
close to the name of the field. If you ever had to count questionmarks, you
know why this is nice.

Naively you can execute this query as follows:


```javascript
async function insertPost(title, body) {

  await pool.query(
    'INSERT INTO posts SET title = ?, body = ?',
    [ title, body ]
  );

}
```

But there is a nicer way to do this:


```javascript
async function insertPost(title, body) {

  await pool.query(
    'INSERT INTO posts SET ?',
    { title, body }
  );

}
```

If you are used to MySQL prepared statements, you might wonder why does this
work?

The reason is that the placeholder `?` gets special treatement when you pass
objects or arrays to it.

Specifically, if you pass an array like this:

```javascript
['foo', 'bar']
```

It expands to

```sql
'foo', 'bar'
```

And objects such as this:

```sql
{ foo: 'bar', gaz: 'zim' }
```

Expand to:

```sql
`foo` = 'bar', `gaz` = 'zim`
```

Here's another neat example of this:

```javascript
async function getByCategoryIds(ids) {

  // Pretends ids is [1, 2]
  const result = await pool.query(
    'SELECT * from posts WHERE category_id IN (?)',
    [ids],
  );
  return result[0];

}
```

This actually works. If you are well versed with how MySQL works you might
scream at this point: "This doesn't use real prepared statements", and you
would be right.

Prepared statements
-------------------

Both the `mysql` and `mysql2` package by default emulate prepared statements
client-side. A lot of people feel that this is a really bad security practice.

I disagree, and might write about that in another article at one point. Ask
most security experts though and they'll tell you this is bad.

To do a real prepared statements, you have to use the `execute()` function:

```javascript
async function insertPost(title, body) {

  await pool.execute(
    'INSERT INTO posts SET title = ?, body = ?',
    [ title, body ]
  );

}
```

This uses _real_ MySQL prepared statements, but unfortunately doesn't let you
work with arrays and objects.


Running multiple queries on a single connection
-----------------------------------------------

Every time you call `.query()` or `.execute()`, you might get a new connection
from the pool. Sometimes it's a good idea to use the same connection if you do
multiple queries.

One reason might be that you have multiple replicated MySQL servers and you
want to ensure that you're running the queries on the same machine with the
same state.

To do this, you need to grab a connection from the pool, and release it once
you're done.

The ideal pattern for me looks like this:

```javascript
async function batchingThings() {

  const connection = await pool.getConnection();
  try {

    await connection.query('...');
    await connection.query('...');

  } finally {

    connection.release();

  }

}
```

Remember that if you run multiple queries on a single connection they must
be serialized. They must not be parallel.


Transactions
------------

If you run multiple queries that change the state of the database, it's
often a very good idea to have them all succeed or fail as a group.

Transactions are used for that. After a transaction has started its possible
to roll back every query since the start of the transaction.

The pattern I use for this is similar to the last, but a bit more complex:


```javascript
async function batchingThings() {

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {

    await connection.query('...');
    await connection.query('...');

    await connection.commit();

  } catch (err) {

    await connection.rollback();
    // Throw the error again so others can catch it.
    throw err;

  } finally {

    connection.release();

  }

}
```

If my transaction code becomes too complex and I need to split it up
over multiple functions, I pass the `connection` object around as the argument.

Typescript everything
---------------------

I wanted my examples to be accessible, but all my code is written in Typescript.
Every MySQL table row has its own type and I'm as strict as I can.

This is a really good idea. If there's interest, I can write another post with
typescript and mysql2 examples.


Questions / comments?
---------------------

1. You can reply to [this tweet][8] to automatically see your response here.
2. If you're a dev, you can also send a [pull request][9] and edit in your
   comment in this article.

<!--

If you're writing a pull request, add you contribution above this
text.

Example template:

[Name](https://example/yourwebsite) on Feb 1st, 2018
> I disagree with this article because you're a bad person

But also feel free to be creative!
-->

[1]: https://www.npmjs.com/package/sequelize
[2]: https://www.npmjs.com/package/mysql
[3]: https://www.npmjs.com/package/mysql2
[8]: https://twitter.com/evertp/status/1083062254025822209
[9]: https://github.com/evert/evert.github.com/blob/master/_posts/2019/2019-01-10-executing-a-mysql-query-in-nodejs.md
