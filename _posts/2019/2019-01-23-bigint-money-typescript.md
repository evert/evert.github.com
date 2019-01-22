---
title: "bigint-money: an NPM package for doing math with money"
date: "2019-01-09 17:00:00 UTC"
tags:
  - math
  - money
  - javascript
  - bigint
  - typescript
---

Not long ago, I was [confused][1] about doing math with money and floating
point issues. After a bunch of research and help from friends I figured out
what many already did before me: Using floating points is indeed bad. You can
get rounding issues and really want to use 'precise math'.

After that, I realized I wanted to use the new Ecmascript [bigint][2] type as
a basis for representing money. This is supported by recent versions of Node.js
and Typescript, which is where I need it.

There's a problem though, the `bigint` type only holds 'whole numbers' and
doesn't do fixed-point decimal-math. I looked around on NPM for something that
would abstract this for me, but couldn't find a library.

So I spent a couple of days writing a simple npm library called `bigint-money`
that wraps the `bigint` type. It's written in Typescript and open-source so
it's here for anyone to use: <https://www.npmjs.com/package/bigint-money>.

Major features:

* Uses the the Ecmascript [bigint][2] type.
* Written in Typescript.
* Loosely follows [Martin Fowler's Money Type][3] from
 ["Patterns of Enterprise Application Architecture"][4].
* Faster than Money packages that use non-native bigdecimal libraries.
* All rounding is done via the ["Bankers Rounding"][6] (a.k.a. "round
  half to even").
* Uses 12 decimals for any calculations.

Benchmark
---------

Most 'money' libraries on NPM only use 2 digits for precision, or use 
Javacript's "number" and will quickly overflow.

The only comparible library I found was [big-money][10]. It's probably
the best alternative if your Javascript environment doesn't have support
for `bigint` yet.

My simple benchmark calculates a ledger with 1 million entries.

```
        bigint-money  |   big-money
ledger       816 ms   |   43.201 ms
%            100 %    |     5294 %
```

The benchmark script can be found in the [repository][8].

I want to stress though that I can't take credit for this (pretty good) result.
The library is fast because `bigint` is fast.

I did need to implement a few functions myself, and I actually feel that
somebody who's better at writing fast code could probably do a much better job
than I did.

I imagine that specifically the `moneyValueToBigInt` and `bigintToFixed` intenral
functions could probably be optimized by someone much smarter than me.


Examples
--------

This is how it generally works:

```typescript
// Creating a money object.

import Money from 'bigint-money';
const foo = new Money('5', 'USD');
```

It's possible to create a new money object with a Number as well

```typescript
const foo = new Money(5, 'USD');
```

However, if you pass it a number that's 'unsafe' such as a float, an error will be thrown:

```typescript
const foo = new Money(.5, 'USD');
// UnsafeIntegerException
```

Once you have a Money object, you can use `toFixed()` to output a string.

```typescript
const foo = new Money('5', 'USD');
console.log(foo.toFixed(2)); // 5.00
```

Arithmetic
----------

You can use `.add()` and `.subtract()` on it:

```typescript
const foo = new Money('5', 'USD');
const bar = foo.add('10');
```

All Money objects are immutable. Calling those functions does not change the original value:

```typescript
console.log(foo.toFixed(2), bar.toFixed(2));
// 5.00 1.00
```

You can also pass Money objects to subtract and add:

```typescript
const startBalance = new Money(1000, 'USD');
const salary = new Money(2000, 'USD');
const newBalance = startBalance.add(salary);
```

If you try to add money from different currencies, an error will be thrown:

```typescript
new Money(1000, 'USD').add( new Money( 50000, 'YEN' ));
// IncompatibleCurencyError
```

Division and multiplication:

```typescript
// Division
const result = new Money(10).divide(3);
 
// Multiplication
const result = new Money('2000').multiply('1.25');
```

Comparing objects
-----------------

Right now the Money object has a single function for comparison.

```typescript
const money1 = new Money('1.00', 'EUR');
 
money.compare(2); // Returns -1
money.compare(1); // Returns 0
money.compare(0); // Returns 1
 
money.compare('0.01'); // returns -1
money.compare(new Money('1.000005', 'EUR')); // returns 1
 
money.compare(new Money('1', 'CAD')); // throws IncompatibleCurrencyError
```

The idea is that if the object is smaller than the passed one, -1 returned. 0 is returned if they're equal and 1 is returned if the passed value is higher.

This makes it easy to sort:

```typescript
const values = [
  new Money('1', 'USD'),
  new Money('2', 'USD')
];

values.sort( (a, b) => a.compare(b) );
```

Allocate
--------

When splitting money equal parts, it might be possible to lose a penny. For example, when dividing $1 between 3 people, each person gets $ 0.33 but there's a spare $ 0.01.

The allocate function splits a Money value in even parts, but the remainder is distributed over the parts round-robin.

```typescript
const earnings = new Money(100, 'USD');
 
console.log(
  earnings.allocate(3, 2);
);
 
// Results in 3 Money objects:
//   33.34
//   33.33
//   33.33
```

Splitting debts (negative values) also works as expected.

The second argument of the allocate function is the precision. Basically the number of digits you are interested in.

For USD and most currencies this is 2. It's required to pass this argument because the Money object can't guess the desired precision.


Installation
-----------

Just run

```sh
npm i bigint-money
```


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

[1]: /currencies-floats/
[2]: https://github.com/tc39/proposal-bigint
[3]: https://martinfowler.com/eaaCatalog/money.html
[4]: https://amzn.to/2EezezD "Note: affiliate link"
[5]: https://caniuse.com/#search=bigint
[6]: http://wiki.c2.com/?BankersRounding
[7]: https://github.com/evert/bigint-money/tree/master/bench
[8]: about:blank
[9]: https://github.com/evert/evert.github.com/blob/master/_posts/2019/2019-01-23-bigint-money-typescript.md
[10]: https://www.npmjs.com/package/big-money
