---
date: 2010-10-21 13:13:20 UTC
layout: post
slug: internationalized-domain-names-are-you-ready
title: "Internationalized domain names, are you ready?"
tags:
  - php
  - idn tld
  - regex
  - email

---
<p>Since may 11 TLD's (top-level domainnames) have been added. In order for this to work successfully, a lot of applications will have to be fixed.</p>

<p>Many email-validation scripts might use an approach like this:</p>

```php

$ok = preg_match('/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i', $email);

```

<p>This one is pretty simple, it matches the most common address formats, as long as the tld (.com, nl, .uk, etc) is under 6 characters. For a bit more sophistication you might want to ensure that the tld is a bit more valid:</p>

```php

$ok = preg_match('/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/i',$email);

```

<p><small>Note: both these regexes were taken from <a href="http://www.regular-expressions.info/email.html">regular-expression.info</a>. The top google hit, and decent examples.</small></p>

<p>The new TLD's use non-ascii characters, and they might become aliases for existing top-level domains, or new tld's altogether. Here are the currently working examples:</p>

<ul>
<li><a href="http://xn--mgbh0fb.xn--kgbechtv/" class="external text" title="http://xn--mgbh0fb.xn--kgbechtv/" rel="nofollow">http://مثال.إختبار</a> - Arabic.</li>
<li><a href="http://xn--fsqu00a.xn--0zwm56d/" class="external text" title="http://xn--fsqu00a.xn--0zwm56d/" rel="nofollow">http://例子.测试</a> - Chinese (simplified)</li>
<li><a href="http://xn--fsqu00a.xn--g6w251d/" class="external text" title="http://xn--fsqu00a.xn--g6w251d/" rel="nofollow">http://例子.測試</a> - Chinese (traditional)</li>
<li><a href="http://xn--hxajbheg2az3al.xn--jxalpdlp/" class="external text" title="http://xn--hxajbheg2az3al.xn--jxalpdlp/" rel="nofollow">http://παράδειγμα.δοκιμή</a> - greek</li>
<li><a href="http://xn--p1b6ci4b4b3a.xn--11b5bs3a9aj6g/" class="external text" title="http://xn--p1b6ci4b4b3a.xn--11b5bs3a9aj6g/" rel="nofollow">http://उदाहरण.परीक्षा</a> Hindi</li>
<li><a href="http://xn--r8jz45g.xn--zckzah/" class="external text" title="http://xn--r8jz45g.xn--zckzah/" rel="nofollow">http://例え.テスト</a> - Japanese</li>
<li><a href="http://xn--9n2bp8q.xn--9t4b11yi5a/" class="external text" title="http://xn--9n2bp8q.xn--9t4b11yi5a/" rel="nofollow">http://실례.테스트</a> - Korean</li>
<li><a href="http://xn--mgbh0fb.xn--hgbk6aj7f53bba/" class="external text" title="http://xn--mgbh0fb.xn--hgbk6aj7f53bba/" rel="nofollow">http://مثال.آزمایشی</a> - Persian</li>
<li><a href="http://xn--e1afmkfd.xn--80akhbyknj4f/" class="external text" title="http://xn--e1afmkfd.xn--80akhbyknj4f/" rel="nofollow">http://пример.испытание</a> - Russian</li>
</ul>

<p>At first sight these look like regular utf-8, characters, but if you look at the sourcecode of this page,  you'll notice that it's actually encoded differently.</p>

<p>The korean url http://실례.테스트, is actually encoded as http://xn--9n2bp8q.xn--9t4b11yi5a/. This is called <a href="http://en.wikipedia.org/wiki/Punycode">Punycode</a>.</p>

<p>If you want support for these new urls (and thus domainnames in emails), you should have support for punycode. You will likely receive UTF-8 encoded domainnames for email address (example@실례.테스트), but internally you must make sure that you only deal with the punycode representation.</p>

<p>This translating is also what modern browsers do. If you were to paste "http://xn--9n2bp8q.xn--9t4b11yi5a/" directly in the firefox address bar, it will show you the UTF-8 characters instead. Firefox will re-encode to punycode though and use that format for HTTP requests.</p>

<p>The best way really to check for valid email addresses is to use a very liberal regex, but verify with a simple MX record lookup if a mailserver exists for the given domain. This example is an expansion on the first regex.</p>

```php

$email = 'example@xn--9n2bp8q.xn--9t4b11yi5a';

if(preg_match('/^[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z0-9-]{2,})$/i', $email,$matches)) {
    $hostname = $matches[1];
        if (!getmxrr($hostname, $hosts)) {
            echo "Host has an MX record\n";
        } else {
            echo "Host does not exist or does not have an MX record\n";
        }
} else {
    echo "Email address did not match regular expression\n";
}

```

<p>The preceeding code does not convert UTF-8 to punycode though. There's not yet an easy native way in PHP to do this, but <a href="http://pear.php.net/package/Net_IDNA2">Pear's Net_IDNA2</a> provides a way. The <a href="http://svn.php.net/viewvc/pear/packages/Net_IDNA2/trunk/Net/IDNA2.php?view=markup">implementation</a> seems very complex though, and leaves me wondering if there's an easier way to go about it.</p>
