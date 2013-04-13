---
layout: default
title: home
---

<img src="resources/images/evert/evert.png" style="width: 200px; float: right"/>

My name is Evert Pot, and you're looking at the 6th reincarnation of my web
presence.

I'm a [programmer](http://github.com/evert), mainly working with
[PHP](http://php.net/) and [JavaScript](https://developer.mozilla.org/en-US/docs/JavaScript).

I'm involved with the [PHP Framework Interop Group](http://www.php-fig.org/faq/),
I'm the lead developer for [SabreDAV](http://code.google.com/p/sabredav/),
and I'm one of [fruux](https://fruux.com/)'s co-founders and CTO.

I'm available for [consulting](mailto:evert@rooftopsolutions.nl) as well. If
you're into that sort of thing, you could take a gander at my
[resume](resources/resume/resume-dec-2012.pdf).

<ul>
{% for post in site.posts %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}
            <time>
                {{ post.date | date_to_string }}
            </time>
        </a>
    </li>
    {% endfor %}
</ul>
