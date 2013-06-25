---
date: 2012-12-16 16:53:22 UTC
layout: post
slug: switching-to-php-54-on-os-x
title: "Switching to PHP 5.4 on OS X"
tags:
  - php
  - os/x
  - mac
  - homebrew

---
<p>I like using OS X's built-in packages where possible, but unfortunately Apple is way behind with their PHP package, having it locked on 5.3.15. In the past I've seen people use tools like <a href="http://www.mamp.info/en/index.html">Mamp</a>, or <a href="http://www.apachefriends.org/en/xampp.html">Xampp</a> to provide this for them, but frankly I'm not a big fan of these tools.</p>

<p><a href="http://mxcl.github.com/homebrew/">Homebrew</a> provides a solution. Homebrew is OS X missing package manager, and it's an absolute great tool to work with. Getting started with it is a bit harder, as there's a few bigger dependencies you need, such as an up-to-date XCode installation. Once you've installed homebrew, it's a matter of running the following commands:</p>

```bash

brew tap homebrew/dupes
brew tap josegonzalez/homebrew-php
brew install php54 --with-mysql 
brew install php54-memcached
brew install php54-xdebug

```

<p>After that, open /etc/apache2/httpd.conf, and look for this line:</p>

```apache

LoadModule php5_module libexec/apache2/libphp5.so

```

<p>Comment that out (with #) and add the following line:</p>

```apache

LoadModule php5_module /usr/local/Cellar/php54/5.4.12/libexec/apache2/libphp5.so

```
<p><strong>Hint:</strong> Check your php version ('php -v') and adjust the version number if necessary.

<p>After that, restart apache and things should just work. For more detailed instructions, take a look at the <a href="https://github.com/josegonzalez/homebrew-php">documentation for homebrew-php</a></p>

<p><b>Edit:</b> On one Mac I had to first run "brew unlink libiconv" for PHP compilation to complete.</p>
