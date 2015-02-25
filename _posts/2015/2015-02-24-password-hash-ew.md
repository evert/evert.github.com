---
date: 2015-02-24 22:37:50 UTC
layout: post
title: "The problem with password_hash()"
tags:
    - php
---

PHP 5.5 introduced a new set of functions to hash and validate passwords in
in PHP: [password_hash()][1], [password_validate()][2] and friends.

These functions have several things going for them:

1. They have a great API.
2. They solve a problem that is solved incorrectly often in PHP, making many
   PHP applications vulnerable.

For projects where I'm able to require PHP 5.5 as a minimum version, I use
these functions, and for projects that require PHP 5.4, I use
[password-compat][3] library, which implements the exact same API in PHP and
does so quite excellently.

However, the initial introduction and rfc for these functions made me uneasy,
and I felt like a lone voice against many in that I thought something bad was
happening. I felt that they should not be added to the PHP engine.

I think that we should not extend the PHP engine, when it's possible to write
the same API in userland, or there are significant benefits to do it in PHP,
such as performance.

Since the heavy lifting of the password functions is done by underlying
libraries that are already exposed to userland-PHP, it didn't make sense to
me to expose it as well in the core.

There's several drawbacks to writing things in C for PHP:

1. The release schedule is tied to the release schedule of PHP. Lots of
   people can't or won't update their PHP, so if a vulnerability or bug
   is introduced in the functions, they have no easy option to upgrade.
2. I'd argue that it's easier to introduce buggy code in unmanaged languages
   such as C, as opposed to PHP.
3. By adding it to the language, it also extends the 'PHP specification' and
   forces alternative implementations such as HHVM to duplicate the API,
   adding more work for everyone involved and also increasing the surface of
   potential vulnerabilities again in the future.

I can't think of any technical reasons why it would not be better written in
PHP. In fact, there is a [PHP version][3] that does the exact same thing, and
is actually also recommended on [php.net][5] for older PHP versions.

So what are the non-technical benefits?

1. Adding these functions to PHP may give them more legitimacy.
2. Adding the functions to PHP perhaps give them a broader audience and more
   visibility.

I think those benefits are perfectly valid, and especially considering that
this is a security-related topic, probably outweight the drawbacks of adding
it to the PHP engine.

But it also illustrates that the PHP community has a problem. Python, a
language in many respects similar to PHP also comes with a large list of
[default modules][4] containing API's that python developers can generally
depend on.

The difference is that many of these modules are written in Python, and not
C. Why are we not 'eating our own dogfood' in PHP? Perhaps [PEAR][6] was once
that, but there's no real replacement.

If code for PHP is required to be written in C to be considered legitimate and
dependable, I think we need to admit we have a problem.

[1]: http://php.net/manual/en/function.password-hash.php
[2]: http://php.net/manual/en/function.password-verify.php
[3]: https://github.com/ircmaxell/password_compat
[4]: https://docs.python.org/2/py-modindex.html
[5]: http://php.net/manual/en/function.password-verify.php#refsect1-function.password-verify-seealso
[6]: http://pear.php.net/
