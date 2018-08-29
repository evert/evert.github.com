---
title: "Use 'let' and 'const' instead of 'var'"
date: 2018-08-29 17:32:22 +0200
tags:
  - javascript
location: Nijega, NL
---

If you are writing javascript code for Node.js, Babel, Typescript or if you can
target up-to-date browsers, chances are that your environment supports the `let`
and `const` keywords.

If this is the case, you should stop using `var` and use `let` and `const`
exclusively. Here's why:

* `var` uses something called 'hoisting', which can lead to unexpected results.
* `let` and `const` are both block-scoped. Which means you can declare them in
  `for` loop or `if` statement, and they will only be valid for that block. This
  helps with spotting bugs and makes your code more robust.
* `const` prevents variable re-assignment.

Unless you are targetting older environments, there's no need anymore to use
`var`.

But the reason I'm writing this post is because I often see `let` used where
`const` is more appropriate.

When to use `const`
-------------------

`const` stands for "constant". In a lot of sources, I see that interpreted as
something that should never change, maybe even something that should be
declared as uppercase:

```javascript
/* Hear ye, Hear ye! I declare a constant! */
const MY_MAGIC_VALUE = 5;
```

However, `const` really should be your default for most cases. Take the
following examples:


```javascript
const user = {};
user.firstName = 'Evert';
user.lastName = 'Pot';
```

When you create an object with `const`, you
can still change it's contents. `const` only prevents re-assigning, it doesn't
make the entire object immutable.

```javascript
const users = [];
users.push(user);
```

Same for the array. Even though I'm adding something to the array, the identity
of the array remains the same. `const` works.

```javascript
for(const item of users) {

  console.log(user);

}
```

In the case for the `for` loop. Every iteration of the loop is a new
'block scope', so I am in fact able to re-create a new constant for every
iteration.

It's useful to use `const` instead of `let`, because it prevents you from
accidentally overwriting variables. So a good rule of thumb is:

1. Stop using `var`.
2. Use `const` by default, everywhere.
3. Use `let` if you must.


When to use `let`
-----------------

There certainly are cases where `let` is needed. For example:

```javascript
let x = 5;
x++;
```

The above example does not work `const`, because we're really redefining `x`.
Under the hood javascript runs `x = x + 1`, which sets a new value (6) to `x`.

If this is confusing, the following example might help:

```javascript
let x = 5;
let y = x;

x++;

console.log(x, y); // output 6, 5
```

In the above example, we changed `x`, but `y` remained 5. This is because
`x++` re-assigns `x` to a new value, but the old value didn't change.

Contrast this with changing an object value:

```javascript
const x = [1, 2];
const y = x;

x.push(3);
```

After this script, both `x` and `y` contain `[1, 2, 3]`. Both variables refer
to the same value. We changed the value, but did not re-define the variable.

In contrast, this _will_ throw an error:

```javascript
const x = [1, 2, 3];
const y = x;
const x = x.slice(1);
```

Here we re-define `x`, and javascript doesn't allow this. If we used `let`
instead, only `x` would have changed but `y` would not.


But what if I want to declare a magic constant-like value in my source
----------------------------------------------------------------------

Have you considered SHOUTING?

```javascript
/* HEAR MY VOICE */
const MY_MAGIC_VALUE = 5;
```

[1]: https://caniuse.com/#search=let
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting
