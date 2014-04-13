---
date: 2010-11-23 20:58:18 UTC
layout: post
slug: icalendar-vcard-parser-for-php
title: "iCalendar / vCard parser for PHP"
tags:
  - php
  - sabredav
  - icalendar
  - caldav
  - ics
  - vcf
  - vcard
  - parser

---
<p><strong>Updated</strong></p>

<p>I've just finished an iCalendar vCard parser for PHP. It's done almost completely with a 'natural' simplexml-like interface, so it should (hopefully) be just as easy to parse, and also modify iCalendar / vCard objects (ics/vcf files).</p>

<p>To install using pear, run the following:</p>

    pear channel-discover pear.sabredav.org
    pear install sabredav/Sabre_VObject-alpha

<p><small>Or download from <a href="http://pear.sabredav.org/">pear.sabredav.org</a>.</small></p>

<p>For testing, I used this iCalendar file: <a href="http://evertpot.com/resources/files/posts/icalendartest.ics">icalendartest.ics</a>.</p>

<p>To load in an object, you use the Reader class:</p>

```php
<?php

// Link to the correct path if you manually dowloaded the package
include 'Sabre/VObject/includes.php';

// Reading an object
$calendar = Sabre_VObject_Reader::read(file_get_contents('icalendartest.ics'));

?>
```

<p>iCalendar objects consist of components (VEVENT, VTODO, VTIMEZONE, etc), properties (SUMMARY, DESCRIPTION, DTSTART, etc) and parameters, which are to properties what attributes are to elements in XML. To show a listing of all events in a calendar, this snippet would work:</p>

```php
<?php

echo "There are ", count($calendar->vevent), " events in this calendar\n";

// Looping through events
foreach($calendar->vevent as $event) {

    echo (string)$event->dtstart, ": ", $event->summary, "\n";

}

?>
```

<p>You can easily modify properties:</p>

```php
<?php
$calendar->vevent[0]->description = "It's a birthday party";
?>
```

<p>Creating new objects uses the following syntax:</p>

```php
<?php
$todo = Sabre_VObject_Component::create('vtodo');
$todo->summary = 'Take out the dog';
$calendar->add($todo);
?>
```

<p>And to turn your newly modified calendar back into an ics file:</p>

```php
<?php
file_put_contents('output.ics', $calendar->serialize());
?>
```

<p>Lastly, parameters are accessible through array-syntax:</p>

```
<?php
echo (string)$calendar->vevent[0]->dtstart['tzid'], "\n";
?>
```

<p>I had fun building this, I hope it's useful to you as well. It's 100% unittested, but bugs might still appear due to the complex nature of API. Use at your own risk :). This library will be part of the <a href="http://sabre.io/">SabreDAV</a> project, which is also where you can go for the source, report bugs or make suggestions.</p>

<h3>Update 31-05-2012</h3>

<p>I added the following below as a response to some of the questions</p>

<h3>Creating new calendars</h3>

<p>Creating a new calendar works similar to creating a new component. Simply:</p>

```php
<?php

$vcal = Sabre_VObject_Component::create('VCALENDAR');
$vcal->VERSION = '2.0';
$vcal->PRODID = '-//SabreDAV//SabreDAV//EN';
$vcal->CALSCALE = 'GREGORIAN';

?>
```

<p>After that, you can use the 'add' function on the calendar to add additional components and properties.</p>

<h3>Creating a new DTSTART (or other date element)</h3>

<p>You can just use the following syntax:</p>

```php
<?php

$vevent = Sabre_VObject_Component::create('VEVENT');
$vevent->DTSTART = '20120101T000000Z';

?>
```

<p>But it's also possible to pass in PHP DateTime objects. However, the syntax for this is not that great:</p>

```php
<?php

$dateTime = new DateTime('now', new DateTimeZone('Europe/London'));

$vevent = Sabre_VObject_Component::create('VEVENT');
$dtstart = Sabre_VObject_Property::create('DTSTART');
$dtstart->setDateTime($dateTime, Sabre_VObject_Property_DateTime::LOCALTZ);

?>
```

<p>The last constant represents how you want the date and time to be represented. In this case it will be represented as a local time with a timezone identifier, but it's also possible to specify it as a date-only string, local (floating time) with now tz information, or a UTC time. Check the source of that class for more info.</p>

