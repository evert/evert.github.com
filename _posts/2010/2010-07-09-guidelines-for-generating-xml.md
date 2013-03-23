---
date: 2010-07-09 17:19:59 UTC
layout: post
slug: guidelines-for-generating-xml
title: Guidelines for generating XML
categories:
  - php
  - cdata
  - xml
  - unicode

---
<p>Over the last little while I've come across quite a few XML feed generators written in PHP, with varying degrees of 'correctness'. Even though generating XML should be very simple, there's still quite a bit of pitfalls I feel every PHP or (insert your language)-developer should know about.</p>

<h3>1. You are better off using an XML library</h3>

<p>This is the first and foremost rule. Most people end up generating their xml using simple string concatenation, while there are many dedicated tools out there that really help you generate your own XML.</p>

<p>In PHP land the best example is <a href="http://nl2.php.net/manual/en/book.xmlwriter.php">XMLWriter</a>. It is actually quite easy to use:</p>

<code lang="php"><?php

$xmlWriter = new XMLWriter();
$xmlWriter->openMemory();
$xmlWriter->startDocument('1.0','UTF-8');
$xmlWriter->startElement('root');
$xmlWriter->text('Contents of the root tag');
$xmlWriter->endElement(); // root
$xmlWriter->endDocument();
echo $xmlWriter->outputMemory();

?>``` 

<p>Granted, XMLWriter is verbose, but you have to worry a lot less about escaping and validating your xml documents.</p>

<h3>2. Understand Unicode</h3>

<p>Do you know the difference between a byte, a character and a codepoint? If you don't, I'd probably think twice about hiring you. It's absolutely shocking how many programmers are out there that don't understand the basics of unicode, UTF-8 and how it relates to the web.</p>

<p>An often-heard excuse for not having to care for non-ascii characters, such as people in English speaking countries. However, if you need to use the euro-sign (€) or if you deal with people copy-pasting from word documents, you most definitely will come across problems.</p>

<p>A simple call to <a href="http://nl.php.net/manual/en/function.utf8-encode.php">utf8_encode</a> is not actually enough. If some of your source-data was already encoded as UTF-8 you will end up losing data. <strong>Only</strong> use utf8_encode if you know your source-data is encoded as ISO-8859-1.</p>

<p>The one true way to go about it, is to make sure that every step of the way in your web application is UTF-8. Including your HTTP/HTML contenttype, MySQL database and anything that basically ingests data for your application (email, csv importers, xml readers, web services). Once you are absolutely sure every part in your application is UTF-8, and converted any old data things will start to behave correctly.</p>

<h3>3. CDATA is never a solution</h3>

<p>It might be tempting to solve any encoding issues by simply surrounding it with <em>&lt;![CDATA[</em> and  <em>]]&gt;</em>. This might make sure that XML parsers don't throw an error when reading, but they still have 'incorrect' characters. If your XML document has CDATA tags, or you think you need CDATA, you are probably wrong.</p>

<p>More often than not using CDATA actually stems from encoding problems (see section 2). CDATA is not a method to encode binary characters, xml parsers will still throw errors if they come across certain byte sequences. If you do really need to encode binary data in XML, the best way is to use something like <a href="http://nl.php.net/manual/en/function.base64-encode.php">base64_encode</a> instead.</p>

<p>If your XML feed uses CDATA because of encoding issues you actually defer your problem to the consumer of your XML feed. So instead of seeing 'weird characters' on your side, the person that reads your xml feed now has no good way to detect which encoding was actually used. If it's for example an RSS feed you're generating, this can result in RSS readers throwing errors, or characters showing up incorrectly.</p>

<h3>4. Be liberal with whitespace</h3>

<p>An error like "unexpected character at line 1, column 176456" is much harder to debug than "line 5078, column 24". Whitespace between xml tags does usually not have any significance, so you can add as much indentation and linebreaks (\n) as you want. Note that tools such as <a href="http://nl2.php.net/manual/en/ref.xmlwriter.php">XMLWriter</a> will indent for you automatically.</p>

<h3>5. Be verbose</h3>

<p>Even though you might easily figure out that &lt;ORD_NR&gt; means 'order number', there's no reason why you shouldn't actually state it as &lt;order-number&gt;. Note that the following rules appear to fall in favor for most people:</p>

<ul>
  <li>Use lowercase for tags and attribute names.</li>
  <li>Use dashes (-) to separate words, not underscores (_).</li>
  <li>Minimize the use of attributes, nested tags allow more flexibility.</li>
</ul>

<h3>6. Be careful with entities</h3>

<p>The only valid entities in XML are &amp;lt; (&lt;), &amp;gt; (&gt;) &amp;amp; (&amp;) and &amp;quot; (&quot;), so any other entity will simply not work and throw errors.</p>

<p>HTML DTD's add many entities, so if you're mostly used to using HTML you might expect other entities to work. If your source-data already has entities, you might have to get rid of these first.</p>

<p>In PHP it means you should use <a href="http://nl3.php.net/manual/en/function.htmlspecialchars.php">htmlspecialchars</a>, instead of <a href="http://nl.php.net/manual/en/function.htmlentities.php">htmlentities</a>.</p>

<p>Feel free to discuss, disagree, or add on to this list in the comments, I'm happy to hear your experiences.</p>