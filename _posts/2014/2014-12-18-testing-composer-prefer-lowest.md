---
date: 2014-12-18 22:54:38 UTC
layout: post
title: "Testing your composer dependencies with prefer-lowest"
tags:
    - composer
    - travis
    - ci
    - dependencies
    - testing
    - php
---

A few days ago, a new feature [landed in composer][1], the `--prefer-lowest`
argument.

Normally, for any dependency, composer will attempt to always install the
latest possible version.

For instance, if your composer.json looks like this:

```json
"require" : {
    "vendor/package" : "~1.2.1"
}
```

Then you are telling composer effectively that it should install any version
after 1.2.1, but before 1.3.

If version 1.2.5 is the latest, composer will always grab that version.

With the new `--prefer-lowest` setting, you can tell composer to install the
oldest possible version of a package that still matches your requirement.

So if we run:

    composer update --prefer-lowest

We should get version 1.2.1 for `vendor/package` and all its dependencies.


Why is this useful?
-------------------

In some projects, there may be packages lying around that are not the latest
version. This could be because it introduced some BC break, or introduced a
bug.

If other packages also use the package that's being held back, they may get
an older version as a dependency.

So for package maintainers, they will want to find out if their package
correctly works with the oldest package they claim to support.

So for us to test this, we can simply run:

    composer update --prefer-lowest
    ./bin/phpunit

If our unittests break with older dependencies, we know that we either need
to increase the oldest supported version, or implement a workaround so it
still works.


Automating this with Travis
---------------------------

If you are using [Travis][2] for automated testing, you can also tell travis
to test with the oldest possible dependencies.

Travis allows you to add new lines to the build matrix with the `env:` setting,
which makes this super easy to do.

If for instance your `.travis.yml` looks a bit like this:

```yaml
language: php

php:
  - 5.4
  - 5.5
  - 5.6
  - hhmv

before_script:
  - composer update --prefer-source

script:
  - ./bin/phpunit
```

You can modify it to this, to allow Travis to do 1 build for the latest, and
one build for the oldest possible depdendencies:


```yaml
language: php

php:
  - 5.4
  - 5.5
  - 5.6
  - hhmv

env:
  matrix:
    - PREFER_LOWEST="--prefer-lowest"
    - PREFER_LOWEST=""

before_script:
  - composer update --prefer-source $PREFER_LOWEST 

script:
  - ./bin/phpunit
```

This would result in a total of 8 builds.


Depend on a wide range of versions
----------------------------------

While you should always recommend anyone to run the latest versions of
your dependencies, it's a good idea to support a wide range of versions
including older ones.

In a large applications a lot of packages may be installed together, and if
there's a package out there that depends on a specific version, and another
on a different specific version of that same package, this would result in
a situation where these two packages cannot be installed together. 

To give your users the smoothest experience possible, it's therefore best to
try to nail down the oldest possible dependencies your package can still work
with, and only increase that minimum version if you're depending on the latest
introduced feature, or to get around an major bug.

[1]: https://github.com/composer/composer/pull/3450
[2]: https://travis-ci.org/
