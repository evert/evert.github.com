---
date: 2010-07-13 20:54:59 UTC
layout: post
slug: storing-encrypted-session-information-in-a-cookie
title: "Storing encrypted session information in a cookie"
tags:
  - php
  - websec
  - cookies
  - sessions

---
<p style="float: right"><img src="http://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Choco_chip_cookie.jpg/275px-Choco_chip_cookie.jpg" alt="cookie" /></p>

<p>Our session system is due for an upgrade. Currently all PHP sessions are stored in the database, and some things are getting a bit slow. There have been a couple of approaches I've been considering, one of which is simply storing all the information in a browser cookie.</p>

<p>First I want to make clear I don't necessarily condone this. The reason I'm writing this post, is because I'm hoping for some more community feedback. Is this a really bad idea? I would love to know.</p>

<h3>The benefits</h3>

<p>If all the session data is stored in the browser, it means that I don't need to store it on the server. I actually don't care all that much for having the data on the server (unless it's the only secure way), it's mostly a gigantic map with session tokens and user id's (along with some other info).</p>

<p>I also feel it's more natural for HTTP, as it makes it a bit more stateless.</p>

<h3>Sample code</h3>

```php
<?php

class BrowserSession {

    public $secret = 'this will need to be a cryptographic random number';
    public $currentUser = null;

    // Sessions time out after 10 minutes
    public $timeout = 600;

    function init() {

        if (!isset($_COOKIE['MYSESSION'])) {
            echo "No session cookie found\n";
            return;
        }

        list($userId, $time, $signature) = explode(':',$_COOKIE['MYSESSION']);

        // The cookie is old
        if ($time> time() + $this->timeout) {
            echo "The session cookie timed out\n";
        }

        if ($signature !== $this->generateSignature($userId,$time)) {
            echo "The secret was incorrect\n";
        }

        $this->currentUser = $userId;

        echo "Logged in as user: $userId\n";

    }

    function login($userId) {

        $this->userId = $userId;

        $time = time();

        $cookie = $this->userId . ':' . time() . ':' . $this->generateSignature($userId,$time);

        setcookie('MYSESSION',$cookie,$time+$this->timeout,null,null,null,true);

        echo "Set cookie: $cookie\n";

    }

    function generateSignature($userId,$time) {

        $stringToSign =
           $userId . "\n" .
           $time . "\n" .
           $_SERVER['HTTP_USER_AGENT'] . "\n" .
           $_SERVER['REMOTE_ADDR'];

        return hash_hmac('SHA1',$stringToSign,$this->secret);

    }

}

ob_start();
$session = new BrowserSession();
$session->init();

if (isset($_GET['login'])) $session->login($_GET['login']);
else {

    echo '<br /><a href="?login=1234">Log in as user 1234</a>';

}
?>
```

<p>A few notes:</p>

<ul>
  <li>The preceeding code was just intended as a proof of concept, it's missing some validation.</li>
  <li>Currently the secret would be the same for every user. I was thinking of appending some per-user information to the secret. If somebody does guess or bruteforce the secret, they would only have access to a single users' information.</li>
  <li>If a user changes their password, existing sessions should expire. To do this the signature should also include a sequence number that changes when the password changes.</li>
  <li>Currently this only stores a user id. It could be extended to contain more data, but this is all I need.</li>
</ul>

<p>So, is there anything fundamentally wrong with this approach? In general the client should never be trusted, but for setups where the security requirements aren't as high (highly subjective, I know) I feel this might be strong enough. OAuth, OpenID and Amazon AWS all seem to trust HMAC+SHA1, but those applications do work differently.</p>

<h3>Credit where it's due</h3>

<p>I first asked this question on <a href="http://stackoverflow.com/questions/3240246/signed-session-cookies-a-good-idea">stack overflow</a>. The users there already gave some great suggestions and pointed out some of the flaws. Thank you!</p>
