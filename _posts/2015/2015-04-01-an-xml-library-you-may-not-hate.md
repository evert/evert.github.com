---
date: 2015-04-01 20:29:54 UTC
layout: post
title: "An XML library for PHP you may not hate."
tags:
    - php
    - xml
    - xmlreader
    - xmlwriter
    - dom
    - simplexml
    - featured
---

If you are a PHP programmer, chances are that you will need to write and parse
XML from time to time. You may even consider this a good thing. Chances are
though that dealing with XML has caused you to flock to JSON.

But XML has advantages, and sometimes you simply don't have an option.

I myself have gone through several stages of this. Back in the day everybody
used [expat][1] because it was fast. I switched to [simplexml][2] because it
had a friendlier API, and I used the [DOM][3] when I needed access to a wider
range of XML features. I've also simply created XML output by concatenating
strings.

But ever since PHP shipped with [XMLReader][4] and [XMLWriter][5] I've
wondered if it was a better fit. Early on I was deterted several times due to
these objects not being very stable.

The XMLReader and XMLWriter objects are nice, but in order to effectively use
them, they need a sort of design pattern. I've experimented with this concept
off and on since 2009, and finally landed on something I'm reasonably happy
with.

A few people have randomly stumbled upon this experiment and I got mostly
positive feedback.  Today I wanted to show it off to everyone. I've iterated
on the base concept for several years, and tweaked it every time to get a sort
of 'good enough' api that behaves reasonably sane in various scenarios.

The library is called [sabre/xml][6], and I hope people are willing to kick
its tires and give some feedback.


How it works
------------

sabre/xml extends the XMLReader and XMLWriter class and adds a bunch of
functionality that makes it quick to generate and parse xml.

By default it parses from/to PHP arrays, which is great for quick one-shot
parsers/writers, but the biggest feature is that it allows you to intuitively
map XML to PHP objects and vice-versa.

This gives this XML library a distinct advantage. It's very easy to get
started, but its design pattern still works for more complex XML application.

The one caveat is that reading and writing are single-pass by design. Unlike
the DOM, you can't load in a document, make a small modification and save it
again.


Writing XML in a nutshell
-------------------------


```php
<?php

$xmlWriter = new Sabre\Xml\Writer();
$xmlWriter->openMemory();
$xmlWriter->startDocument();
$xmlWriter->setIndent(true);
$xmlWriter->namespaceMap = ['http://example.org' => 'b'];

$xmlWriter->write(['{http://example.org}book' => [
    '{http://example.org}title' => 'Cryptonomicon',
    '{http://example.org}author' => 'Neil Stephenson',
]]);

?>
```

Output:

```xml
<?xml version="1.0"?>
<b:book xmlns:b="http://example.org">
 <b:title>Cryptonomicon</b:title>
 <b:author>Neil Stephenson</b:author>
</b:book>
```

As you can see, you can quickly generate complex xml from simple array
structures.

Instead of serializing strings, you can also serialize objects. There's a
[`Sabre\Xml\XmlSerializable`][10] interface included that is meant to work similar
to PHP's [`JsonSerializable`][7].


Reading XML in a nutshell
-------------------------

This is how you parse an xml document:

```php
<?php

$input = <<<XML
<article xmlns="http://example.org/">
    <title>Hello world</title>
    <content>Fuzzy Pickles</content>
</article>
XML;

$reader = new Sabre\Xml\Reader();
$reader->elementMap = [
    '{http://example.org/}article' => 'Sabre\Xml\Element\KeyValue',
];
$reader->xml($input);

print_r($reader->parse());

?>
```

This will output something like:

```
Array
(
    [name] => {http://example.org/}article
    [value] => Array
        (
            [{http://example.org/}title] => Hello world
            [{http://example.org/}content] => Fuzzy Pickles
        )

    [attributes] => Array
        (
        )

)
```

The key in the last example, is that we tell the parser to treat the contents
of the article XML node as a key-value structure.

This is optional, but by adding this hint the resulting output becomes a lot
simpler.

The parser comes with a few parsing strategies for common needs, and you can
easily create your own by writing deserializer classes, or just by providing a
callback:

```php
<?php

$reader->elementMap = [
    '{http://example.org/}article' => function(Sabre\Xml\Reader $reader) {
        // Read the element's contents, and return the result here.
    }
];

?>
```

Element classes and interfaces
------------------------------

* `Sabre\Xml\XmlSerializable` is used to allow an object to serialize itself.
* `Sabre\Xml\XmlDeserializable` turns an object into a factory for parsing and returning a value.
* `Sabre\Xml\Element` is a convenience interface that just extends the previous two.

You can implement these interfaces yourself, but a few standard implementations are included:

* `Sabre\Xml\Element\Base` is the default and turns every element into an array with a `name`, `value`, and `attributes` key.
* `Sabre\Xml\Element\KeyValue` flattens the array, and turns it into a key-value array.
* `Sabre\Xml\Element\Elements` discards element values, and gives you a flat array of element names. Useful for 'enums'.
* `Sabre\Xml\Element\CData` allows you to easily embed a CDATA structure.
* `Sabre\Xml\Element\XmlFragment` extracts a subtree from XML and gives you a valid xml fragment, including namespace declarations.


The benefits
------------

This type of design pattern has a number of major advantages. It's possible
for users to create PHP classes that represent specific XML elements.

For complex XML application this is useful, because elements may be re-used
in various document types, and now those element classes can be re-used in
the same way.

It would also allow someone to publish a set of Element classes for a specific
xml format such as [Atom][8] on packagist and allow someone else to re-use
specific parts of of that format into a new format. I'm hoping to fulfill the
promise of XML extensibility by bringing it in PHP, but that might be too bold
of a statement.

At the very least I think it will make your XML parsing code simpler, reusable,
extensible and more legible. I also found it more fun to work with XML, but
I'm biased.

The full docs can be found on [http://sabre.io/xml/][6], the source on
[GitHub][9] and it may be installed with:

    composer require sabre/xml ~0.4.0

[1]: http://php.net/manual/en/book.xml.php
[2]: http://php.net/manual/en/book.simplexml.php
[3]: http://php.net/manual/en/book.dom.php
[4]: http://php.net/manual/en/book.xmlreader.php
[5]: http://php.net/manual/en/book.xmlwriter.php
[6]: http://sabre.io/xml/ "sabre/xml homepage"
[7]: http://php.net/manual/en/class.jsonserializable.php "JsonSerializable"
[8]: https://tools.ietf.org/html/rfc4287
[9]: https://github.com/fruux/sabre-xml/
[10]: https://github.com/fruux/sabre-xml/blob/master/lib/XmlSerializable.php
