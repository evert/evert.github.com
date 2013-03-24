---
date: 2010-05-17 15:33:52 UTC
layout: post
slug: when-to-escape-your-data
title: "When to escape your data"
tags:
  - php
  - html
  - websec
  - mysql
  - escaping

---
<p>Two examples of escaping data are the following:</p>

<ul>
  <li>Before you insert a value into a SQL query, using for example <a href="http://kr2.php.net/manual/en/mysqli.real-escape-string.php">mysqli::real_escape_string()</a> or <a href="http://kr2.php.net/manual/en/pdo.quote.php">PDO::quote()</a>.</li>
  <li>Before you insert data into your output HTML, using <a href="http://kr2.php.net/manual/en/function.htmlspecialchars.php">htmlspecialchars()</a>.</li>
</ul>

<p>The question I'd like to ask today is, when to do this? There are two possible moments:</p>

<ol>
  <li>Right when the data comes in. For SQL this used to be done with 'magic quotes' quite a bit in PHP-land. In general I don't see this happening a lot anymore for SQL. I do however see data encoded using htmlentities/htmlspecialchars before entering the database.</li>
  <li>The other way to go about it, is to only escape when you know how you're going to use it. For example, only call htmlspecialchars right before you echo() your data into your document.</li>
</ol>

<p>I would personally argue that #2 is the best way to go about things. The first reason is that you don't know exactly how your data might be used in the future. If you pre-encoded everything using htmlentities, but at some point in the future you need the data to be used in an XML feed, you're going to be in trouble. The reason for this, is that the only valid entities in XML are &amp;amp;, &amp;lt;, &amp;gt;, and &amp;quote;. If you are going to need to need to output to CSV, very different rules apply. Other examples are: escaping for urls, escaping for command-line arguments, escaping for javascript and escaping for mime-headers.</p>

<p>In the illustrated example, this is no big disaster. A workaround would be to call htmlspecialchars_decode() or html_entity_decode() first, and then escape for your desired output. A worse case is filtering. If you have been stripping out all, or some html tags before saving it do the database, and later on your decide you wanted to show some of them anyway, that data is now lost.</p>

<h3>Conclusion</h3>

<p>So my argument is to store raw data. Only encode right before you know where you going to need it. If you're worried about the overhead of escaping right before output in an html page, cache the output.</p>

<p>Whichever route you go, make sure this is clearly documented. There's 2 ways this can go wrong:</p>
 
<ol>
  <li>Escaping is done on input and output. Now you see literal &amp;amp;'s in your html, or quotes prepended by slashes. (\'hello\').</li>
  <li>Escaping is forgotten at both ends. Now you might be vulnerable to SQL injection attacks, XSS attacks or data corruption.</li>
</ol>

<p>What do you think? I'm especially interested in the other side of the argument.</p>
