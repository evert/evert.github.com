---
title: "Knex + MySQL has a very scary SQL injection"
date: "2023-01-12 05:00:00 UTC"
draft: true
tags:
  - node
  - knex
  - sql
  - security
  - mysql
---

[Knex][4] recently released a new version (2.4.0). Before this version, Knex had a
pretty scary SQL injection.

If you want to get straight to the details:

* [Check out the Github issue][1], which was opened 7 years ago(!)
* [An article from Ghostccamm][2] explaining the vulnerability.
* [CVE-2016-20018][3].

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
  .where({id: lookupId });
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

And I'm not sure why MySQL does this, but it causes the WHERE clause to be ignored
and the result is equivalent to:

```sql
SELECT `id`, `name` FROM `users`
```

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

If a the server is opened with something like:

```
http://localhost:3000/?id=2
```

It will return a single user, but if it was opened using:


```
http://localhost:3000/?id%5Bname%5D=foo'
```

The reason this works is that by crafting URL query parameters in a special
way, a user can have things in `req.query` show up as objects or arrays.

Express calls this the 'extended' syntax and turns it on by default. In my
opinion this is a bad default because it's not really what users expect will
happen. PHP does this as well, and I believe this may have been where Express
(or specifically the [qs][6] library]) got the syntax from.

This is why I think Express users are expecially likely to be vulnerable.
I think that most developers in professional settings are decent at 
validating JSON request bodies with a variety of tools, but I've noticed
this is often not the case for query parameters. I believe a big reason for
this is that the object syntax is not well known, and surprising behavior.
Many people assume these are just strings. This is not intended as a plug,
but this is also why the default behavior in our [Curveball][7] is to not
support this. In most cases it's not needed, and if you do want it you can
use `qs` and explicitly opt-in.

Of course anyone not validating input and making sure that they're really
getting integers or strings instead of objects and arrays are still vulnerable.

This does demonstrate again that validation is critical and throw errors
whenever you get data you don't expect. Even if under normal circumstances
nothing weird can happen, a library you use might do the wrong thing with
unexpected data instead of just rejecting it.


[1]: https://github.com/knex/knex/issues/1227
[2]: https://www.ghostccamm.com/blog/knex_sqli/
[3]: https://nvd.nist.gov/vuln/detail/CVE-2016-20018 
[4]: https://knexjs.org/
[5]: https://expressjs.com/
[6]: https://www.npmjs.com/package/qs 
[7]: https://curveballjs.org/
