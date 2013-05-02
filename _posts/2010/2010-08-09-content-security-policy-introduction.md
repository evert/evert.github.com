---
date: 2010-08-09 10:13:36 UTC
layout: post
slug: content-security-policy-introduction
title: "Content Security Policy introduction"
tags:
  - websec
  - csp

---
<p>I <a href="http://evertpot.com/190">blogged</a> about Content Security Policy about 2 year ago when it was still called 'Site Security Policy'. It started as a specification and an add-on, and turned into a patch a bit later. Finally it made it into <a href="http://www.mozilla.com/en-US/firefox/all-beta.html">Firefox 4 beta 1</a>. I think CSP is the next web security revolution, so make yourself aware of how it works and the implications.</p>

<p>So what is it? The short version is that it's a very effective measure against cross-site scripting. By specifying a policy through the 'X-Content-Security-Policy', you can specify exactly from which locations you accept javascript and other content. This allows you to block scripts from any domains unknown to you, and inline scripts altogether.</p>

<h3>A simple example</h3>

```
X-Content-Security-Policy: allow 'self'
```

<p>A simple PHP example to see this in action:</p>

```php
<?php

header("X-Content-Security-Policy: allow 'self'");

?>
<html>
  <head>
    <title>CSP test</title>
  </head>
  <body>

<script type="text/javascript">

alert('XSS!');

</script>

  </body>
</html>

```

<p>If the above code is opened in Firefox 4.0 beta1, the script will not execute, and a warning is added to the "Error Console" (in the Tools menu).</p>

<p>Not only does this header block inline scripts, it also blocks the following:</p>

<ul>
  <li>eval(). This important for people using eval() to parse json responses.</li>
  <li>setTimeout and setInterval if the function is provided as a string.</li>
  <li>javascript: urls</li>
  <li>HTML event attributes (onclick, onload, etc.).</li>
  <li>All images, plugin objects (flash, quicktime etc.), audio, video, html frames and fonts <em>not</em> served from the same domain as the html page.</li>
  <li>XMLHttpRequest to domains other than the source domain.</li>
</ul>

<p>Fortunately there are fine grained controls about what you want to allow from which domains. Here are some examples from <a href="https://wiki.mozilla.org/Security/CSP/Specification">the specification</a>.</p>

```
X-Content-Security-Policy: allow 'self'; img-src *; \
                           object-src media1.com media2.com *.cdn.com; \
                           script-src trustedscripts.example.com

```

<p>This example starts with "allow 'self'", allowing only content from the same domain. The "img-src *" rule allows images from any domain. "object-src: media1.com media2.com" allows &lt;object&gt; tags to use files from media1.com, media1.com and the same domain as the html was served from. To learn more about these, I would recommend just taking a good look at the <a href="https://wiki.mozilla.org/Security/CSP/Specification#Directives">directives list in the specification</a>.</p>

<h3>Options and reporting</h3>

<p>Using the 'options' directive it's possible to turn on specific measures. Valid values for options are 'eval-script' and 'inline-script'.</p>

```
X-Content-Security-Policy: allow 'self'; options inline-script, eval-script
```

<p>The preceding example allows inline scripts (using html event attributes, or the script tag) as well as the 'eval()' function. In general I would try to avoid this though.</p>

<p>When a security rule is violated, it's possible to get the browser to send a report back to the server. For example, if an image is referenced from a blocked domain, the browser can send a simple report to a url you specify.</p>

```
X-Content-Security-Policy: allow 'self'; report-uri http://example.org/cspreport.php
```

<p>This allows you to detect any problems with your policy, or successful attempts by your evil users to inject code. An example of such a report is the following:</p>

```json
{
  "csp-report":
    {
      "request": "GET http://index.html HTTP/1.1",
      "request-headers": "Host: example.com                                                        
                          User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.3a5pre) Gecko/20100601 Minefield/3.7a5pre
                          Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8  
                          Accept-Language: en-us,en;q=0.5                                          
                          Accept-Encoding: gzip,deflate                                            
                          Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7                           
                          Keep-Alive: 115                                                          
                          Connection: keep-alive",
      "blocked-uri": "http://evil.com/some_image.png",
      "violated-directive": "img-src 'self'",
      "original-policy": "allow 'none'; img-src *, allow 'self'; img-src 'self'"
    }
}

```

<h3>Final notes</h3>

<p>Using CSP does not mean you can go easy on other security measures. At the moment a very limited amount of users will have support for CSP, so everybody else still needs to be protected. However, it's still a great idea to implement. Your Firefox users will automatically be protected better, and because of the reporting functionality, they automatically help you detect holes which benefits everybody.</p>

<p>My guess is that CSP is going to be very important, and is here to stay. There are two things you can do to prepare for the future:</p>

<ol>
  <li>Figure out your policy. It's a good idea for your web application to know anyway where resources are coming from. Especially advertisers tend to be bad at using many different domains and scripts using other scripts.</li>
  <li>Try to avoid any inline scripting, html event handlers and eval(). They are all avoidable, and in my opinion it is a good idea to keep your javascript out of html anyway. This is a big one, because both inline scripts and html events are still very popular. With the popularity of libraries such as jQuery, I do think it will be easier to just grab most of the inline scripts and move them to an external script.</li>
</ol>
