---
layout: default
title: "Evert Pot - Resume"
permalink: "/resume.html"
---

{{ site.data.resume.basics.name }}
=========

_{{ site.data.resume.basics.label }}_

* Last update: *Feb 19th, 2023*.
* Location: Toronto, ON, Canada.
* Contact: <{{ site.data.resume.basics.email }}>.

Summary
-------

I'm 20 year software engineering veteran and co-founded several businesses.

I'm currently on the look-out for new opportunities. I'm especially
interested in CTO and Director or part-time advisor positions.

I'm strictly not interested in Cryptocurrency or NFT-related businesses.

Links
-----

<ul>
{% for profile in site.data.resume.basics.profiles %}
  <li>{{ profile.network }} - <a href="{{profile.url}}">{{profile.url}}</a></li>
{% endfor %}
</ul>

Experience
----------

{% for job in site.data.resume.work %}

### {{job.position}} at {{job.name}}, {{job.location}}, {{job.startDate}}-{{job.endDate}}

{{job.summary}}

{% endfor %}


Skills
------

### Languages

<ul>
{% for language in site.data.resume.languages %}
  <li>{{ language.language }} - {{ language.fluency }}</li>
{% endfor %}
</ul>

{% for skill in site.data.resume.skills %}

### {{ skill.name }}

{{ skill.keywords | join: ", " }}

{% endfor %}


Speaking
--------

* Apidays New York 2021 - Introduction to HATEOAS with Ketting. [video](https://www.youtube.com/watch?v=cZ0e-HoPPJ8)
* TorontoJS, August 2020 - Building a Promise from scratch [video](https://www.youtube.com/watch?v=CVzx-6fu0d8)
* React + Native Toronto - 2020 - Using Ketting with React.
* Midwest PHP 2017 - Minneapolis, USA: Promises and Generators. [slides](https://github.com/evert/promises-and-generators)
* True North PHP 2016 - Toronto, Canada: Introducing sabre/dav.
* True North PHP 2016 - Toronto, Canada: Making CSS fun again with Sass. [slides](https://github.com/evert/sass-talk).
* PHP Meetup, September 2016 - Toronto, Canada: Go for PHP programmers. [slides](/talks/go-for-php-programmers/)
* True North PHP 2015 - Toronto, Canada: Promises & Generators. [slides](https://github.com/evert/promises-and-generators)
* OwnCloud contributer conference 2015 - Berlin, Germany: sabre/dav and Promises & Generators.
* Dutch PHP conference 2012 - Amsterdam, Netherlands: Backbone.js.
* Dutch PHP conference 2011 - Amsterdam, Netherlands: RESTful webservices.
* PHPBenelux Meetup 2011, Amersfoort, Netherlands: Integrating WebDAV in PHP applications.
* Flash In The Can 2007, Toronto, Flash Video LiveCycle: From User To Delivery. 
* FlashInTO 2007, Toronto, Video conversion with FFMpeg.


Recognition
-----------

{% for award in site.data.resume.awards %}
* {{ award.title }} - {{ award.awarder }}
{% endfor %}

Standards
---------


* Former member of the PHP Framework Interoperability Group <http://php-fig.org/>.
  Contributor to various PHP standards.
* Member of CalConnect, the Calendaring & Scheduling Consortium. Currently
  working on several documents that hopefully will become IETF RFCs.

IETF drafts:

* [draft-pot-authentication-link](https://datatracker.ietf.org/doc/html/draft-pot-authentication-link)
* [draft-pot-json-link](https://datatracker.ietf.org/doc/html/draft-pot-json-link)
* [draft-pot-prefer-push](https://datatracker.ietf.org/doc/html/draft-pot-prefer-push)
* [draft-pot-webdav-notifications](https://datatracker.ietf.org/doc/html/draft-pot-webdav-notifications)
* [draft-pot-caldav-sharing](https://datatracker.ietf.org/doc/html/draft-pot-caldav-sharing)
* [draft-pot-carddav-sharing](https://datatracker.ietf.org/doc/html/draft-pot-carddav-sharing)


Other projects
--------------

### Blogging

I've been blogging on and off since 2006. Here's some of my favourites:

<ul>
{% for post in site.tags.featured %}
  <li>
     <a href="{{ post.url }}">{{ post.title }}</a>
     <span>({{ post.date | date:"%Y-%m-%d" }})</span>
  </li>
{% endfor %}
</ul>

Because of this, I've been published in both PHP Architect (a paper PHP
magazine) and PHP Advent (now defunct series of articles).


### Ketting

In 2016 I started a new open-source project called
[Ketting](https://github.com/evert/ketting). This project is an opiniated REST
client, written in Javascript for both server and client side.

### Curveball

A also started [Curveball](https://curveballjs.org/), a modern Javascript
framework to replace Express.

### a12n-server

I built both a [OAuth2 and OpenID Connect server](https://github.com/curveball/a12nserver)
and an [OAuth2 Client](https://github.com/badgateway/oauth2-client).


### sabre.io

Since 2007 I started working on an open source library that would be named
sabre/dav. This project spawned a number of PHP libraries that are now widely
in use for various purposes. The project site is <http://sabre.io/>. I'm still
the lead maintainer for all of these projects.
