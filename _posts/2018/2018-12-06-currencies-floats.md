---
title: "Floats and money"
date: "2018-12-06 19:24:57 UTC"
tags:
  - javascript
  - float
  - currency
location: "Adelaide St West, Toronto, ON, CA"
geo: [43.646645, -79.396766]
---

A very common and oft-repeated programmer's wisdom is "Don't use floats for
currency". This always made a lot of sense to me. The idea is that floats are
imprecise, due to the way they are stored.

Effectively floats are stored not by just their digits, but by a [formula][2].
This formula can't accurately represent every fraction. The most popular way
to demonstrate this is by firing up your Javascript developer console and run:

```
> 0.3 - 0.2
0.09999999999999998
```

The answer you'll get is not `0.1`, it's `0.09999999999999998`. According to
many, this is easy proof why floats are bad for money.

It's also not really something you want to put on an invoice. Some suggestions
to avoid floats include:

* Generally when dealing with money, use specialized data stores. MySQL for
  example has the [`DECIMAL`][3] field type.
* When serializing currency values, in for example JSON, pass them around as
  a string, not a number.

Another very common advice is, when doing math based on currency values just
forget about the floating point and count cents instead of Euros, Yen or
[Dollarydoos][4].

So instead of `$ 5.00`, you would simply multiply by 100 and use `500`, which
fits in an integer.

This is a pretty good way to deal with simple invoicing, where for the most
part you're just adding numbers.

Fractions
---------

With these wisdoms in hand I stepped into a problem that is a bit more complex.
I needed to do calculations with fractions for financial analysis.

I'll keep my example simple, but lets say that I needed to find out what 31%
of $498.09 is.

The result of this can't be expressed as a decimal number. On your JS console
it might look something like this:

    154.40789999999998

This is not just due to the fact that this is a floating point number, the
other is simply that this number can't be expressed without a fraction at all.
The 9's repeat infinitely.

But this led me to think, why do I really care about this really precise
number. The part I'm really interested in is `$154.41`, so I can just round
the result and get a string:

    > (input * 0.31).toFixed(2);
    '154.41'

For my purposes, this was the *right* answer. Money isn't expressed as
fractions (beyond cents), and it's rounded in a lot of situations.

This led me to my next realization. The `0.3 - 0.2` example was really a
strawman. I can just round it to get the number I really wanted:

    > (0.3 - 0.2).toFixed(2);
    '0.10'

This was the correct answer all along. The fact that we needed to first get
`0.09999999999999998` as an intermediate answer is kind of irrelevant, because
the difference is so little, and we would have to round anyway before display.

A better example
----------------

This last exercise just made me realize a few things:

* `0.3 - 0.2` is not a good example of why using floating points are bad.
  $0.00000000000000002 is not a significant difference.
* Unless you are comfortable writing your financial reports with formulas
  instead of numbers, rounding is unavoidable.
* Everybody rounds, regardless of the number system. If you use floating point
  math or fixed point math, you actually suffer from the exact same problem.

So I wanted to find out if there are examples where using floating-point math
does become an issue. Where are its limits?

One way I thought of thinking about this, is by trying to come up with a
formula where this $0.00000000000000002 difference compound into a dollar.
Just multiplying it by $10,000,000,000,000,000 doesn't seem reasonable,
because that number is (currently) too high to show up in a financial
calculation.

I had trouble finding good examples to demonstrate this issue, and I'm not
really smart enough to come up with an idea of my own. But even if I knew of
a great example one thought kept lingering: The inaccuracy
problem with floats also exists in other number systems that don't use
floats, such as base10 (fixed point) math. With fixed point math you
basically pick a precision (for example, 15 digits) and rounding errors beyond
that precision can also show up in certain complex calculations.


A few deductions
----------------

I don't know if this is correct, but it feels correct:

1. Floating point math and base10 (fixed point) math have similar problems
   with inaccuracies and rounding.
2. These problems show up for different calculations. The result of some
   calculations cannot be precisely expressed with floating point math, and
   the result of other calculations cannot be precisely expressed with
   fixed-point math.
3. I think people are more comfortable with fixed-point math, because it feels
   less surprising for simple calculations.
4. Rounding to the significant digits generally 'solves' this.


What I don't know is around what scales floating point math can yield
significant inaccurate results. It seems simpler to predict this with
fixed-point math.

I think this predictability makes people feel safer doing financial
calculations.

Using fixed point math in Javascript
------------------------------------

At the start of this article I mentioned the solution to just multiply
currencies by 100 and count cents. Realistically this is pretty useless
for anything moderately complex, because you limit your precision to 2
decimals.

If you feel that you have a use-case where multiplying by 100 is enough
precision, you are probably better off using floating points and simple
rounding.

To make fixed-point math work for more complex calculations, you'll need
more significant digits, and thus multiply by larger numbers than 100.
When researching this I [read a great article about math in COBOL][4],
which mentions that IBM's fixed point decimal type can take a maximum of 18
digits.

If we take 99 billion dollar as the maximum we want to be able to represent,
this means that of those 18 digits, we need 11 digits before and 7 digits
after the period.

This means that every dollar value has to be multiplied by 10<sup>7</sup>
(10,000,000,000).

It also means that the highest number we ever need is 10<sup>18</sup>.

This number is unfortunately is higher than Javascript's
[`MAX_SAFE_INTEGER`][7], which is 2<sup>53</sup> - 1.

When working with integers in Javascript above this `MAX_SAFE_INTEGER`,
Javascript will automatically convert to floating point numbers, which is what
we were trying to avoid.

How would you solve this?

Right now the established way is to use a library that handles this for you.
Some examples are:

* [decimal.js][8].
* [bignumber.js][9].

These types of libraries handle these limitations by (for example) saving
every digit of a large number separately in an array, and do a more 'manual'
work with arithmetic operations. For example, 100 might be stored as [1, 0, 0].

What's nice about these libraries is that they convert to and from strings
for your view layer and they remember where the (fixed) point in your number
is, so you don't have to divide by 10<sup>7</sup> before displaying them.

These libraries might be a bit slow though. Other programming languages might
have built-in features or native modules for this. PHP for example has a
[GMP][10] module. Java has [`java.math.BigDecimal`][11]. Python is the clear
winner here and just has transparent native support for arbitrary-size integers.


Ecmascript's bigint
-------------------

If you are running a new version of Firefox, Chrome or Node.js, you might
already have support for a new Javascript type: [bigint][12].

"bigint" is what it says on the tin, a type for big integers. These new numbers
don't automatically change to floats (or regular numbers) unless explicitly
asked to and don't have a maximum size, other than the limits of your
computer.

Fire up your console and try it out:

    > 2n ** 4018n
    345559293868361148033634086220357006310511518965634896
    781063867660175128163210875399825054057683275825569877
    366688103085859060257763900293951810763555135397260025
    513754935661856790168017882157679551094532977446472616
    042388243502396227453171398675239956933209718890900049
    505574416105487362960435374577513568425052733645175171
    906768737683088460692573004685433967970094147567776587
    968895982288887330931441539049188139650108989228586553
    935232570575822085182349014973765774199297568789676530
    263475320588045820967408959142772241203662510003840153
    216689755054872558169600469901596210120146006100009125
    686963654367743426461088529641862232649573994058654349
    928433398965809337177780993779838202644442347395592695
    424707614261233861675702825586749608541245212697821731
    388883399113457099839192961355454810013138358212990578
    801843850594265754972263518207657158345091261082252767
    041012083237074622662749814648746881195156284049648490
    077841431766658997246737814625191378320649854621233155
    380171485533227675173253997097680556286020862942055252
    836773511266514852999631351440845847321663378684304777
    829482829776191764290318406962537489950747560352629539
    406073440415550052435127500261152332947273952037770952
    8239494112463913222144n

Another interesting thing about these numbers is that they always round:

    > 5n / 2n
    2n

Using the bigint type is going to be a much faster than the npm libraries.
The only drawback is that the bigint doesn't have a decimal point, so I'm
forced to multiply every number by the precision I want. This will make my
code potentially harder to read.

But with all these nice new features, I still haven't found a satisfying
answer to my original question: under what conditions do floating point
numbers break down for financial calculations?

Disclaimer
----------

I was nervous publishing this, because some of the underlying technology and math
goes over my head. I can't really vouch for any of this being 100% accurate.


Comments
---------

[@psihius](https://github.com/psihius) says:

> The thing about this is that you do not run into this issue often when
> dealing with single invoice or calculation. Where the errors start to creep
> up is running calculations like calculating the amount of tax on all
> transactions. Or when you are dealing in wholesale businesses where the price
> of a unit can be a fraction of a cent. Or dealing with currency exchange
> rates - my personal experience - those are 5 digits, and you have to deal
> with the fact that a 1000 transactions can have an offset of a 1000 cents if
> handled wrong.

[@DaveCTurner](https://github.com/davecturner) says:

> > I needed to find out what 31% of $498.09 is... The result of this can’t be 
> > expressed as a decimal number.
> 31% of $498.09 is $154.4079 exactly.

_If you see errors or want to leave comments, feel free to [edit this article][1]
on github. Just add your comment right above this paragraph, or you
can make edits anywhere in this article if you feel comfortable doing so._


[1]: https://github.com/evert/evert.github.com/blob/master/_posts/2018/2018-12-06-currencies-floats.md
[2]: https://en.wikipedia.org/wiki/Floating-point_arithmetic "Floating point arithmetic"
[3]: https://dev.mysql.com/doc/refman/5.7/en/precision-math-decimal-characteristics.html
[4]: https://www.xe.com/currency/aud-australian-dollar
[5]: https://medium.com/@bellmar/is-cobol-holding-you-hostage-with-math-5498c0eb428b
[6]: https://www.quora.com/What-is-the-total-amount-of-money-in-the-world
[7]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
[8]: https://github.com/MikeMcl/decimal.js/
[9]: https://github.com/MikeMcl/bignumber.js/
[10]: https://secure.php.net/manual/en/book.gmp.php
[11]: https://docs.oracle.com/javase/8/docs/api/java/math/BigDecimal.html
[12]: https://github.com/tc39/proposal-bigint
