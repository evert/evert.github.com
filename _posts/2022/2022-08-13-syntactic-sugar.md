---
title: "On syntactic sugar"
date: "2022-08-13 18:12:29 UTC"
geo: [45.686510, -79.328419]
location: "East York, ON, Canada"
tags:
  - syntactic sugar
  - javascript
  - language
---

Ever so often the term 'syntactic sugar' comes when people discuss language
features, and it's not uncommon to see the word 'just' right in front of it;
some examples:

* [Why Async/Await Is More Than Just Syntactic Sugar][1]
* [JS classes are not “just syntactic sugar”][2]

The 'just' has a lot of meaning here. To me it suggests that language features
that are 'just' syntactic sugar, aren't quite as important as features that
aren't. Maybe it even suggests to me that the language would be fine without.

So while the above two examples both argue that both Javascript classes and
async/await _aren't_ syntactic sugar, they also kind of come to the defence
of those features and justify their existence. In other cases when people
call something syntactic sugar, it's often in a context that's somewhat
dismissal of the feature.

I think this is a bit odd and also [confuses people][3], especially since any
actual definition I've found is generally positive, such as this one from
[Wikipedia][4].

> In computer science, syntactic sugar is syntax within a programming language
> that is designed to make things easier to read or to express. It makes the
> language "sweeter" for human use: things can be expressed more clearly, more
> concisely, or in an alternative style that some may prefer.

The thing is, isn't every language feature beyond the bare minimum of what
makes a language turing-complete syntax sugar?

* You don't need classes because you can use functions and structs.
* You don't really need types because everything can fit in a string.
* Functions can be implemented with goto.
* Multiply can be implemented with addition.
* `or` and `and`, `xor` can be implemented with `nand`.
* async/await can be implemented with generators.

These are all incredibly useful features that make it easier to read and write
code and express ideas. Almost every language feature could be considered
syntactic sugar. That's not a bad thing, it's just uninteresting to point out.


[1]: https://www.zhenghao.io/posts/await-vs-promise 
[2]: https://webreflection.medium.com/js-classes-are-not-just-syntactic-sugar-28690fedf078
[3]: https://dev.to/jenc/shtpost-can-we-stop-saying-syntactic-sugar-3i4j
[4]: https://en.wikipedia.org/wiki/Syntactic_sugar
