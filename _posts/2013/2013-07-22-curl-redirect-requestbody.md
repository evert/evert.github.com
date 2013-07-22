---
date: 2013-07-22 21:58:28 UTC
layout: post
title: "Following redirects with Curl in PHP."
tags:
  - curl
  - php
  - http

---

As a good web citizen, I try to always follow redirects. Not just in my
browser, where I actually don't have all that much control over things,
but also a consumer of web services.

When doing requests with CURL, redirects are _not_ followed by default.

```php
<?php

$curl = curl_init('http://example.org/someredirect');
curl_setopt($curl, CURLOPT_POSTFIELDS, "foo");
curl_setopt($curl, CURLOPT_POST, true);

curl_exec($curl);

?>
```

Assuming the given url actually redirects like this:

```
HTTP/1.1 301 Moved Permanently
Location: /newendpoint
```

Curl will automatically just stop. To make it follow redirects, the
`FOLLOWLOCATION` setting is needed, as such:


```php
<?php

$curl = curl_init('http://example.org/someredirect');
curl_setopt($curl, CURLOPT_POSTFIELDS, "foo");
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_POST, true);

curl_exec($curl);

?>
```

`CURLOPT_FOLLOWLOCATION` will follow the redirects up to 5 times (by default).

However, if you look at the second request, it actually does a `GET` request
after the `POST`.

```
GET /newendpoint HTTP/1.1
```

This is also the default behavior for browsers, but actually non-conforming
with the HTTP standard, and also not desirable for consumers of web services.

To fix this, all you have to do is use `CURLOPT_CUSTOMREQUEST` instead of
`CURLOPT_POST`:


```php
<?php

$curl = curl_init('http://example.org/someredirect');
curl_setopt($curl, CURLOPT_POSTFIELDS, "foo");
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");

curl_exec($curl);

?>
```

Streams
-------

After doing this, the secondary request will be a `POST` request as well.
There's one more issue though, if you were doing a `POST` or a `PUT` request
you probably had a request body attached.

There's two ways to supply a request body, as a string or as a stream. If we
were uploading a file it makes much more sense to use a stream, because it
unlike posting a string, a stream doesn't have to be kept in memory.

To upload a stream with curl, you need `CURLOPT_PUT` and `CURLOPT_INFILE`.
Don't let the name `CURLOPT_PUT` fool you, it's use for every request, and
without `CURLOPT_PUT`, `CURLOPT_INFILE` is ignored.

For example, this is how we could upload a large file using POST.

```php
<?php

$curl = curl_init('http://example.org/someredirect');
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_PUT, true);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($curl, CURLOPT_INFILE, fopen('largefile.json', 'r'));

curl_exec($curl);

?>
```

This will work great, _unless_ the target location redirects. If it does, curl
will throw the following error:

```
Necessary data rewind wasn't possible (code #65)
```

This seems to be related to [PHP bug #47204][1].

Basically this means that you cannot use `CURLOPT_INFILE` and
`CURLOPT_FOLLOWLOCATION` together. There's two alternatives:

1. Don't use `CURLOPT_INFILE`, but send the request body as a string instead,
   with `CURLOPT_POSTFIELDS`.
2. Don't use `CURLOPT_FOLLOWLOCATION`, but instead manually check if the
   response was a 3xx redirect and manually follow each hop.

Strings
-------

Using `CURLOPT_POSTFIELDS` you can supply a request body as a string. Lets
try to upload our earlier failed request using that method:

```php
<?php

$curl = curl_init('http://example.org/someredirect');
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($curl, CURLOPT_POSTFIELDS, file_get_contents('largefile.json'));

curl_exec($curl);

?>
```

This also will not work exactly as you expect. While the second request to
`/someredirect` will still be a POST request, it will be sent with an empty
request body.

To fix this, use the undocumented `CURLOPT_POSTREDIR` option.

```php
<?php

$curl = curl_init('http://example.org/someredirect');
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($curl, CURLOPT_POSTFIELDS, file_get_contents('largefile.json'));
curl_setopt($curl, CURLOPT_POSTREDIR, 3);

curl_exec($curl);

?>
```


According to the PHP changelog, this was added in PHP 5.3.2, and according to
[PHP bug #49571][2] there are four possible values:

```
0 -> do not set any behavior
1 -> follow redirect with the same type of request only for 301 redirects.
2 -> follow redirect with the same type of request only for 302 redirects.
3 -> follow redirect with the same type of request both for 301 and 302 redirects.
```

[1]: https://bugs.php.net/bug.php?id=47204
[2]: https://bugs.php.net/bug.php?id=49571
