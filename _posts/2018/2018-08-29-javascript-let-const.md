---
title: "Use 'let' and 'const' instead of `var`"
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
  helps with spotting bugs and makes your code more strict.
* `const` prevents variable re-use.

Unless you are targetting older environments, there's no need anymore to use
`var`.

But the reason I'm writing this post is because I often see `let` used where
`const` is more appropriate.

`const` stands for "constant". In a lot of sources, I see that interpreted as
something that should never change, maybe even something that should be
declared as uppercase:

    /* I declare a constant! */
    const MY_MAGIC_VALUE = 5;

However, `const` really should be your default for most cases. Take the
following examples:

```javascript
const user = {};
user.firstName = 'Evert';
user.lastName = 'Pot';

const users = [];
users.push(user);

for(const item of users) {

  console.log(user);

}

return users;
```

In most of the sources I see, all the above `const` uses typically use `let`.
Despite that we are 'changing' the contents of our variables above, `const`
actually does work here.

The reason for this is that if you create an array or object with `const`, you
can still change it's contents. `const` only prevents re-assigning, it doesn't
make the entire object immutable.

Same for the array. Even though I'm adding something to the array, the identity
of the array remains the same. `const` works.

In the case for the `for` loop. Every iteration of the loop is a new
'block scope', so I am in fact able to re-create a new constant for every
iteration.

It's useful to use `const` instead of `let`, because it prevents you from
accidentally overwriting variables. So a good rule of thumb is:

1. Stop using `var`.
2. Use `const` by default, everywhere.
3. Use `let` if you must.

And there certainly are cases where `let` is needed. For example:

```javascript
let x = 5;
x++;
```

The above example does not work `const`, because we're really redefining `x`.

If this is confusing, the following example might help:

```javascript
let x = 5;
let y = x;

x++;
```

In the above example, we change `x`, but `y` remained independently 5. This
is because the `x++` operation actually is a shortcut for `x = x + 1`, which
redefines x to its new value.

Now an example with objects:

```javascript
const x = [1, 2];
const y = x;

x.push(3);
```

After this script, both `x` and `y` contain `[1, 2, 3]`. Both variables refer
to the same value. We change the value, not the reference.

In contrast, this _will_ throw an error:

```javascript
const x = [1, 2, 3];
const y = x;
const x = x.slice(1);
```

Here we re-define `x`, and javascript doesn't allow this. If we used `let`
instead, only `x` would have changed but `y` would not.

[1]: https://caniuse.com/#search=let
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting
