---
layout: default
title: home
---

Het Bijstere spoor
==================

<img src="resources/images/evert/evert.png" style="width: 200px; float: right"/>

My name is Evert Pot, and you're looking at the 6th reincarnation of my web
presence.

I'm a [programmer](http://github.com/evert), mainly working with
[PHP](http://php.net/) and [JavaScript](https://developer.mozilla.org/en-US/docs/JavaScript).

I'm involved with the [PHP Framework Interop Group](http://www.php-fig.org/faq/),
I'm the lead developer for [SabreDAV](http://code.google.com/p/sabredav/),
and I'm one of [fruux](https://fruux.com/)' co-founders and CTO. In the past
I played a similar role at [filemobile](http://filemobile.com/).

I'm available for [consulting](mailto:evert@rooftopsolutions.nl) as well. If
you're into that sort of thing, you could take a gander at my
[resume](resources/resume/resume-dec-2012.pdf).

I'm a console junkie, I love good software architecture and I still remember my
ICQ number.

On the web
----------

* Twitter : [@evertp](https://twitter.com/evertp)
* Github : [evert](https://github.com/evert)
* [Subscribe to my feed](http://localhost:4000/atom.xml)

Blog
----

I've been writing blog-posts on and off since 2006. Below you'll find the full
archive. Don't scroll too far though, quality degrades as go backwards in time.

{% for post in site.posts %}

{% unless post.next %}
<h3>{{ post.date | date: '%Y' }}</h3>
<ul>
{% else %}
{% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
{% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
{% if year != nyear %}
</ul>
<h3>{{ post.date | date: '%Y' }}</h3>
<ul>
{% endif %}
{% endunless %}

<li>
  <time>
    {{ post.date | date:"%b %d" }}
  </time>
  <a href="{{ post.url }}">{{ post.title }}</a>
</li>

{% if forloop.last %}</ul>{% endif %}

{% assign lastyear = year %}
{% endfor %}
</ul>
