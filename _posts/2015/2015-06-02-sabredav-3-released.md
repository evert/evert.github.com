---
date: 2015-06-02 17:38:01 UTC
layout: post
title: "sabre/dav 3.0 released!"
tags:
    - http
    - php
    - php-fig
    - psr-7
---

<!-- Holler from home in Toronto -->

Today we released version 3.0 of [sabre/dav][1] WebDAV/CalDAV/CardDAV server.
The most exciting part for me is that we've replaced all the XML-handling
code with [sabre/xml][3], a project that I've been working on and has been on
my mind since several years.

Originally we also intended to add PSR-7 support, but due to the new direction
it's taken it's become a very poor fit. In the future we plan to replace the
HTTP component with something that shares a lot of the great ideas of PSR-7,
except with full mutability and a better performing stream system.

This is also the last release that will still support PHP 5.4. After this,
we're going to switch to PHP 5.5 as a minimum and take full advantage of
generators. Can't wait!

Read the full sabre/dav 3.0 announcement [here][2].

[1]: http://sabre.io/
[2]: http://sabre.io/blog/2015/sabredav-3-release/
[3]: http://sabre.io/xml/
