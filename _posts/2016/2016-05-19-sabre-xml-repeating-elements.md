---
date: 2016-05-19 18:00:02 -0400
layout: post
title: "sabre/xml and repeating elements"
tags:
   - sabre/xml 
   - xml
   - php 
---

We recently got a [support ticket][1] with a simple [sabre/xml][3] question. 
Because it's a nice demonstration for sabre/xml, I thought it would make for a
short and sweet blog post.

[eddy8][2] asks (paraphrased): how do I repeat the same xml element name, to
create a structure such as this:

```xml
<?xml version="1.0"?>
<books>
    <book>php</book>
    <book>c++</book>
    <book>c#</book>
</books>
```

The code he started off with was this:

```php
<?php

$service = new Sabre\Xml\Service();
$xmlstr = $service->write('books', [
    'book' =>  'php',
    'book1' =>  'c++',
    'book2' =>  'c#',
]);
```

But this generates this xml:

```xml
<?xml version="1.0"?>
<books>
    <book>php</book>
    <book1>c++</book1>
    <book2>c#</book2>
</books>
```

And you can't use the same key in PHP arrays more than once. There are three
possible solutions to this.

The first is to change how the elements are specified. Instead of a simple key
value, you can use a structure such as this:

```php
<?php

$service = new Sabre\Xml\Service();
$xmlstr = $service->write('books', [
    ['name' => 'book', 'value' => 'php'],
    ['name' => 'book', 'value' => 'c++'],
    ['name' => 'book', 'value' => 'c#'],
]);
echo $xmlstr;
```

In most cases this is probably what you want. A second option is to use a
callback, the callback will automatically be called with the `XMLWriter`
object:

```php
<?php

$service = new Sabre\Xml\Service();
$xmlstr = $service->write('books', function(Sabre\Xml\Writer $writer) {
    $writer->writeElement('book', 'php');
    $writer->writeElement('book', 'c++');
    $writer->writeElement('book', 'c#');
]);
echo $xmlstr;
```

But this structure is a very common one. Many xml formats follow a pattern
like this:

```xml
<collection>
   <item>...</item>
   <item>...</item>
</collection>
```

To facilitate this, there is a standard serializer function:

```php
<?php

$service = new Sabre\Xml\Service();
$xmlstr = $service->write('books', function(Sabre\Xml\Writer $writer) {
    $books = [
        'php',
        'c++',
        'c#',
    ];
    Sabre\Xml\Serializer\repeatingElements($writer, $books, 'book');
]);
echo $xmlstr;
```

And that last form is very handy, because when you want to parse the xml file
again later, you can use a similar `repeatingElements` function for the
deserialization operation.

```php
<?php

$xml = <<<XML
<?xml version="1.0"?>
<books>
    <book>php</book>
    <book>c++</book>
    <book>c#</book>
</books>
XML;

$service = new Sabre\Xml\Service();
$service->elementMap['books'] = function(Sabre\Xml\Reader $reader) {
    return Sabre\Xml\Deserializer\repeatingElements(
        $reader,
        'book'
    );
};
print_r($service->expect('books', $xml));

// output
// Array
// (
//     [0] => php
//     [1] => c++
//     [2] => c#
// )
```


[1]: https://github.com/fruux/sabre-xml/issues/98
[2]: https://github.com/eddy8
[3]: http://sabre.io/xml/
