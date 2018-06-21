---
title: Ketting 2.0 release
date: 2018-06-19 09:00:00 -0700
tags:
  - ketting
  - rest
  - http
  - hateoas
---

Being fresh out of a job, I had some time to work on a new release of the
[Ketting][1] library.

The Ketting library is meant to be a generic [HATEOAS][2] library for
Javascript using a simple, modern API. Currently it only supports the HAL and
HTML formats, but I'm curious what other formats folks are interested to see
support for.

An example:

```js
const ketting = new Ketting('https://example.org/bookmark');
const author = await ketting.follow('author');
console.log(await author.get());
```

For the 2.0 release, the biggest change I've made is that everything is now
converted to [TypeScript][3]. TypeScript is so great, I can't really imagine
writing any serious javascript without it anymore.

Most of the sources are also upgraded to use modern javascript features, such
as `async`/`await`, `for...of` loops and `const`/`let` instead of `var`.

A small bonus feature is the addition of the `.patch()` method on resoures,
which provides a pretty rudimentary shortcut to doing `PATCH` request. I kept
it extremely basic, because I wanted to figure out first how users like to use
this feature first before over-engineering it.

Interested? Go check out the project and documentation on [Github][1], or go
download it off [npmjs.com][4].

[1]: http://github.com/evert/ketting "The Ketting library"
[2]: https://en.wikipedia.org/wiki/HATEOAS "HATEOAS"
[3]: https://www.typescriptlang.org/
[4]: https://www.npmjs.com/package/ketting
