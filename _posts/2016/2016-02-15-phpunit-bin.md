---
date: 2016-02-15 22:22:53 -0500
layout: post
title: "phpunit-bin - run phpunit from anywhere"
tags:
   - php
   - phpunit 
geo:  [43.642392, -79.414486]
location: "Shank St, Toronto, ON, CA"
---

These days it's common for projects to supply phpunit via `require-dev`. Most
of my projects do this, and this means that every project supplies their own
`bin/phpunit`.

I live on the command-line and it can be a bit annoying to invoke the correct
`phpunit` script every time.

So I wrote a small script that is installable globally, and it will:

1. Automatically scan your directory and parents to find `composer.json`.
2. Based on that find the correct `phpunit` binary.
3. Try to find `phpunit.xml` or `phpunit.xml.dist`.
4. `chdir` into that directory.
5. Run your local `phpunit` there.

If this is useful to you, you can install it via composer:

    composer global require evert/phpunit-bin

Make sure that the composer global vendor dir is part of your `$PATH`.

After that, you can just run `phpunit` from wherever you are in your project
directory.

* [Github link](https://github.com/evert/phpunit-bin)
* [Packagist link](https://packagist.org/packages/evert/phpunit-bin)
