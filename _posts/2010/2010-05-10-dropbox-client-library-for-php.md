---
date: 2010-05-10 13:25:41 UTC
layout: post
slug: dropbox-client-library-for-php
title: "Dropbox client library for PHP"
tags:
  - php
  - dropbox

---
<p style="float: left;"><img src="http://www.rooftopsolutions.nl/blog/user/themes/rooftop/images/dropbox.png" /></p>

<p>I enjoy using Dropbox. It is a very easy syncing and backup tool, and it works everywhere. A few days ago the developer API was released. After a bit of wrestling with oauth, I completed a <a href="http://code.google.com/p/dropbox-php/">client library for PHP</a>, and open sourced it (MIT licensed).</p>

<p>If you want to give it a shot, you first need to sign up for the <a href="https://www.dropbox.com/developers/">developer program</a> and get yourself your security tokens. Once that's done, you can install the library using:</p>

    pear channel-discover pear.sabredav.org
    pear install sabredav/Dropbox-alpha

<p>If that worked, you should be able to start using the API. The following example displays account information and uploads a file.</p>

```php

<?php

/* Please supply your own consumer key and consumer secret */
$consumerKey = '';
$consumerSecret = '';

include 'Dropbox/autoload.php';

session_start();

$dropbox = new Dropbox_API($consumerKey, $consumerSecret);

/* Display account information */
var_dump($dropbox->getAccountInfo());

/* Upload itself */
$dropbox->putFile(basename(__FILE__), __FILE__);


```

<p>The script needs to be run in a browser, because you will be redirected to Dropbox to authorize access.</p>

<p>I hope people like the library, and if you have any suggestions, feel free to let me know. If you want to contribute, you can head over to the <a href="http://code.google.com/p/dropbox-php/">project site on google code</a>.</p>

<p>If you haven't used Dropbox yet and want to try it, consider signing up through <a href="https://www.dropbox.com/referrals/NTI5MDU0NjA5">this link</a>. If you do so, both you and my girlfriend get an extra 250MB space for free (and she really needs it).</p>
