---
date: 2015-01-27 22:43:04 UTC
layout: post
title: "A new URI handling library for PHP."
tags:
    - php
    - uri
    - url
    - rfc3986
---

The last little while have been all about URI's for me. I've been engaged in
discussions about the upcoming ['PSR-7'][1], I started working on a sort of
'hypermedia'-focussed router/repository type of system, and I recently ran
into a bug in [sabredav][2] that forced me to get a better understanding
of the [URI specification][3], in particular on the topics of 'normalization'
and resolving relative URLs.

All of this accumulated in a set of functions of operations I commonly need,
which I'm now releasing as an open source library.

Yup! Yet another URI library. All this library is though, is a collection of
5 php functions:

* `resolve` to resolve relative uris.
* `normalize` to aid in comparing uris.
* `parse`, which mostly works like PHP's parse_url.
* `build` to do the exact opposite of `parse`.
* `split` to easily get the 'dirname' and 'basename' of a URL without all the
  problems those two functions have.

The bug I ran into with sabredav, had to do with a client using a different
encoding of a URI than I expected to. After diving into [rfc3986][3], I
realized that an application comparing uris cannot simply compare using
`strcmp` or `===`.

For example, the following uris are all identical:

* `http://example.org/~foo/`
* `HTTP://example.ORG/~foo/`
* `http://example.org:80/~foo/`
* `http://example.org/%7Efoo/`
* `http://example.org/%7efoo/`
* `http://example.org/bar/./../~foo/`

The new `normalize` function can take *any* of these previous URIs, and will
turn it into the first.

```php
<?php

use Sabre\Uri;

$input = 'HTTP://example.ORG:80/bar/./../%7efoo/';

echo Uri::normalize($input);
// output: http://example.org/~foo/

?>
```

I hope it's useful for others.

Links:

* [Packagist][4]
* [Full usage instructions][5]
* [GitHub][6]

[1]: https://github.com/php-fig/fig-standards/blob/master/proposed/http-message.md
[2]: http://sabre.io/dav/
[3]: https://tools.ietf.org/html/rfc398
[4]: https://packagist.org/packages/sabre/uri
[5]: http://sabre.io/uri/usage/
[6]: https://github.com/fruux/sabre-uri

