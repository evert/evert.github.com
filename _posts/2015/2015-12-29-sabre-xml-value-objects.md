---
date: 2015-12-29 16:27:09 -0500
layout: post
title: "Parsing Atom with sabre/xml"
tags:
    - php
    - sabre/xml
    - xml
    - atom
---

[Today sabre/xml 1.3][1] was released and it brings a few new features to make it
even easier to parse many XML documents.

1.3 in particular brings a new [value objects][2] feature that makes it extremely
straightforward to map specific XML elements to PHP objects bi-directionally.

Here's an example, given the following xml document:

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
 <title>Example Feed</title>
 <link href="http://example.org/"/>
 <updated>2003-12-13T18:30:02Z</updated>
 <author>
   <name>John Doe</name>
 </author>
 <id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</id>

 <entry>
   <title>Atom-Powered Robots Run Amok</title>
   <link href="http://example.org/2003/12/13/atom03"/>
   <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
   <updated>2003-12-13T18:30:02Z</updated>
   <summary>Some text.</summary>
 </entry>

</feed>
```

You can imagine that you might want to map this to a PHP object structure such as
this:

```php
<?php

namespace My\Atom;

class Feed {

    public $title;
    public $link = [];
    public $updated;
    public $author;
    public $id;
    public $entry = [];

}

class Author {

    public $name;
    public $email;

}

class Entry {

    public $title;
    public $link = [];
    public $id;
    public $updated;
    public $summary;

}
```

To achieve this, all you need to do is call the following:

```php
<?php

$service = new Sabre\Xml\Service();
$service->namespaceMap['http//www.w3.org/2005/Atom'] = 'atom';

$service->mapValueObject('{http://www.w3.org/2005/Atom}feed', 'My\Atom\Feed');
$service->mapValueObject('{http://www.w3.org/2005/Atom}author', 'My\Atom\Author');
$service->mapValueObject('{http://www.w3.org/2005/Atom}entry', 'My\Atom\Entry');

?>
```

In PHP 5.5 you replace the last 3 lines with:

```php
<?php

$service->mapValueObject('{http://www.w3.org/2005/Atom}feed', Feed::class);
$service->mapValueObject('{http://www.w3.org/2005/Atom}author', Author:class);
$service->mapValueObject('{http://www.w3.org/2005/Atom}entry', Entry::class);

?>
```

Now you have a fully setup `Service` class, and to parse the earlier XML document
all you have to do is call:

```php
<?php

$feed = $service->parse($xml);
// Feed is an instance of My\Atom\Feed;

?>
```

Or if you already have an instance of `My\Atom\Feed` and you want to turn it
into an XML document:

```php
$xml = $service->writeValueObject($feed);
```

Value objects work by inspecting the class you are mapping, and simply
matching the XML element name (in the same XML namespace) to the class
property.

If you initialized a class property with an array, like this:

```php
class Feed {

    public $entry = [];

}
```

This automatically signals the parser that you feed may have more than one
`entry` XML element and always turn it into an array.

This system has some limitations, as it doesn't for example work with XML
attributes, but for those cases you can still fall back on the other facilities
to get access to those. If you paid attention so far, then yes this implies
that the earlier example was not complete: the `<link>` elements would not have
correctly been parsed.

For a full demonstration of this, we're releasing a [`sabre/xml-atom`][3]
package that's basically a full Atom parser. This acts both as a real package
for parsing atom, as well as a demonstration of how you would go about this.
This package *does* parse everything correctly, and thankfully it's fairly
simple.

Anyway, I'm pretty excited about this project. It's the #1 hit on Packagist
when searching for 'XML', and install rates have increased quite a bit. I would
really like the package to become the de-facto solution for people needing to
map PHP data-models to XML documents, and we're slowly getting to a point where
the package addresses many of people's use-cases.

Next time you need to write or parse XML, I hope you take a look!

[1]: http://sabre.io/blog/2015/sabre-xml-1.3-released/
[2]: http://sabre.io/xml/valueobjects/
[3]: https://github.com/fruux/sabre-xml-atom
