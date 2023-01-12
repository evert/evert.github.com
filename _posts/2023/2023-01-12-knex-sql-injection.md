---
title: "Knex + MySQL had a very scary SQL injection"
date: "2023-01-12 21:31:43 UTC"
geo: [43.686510, -79.328419]
location: "East York, ON, Canada"
tags:
  - node
  - knex
  - sql
  - security
  - mysql
---

[Knex][4] recently released a new version this week (2.4.0). Before this version,
Knex had a pretty scary SQL injection. Knex currently has 1.3 million weekly
downloads and is quite popular.

The security bug is probably one of the worst SQL injections I've seen in recent
memory, especially considering the scope and popularily.

If you want to get straight to the details:

* [Check out the Github issue][1], which was opened 7 years ago(!)
* [An article from Ghostccamm][2] explaining the vulnerability.
* [CVE-2016-20018][3].

## My understanding of this bug

If I understand the vulnerability correctly, I feel this can impact a very
large number of sites using Knex. Even more so if you use Express.

I'll try to explain through a simple example. Say, you have MySQL table structured
like this:

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
)
```

And you have a query that does a `SELECT` using Knex:

```javascript
const lookupId = 2;

const result = await knex('users')
  .select(['id', 'name'])
  .where({
    id: lookupId
  });
```

You'd expect the query to end up roughly like this

```sql
SELECT `id`, `name` FROM `users` WHERE `id` = 2
```

The issue is when the user controls the value of `lookupId`. If somehow they
can turn this into an object like this:

```javascript
const lookupId = {
  name: 'foo'
}
```

You might expect an error from Knex, but instead it generates the following query:

```sql
SELECT `id`, `name` FROM `users` WHERE `id` = `name` = 'foo'
```

This query is not invalid. I don't fully understand fully understand MySQL's behavior,
but it causes the WHERE clause to be ignored and the result is equivalent to:

```sql
SELECT `id`, `name` FROM `users`
```

I think it has something to do with how MySQL casts things. In MySQL this yields `true` (or `1`):

```sql
SELECT 1 = 'foo' = 'bar'
```

## Query strings and Express

One place where this is especially scary, is if `lookupId` was provided by a user,
via a JSON body or query string.

Consider this example from an Express route:

```javascript
app.get('/', async (req, res) => {
  const result = await knex('users')
    .select(['id', 'name'])
     .where({id: req.query.id});

  res.send(result)
})
```

Here the `id` in the `WHERE` clause is provided by the URL query string:

If a the server is opened with something like:

```
http://localhost:3000/?id=2
```

It will return a single user, but if it was opened using:


```
http://localhost:3000/?id%5Bname%5D=foo
```

It will return _every user_. And this issue is not limited to `SELECT`,
it could also trigger in a `WHERE` clause in `DELETE`.

The reason this works is that by crafting URL query parameters in a special
way, a user can have things in `req.query` show up as objects or arrays.

Express calls this the 'extended' syntax and turns it on by default. In my
opinion this is a bad default because it's not really what users expect will
happen. PHP does this as well, and I believe this may have been where Express
(or specifically the [qs][6] library) got the syntax from.

This is why I think Express users are expecially likely to be vulnerable.
I think that most developers in professional settings are decent at
validating JSON request bodies with a variety of tools, but I've noticed
this is often not the case for query parameters. I believe a big reason for
this is that the 'extended' syntax is not well known and 'surprising' behavior.
Many people assume these are just strings. This is not intended as a plug,
but this is also why the default behavior in our [Curveball framework][7] is
to not support this. In most cases it's not needed, and if you do want it you can
use `qs` and explicitly opt-in.

Other examples
--------------

But of course, this issue is not limited to query strings. If you're not
validating input somewhere and this ends up in a `.where()` statement there's
risk.

A specific example is a situation where part of the contents of your `WHERE`
clause is unguessable.

For instance, say you had a database table with records that users can only
see if they know a secret code, and it's selected with:

```sql
SELECT * FROM coupons WHERE product_id = 5 AND coupon_code = 'BIG_OOF2023'
```

A user presumably would have to *know* the `coupon_code` to see the coupons,
but if there's no code to validate `coupon_code` is a string, a user would have the
power to change the query to this:

```sql
SELECT * FROM coupons WHERE product_id = 5 AND coupon_code = product_id = 'bla'
```

Which is equivalent to:

```sql
SELECT * FROM coupons WHERE product_id = 5
```

And thus no longer requiring coupon codes to get ALL the discounts.

Lastly, if you can rewrite a query that expects 1 result to return every
record in a database is also an easy way to call a [Denial of service][10] attack.


This does demonstrate again how is critical validating is and throw errors
whenever you get data you don't expect. Even if under normal circumstances
nothing weird can happen, a library you use might do the wrong thing with
unexpected data instead of just rejecting it.

On Knex
-------

It's quite unfortunate to see that this went unpatched for so long. I'd
invite anyone reading this to try to not pile on on the (likely volunteer)
authors but think about the larger ecosystem.

This bug was hidden in plain sight. Lots of people must have randomly
ran into it and a ticket was opened. Probably the most responsible thing to
do would have been what [@rgmz][8] did: do their best to contact the authors,
failing that contact Github Security Team. After the Github Security Team also
weren't able to connect to the authors, make a CVE which puts this on every
everyone's radar. This ultimately led to a random bystander make their first
contribution and [submit a fix][9].

Knex feels high risk now though, and I can't help wondering what else might
be unpatched. I've only recently made the jump from just writing my own queries
for like 20 years to Knex, but I'm probably reversing that decision for my
next project.

[1]: https://github.com/knex/knex/issues/1227
[2]: https://www.ghostccamm.com/blog/knex_sqli/
[3]: https://nvd.nist.gov/vuln/detail/CVE-2016-20018
[4]: https://knexjs.org/
[5]: https://expressjs.com/
[6]: https://www.npmjs.com/package/qs
[7]: https://curveballjs.org/
[8]: https://github.com/knex/knex/issues/1227#issuecomment-1358165470
[9]: https://github.com/knex/knex/pull/5417
[10]: https://en.wikipedia.org/wiki/Denial-of-service_attack
