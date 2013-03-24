---
date: 2011-04-18 20:20:37 UTC
layout: post
slug: escaping-mysql-strings-with-no-connection-available
title: "Escaping MySQL strings with no connection available"
tags:
  - mysql
  - escaping

---
We're all being drilled over and over again to always use <a href="http://nl3.php.net/manual/en/mysqli.real-escape-string.php">mysqli::escape_string</a>, <a href="http://nl3.php.net/manual/en/pdo.quote.php">PDO::quote</a>, or preferably prepared statements when escaping user-supplied strings for use in MySQL queries.

The downside to these methods is that they only work when there's an open connection to a server. So what if there's no connection available? In traditional Unix philosophy I'm writing an export script that doesn't execute SQL statements right to a server, but sends them to stdout. Forcing people to make a connection seems like a major inconvenience.

So what's left? Manual escaping I suppose.. The manual page for <a href="http://nl3.php.net/manual/en/mysqli.real-escape-string.php">mysqli::escape_string</a> mentions: _Characters encoded are NUL (ASCII 0), \n, \r, \, ', ", and Control-Z._

```php
<?php
function dontHateMe($unescaped) {
  $replacements = array(
     "\x00"=>'\x00',
     "\n"=>'\n',
     "\r"=>'\r',
     "\\"=>'\\\\',
     "'"=>"\'",
     '"'=>'\"',
     "\x1a"=>'\x1a'
  );
  return strtr($unescaped,$replacements);
}
?>
```

There's a risk though.. Certain multi-byte character sets (such as BIG5 and GBK) may still allow for a security hole. You *should* be fine with UTF-8, so make sure you start your file with:

```sql

SET CHARACTER SET utf8;

```

Still no guarantee from my side though. Tread carefully and avoid this if you can. If you have a better idea, or you feel like shouting at me for this.. let's hear it in the comments.

Special thanks to <a href="http://stackoverflow.com/questions/5696355/exporting-data-to-a-sql-format-how-to-escape/5702846#5702846">Spudley</a> for providing me with a reasonable answer to this question.
