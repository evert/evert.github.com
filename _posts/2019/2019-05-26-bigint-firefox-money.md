---
title: "Firefox gets BigInt, and bigint-money gets 1.0 release"
date: "2019-05-27 16:00:00 UTC"
tags:
  - firefox
  - javascript
  - typescript
  - money
  - bigint
  - math
  - opensource
---

A couple of days ago [news][1] got out that Firefox will be getting support
for [BigInt][2] in [Firefox 68][3]. This is great news for everyone who likes
really large numbers.

My current job is in finance, and the workarounds for dealing with big
integers in browsers have been a bit frustrating.

A [few months ago][4] I set off to build a Javascript/Typescript library to
do fixed-point financial math, called [bigint-money][5]. Soon this means that
I can start using this not just server-side, but also in browsers. To
celebrate, I just released version 1.0.

Since my last blogpost, the following features were added:

1. Before all rounding was done using 'Bankers Rounding' a.k.a. 'round half to
   0', but since then support has been added for other rounding methods such
   as 'half away from 0', 'half towards 0' and 'truncate'.
2. New comparison functions: `isLesserThan()`, `isGreaterThan()`, `isEqual()`,
   `isLesserThanOrEqual()`, `isGreaterThanOrEqual()`. All of this could be
   done before with the `compare()` function, but these functions will make
   your source a lot easier to read.
3. More precision. In the past I picked an arbitrary maximum precision of 12
   decimals, because it felt like this should be enough for any currencies I
   could find. Since then I actually ran into cases where I needed more.
   ERC-20 and Ethereum actually use up to 18 decimals. The new default is a
   precision of 20 decimals.
4. `abs()` and `sign()` methods, contributed by [flacktack][6], which behave
   similar to [`Math.abs()`][7] and [`Math.sign()`][8].

If you're interested, check out the project on [Github][5].

[1]: https://bugzilla.mozilla.org/show_bug.cgi?id=1366287
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
[3]: https://www.phoronix.com/scan.php?page=news_item&px=Firefox-68-BigInt-Support
[4]: https://evertpot.com/bigint-money-typscript-lib/
[5]: https://github.com/evert/bigint-money/
[6]: https://github.com/flaktack
[7]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs
[8]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
