---
date: 2010-10-30 14:50:54 UTC
layout: post
slug: slowdeath-a-simple-denial-of-service-attack-for-most-php-based-servers
title: "slowdeath - a simple denial of service attack for most PHP-based servers"
tags:
  - websec
  - slowdeath
  - dos
  - webservers

---
<p>The problem with Apache's approach to dealing with multiple clients, is that there's only ever a limited amount of Client processes available. This is usually is around a few hundred on common webservers.</p>

<p>Because of this, it becomes necessary to handle HTTP requests as quickly as possible. As soon as a request is handled, it can go on serving the next. If a client happens to have a slow connection, this can have a direct effect on the scalability of your frontend server.</p>

<p>A common way to fight this, is to put a caching server in front of your webserver, such as Varnish or Squid. These webservers are better suited to deal with many clients. This will allow your Apache server to send back HTTP responses quickly to the reverse proxy, and let the proxy deal with sending back the response to the client.</p>

<p>However, this doesn't deal with slow requests. Generally, these proxy servers will open connections directly to the backend webserver to avoid having to buffer larger request bodies.</p>

<p>Because PHP installations generally use apache 'prefork mpm', the number of possible connections is considerably low. This is also often the case with Fast-CGI based webservers, such as nginx and lighttpd. So if you were to just able to open up a few hundred connections, and drip in the bytes for the request body it would be very easy to take these servers down.</p>

<p>To test this theory, I wrote a simple python script that does exactly this, you can grab it from <a href="http://github.com/evert/slowdeath">github</a>. To use it, try something like this:</p>

```

python slowdeath.py --threads 200 http://localhost/

```

<p>In my case my webserver was limited to 150 connections. It took about a second for it to stop serving requests.</p>

<p><strong>Big warning:</strong> This tool is for research purposes only. Use at your own risk, and only on servers you own.</p>

<p>To take out a server, simply specify a number of threads higher than the MaxClients or whatever setting your webserver happens to use. Note that I only tested this on a few servers, so results may vary. Side effects include diarrhea, rashes, blackouts and death. Do not use while driving.</p>
