---
date: 2010-04-20 16:30:28 UTC
layout: post
slug: filesystem-encoding-and-php
title: "Filesystem encoding and PHP"
tags:
  - php
  - os/x
  - ext3
  - linux
  - unicode
  - filesystem
  - encoding
  - windows
  - ntfs
  - hfs+
  - featured
---
<p>Many PHP applications save files to a local filesystem. Most of the times for the bulk of readers here you'll likely only ever store files using US-ASCII encoding, either because your filenames are simply based on databasefields (as you should try in most cases), or simply because most of your users never have a need for non-english characters.</p>

<p>When you do though, it's important to know how operating systems cope with these characters. Unsurprising, all of them do this differently.</p>

<p>To illustrate the differences, I'm going to do some tests on Ubuntu, OS/X 10.6.3 and Windows XP and 7.</p>

<h3>Linux</h3>

<p>In Linux filenames are binary. Linux does not care what encoding your filenames are, and it will accept anything besides 0x00. This means filenames can contain carriage-returns (\n), tabs (\t) or even a bell (ascii code 07).</p>

<p>To illustrate this, I'm going to make a tiny file using a php script:</p>

```php
<?php
file_put_contents("saved by the \x07.txt","contents");
?>
```

<p>After running this I simply get a questionmark when viewing the file using 'ls', but when I auto-complete it, it expands to ^G (which is bell). In Nautilus, this is displayed:</p>

<p><img alt="fsencoding_gnome.png" src="http://evertpot.com/resources/files/posts/fsencoding_gnome.png" alt="display of bell in gnome nautilus" /></p>

<p>If I run this script:</p>

```php
<?php
print_r(glob('saved*'));
?>
```

<p>The output is simply missing my bell character, and I get a short beep.</p>

<p>This doesn't mean it's a good idea to do this. Even though the underlying filesystem is binary-safe, applications that list filenames will still have to make a decision on an encoding to display the characters to the user.  You can't even show this character in any PHP page, and firewalls might even block this if you used this in a url.</p>

<p>This also applies to the applications on your linux machine. Most of them, such as Gnome Terminal and Nautilus, default to UTF-8. However, I believe for the PuTTY application this was for the longest time ISO-8859-1 (latin1). A symptom of this is that any non-ascii characters look different when read them from Putty vs. Nautilus.</p>

<p>The other thing I wanted to test on linux is how it behaves if I create a file in the filemanager using a special character. For this example I'm using ü, because it's a bit ambiguous as there's multiple ways to encode it using unicode (more on this later) and it also appears in ISO-8859-1.</p>

<p>Back to the test. I'm now creating a new file from the Nautilus interface, and want to see how it shows up for PHP. Im creating a file called test_ü.txt and listing it with the following script:</p>

```php

<?php
list($file) = glob('test_*');
echo urlencode($file) . "\n";
?>
```

<p><strong>Output:</strong></p>

```

test_%C3%BC.txt

```

<p>%C3%BC is the UTF-8 encoding of codepoint U+00FC, which is the most common way to encode ü. Great!</p>

<p>The last test is to create this file using ISO-8859-1/latin1 encoding. The latin1 representation of ü is 0xFC. The script for this:</p>

```php
<?php
file_put_contents("uumlaut_\xFC.txt","contents");
?>
```

<p>Linux stores the file with that exact byte sequence. 'ls' shows the questionmark again, and this type in gnome I'm getting the typical 'incorrect encoding' question mark.</p>

<h3>OS/X</h3>

<p>On OS/X all filenames are encoded as UTF-16. You don't have to know about this, because the API's PHP uses are UTF-8, and are transparently translated for you.</p>

<p>We'll start with the bell test. The result is the same as on linux. The bell character is represented by ?. When checking it out in finder, the character is missing altogether. It's definitely still there though, as the following script illustrates:</p>

```php
<?php
list($filename) = glob('saved*');
echo urlencode($filename) . "\n";
?>
```

<p><strong>Output:</strong></p>

```

saved+by+the+%07.txt

```

<p>Next, we're going to do the ü test. First, I'll encode it as latin-1, which would be invalid for this UTF-8 filesystem.</p>

```php
<?php
file_put_contents("uumlaut_\xFC.txt","contents");
?>
```

<p>This one is weird. If I now do 'ls', the result is this:</p>

```

drwxr-xr-x  10 evert2  staff   340 16 Apr 17:08 .
drwxr-xr-x  32 evert2  staff  1088 16 Apr 16:53 ..
-rw-r--r--   1 evert2  staff     8 16 Apr 16:54 saved by the ?.txt
-rw-r--r--   1 evert2  staff   121 16 Apr 16:54 test1.php
-rw-r--r--   1 evert2  staff     8 16 Apr 16:54 test2.php
-rw-r--r--   1 evert2  staff   101 16 Apr 17:07 test3.php
-rw-r--r--   1 evert2  staff    57 16 Apr 17:08 test4.php
-rw-r--r--   1 evert2  staff     8 16 Apr 17:08 uumlaut_%FC.txt

```

<p>Instead of taking the literal bytes, OS/X urlencoded them, and stored those sequences instead. This translation is transparent; but it might be confusing if you ever try to store latin1 filenames from your users.</p>

<p>The last test is to store the umlaut again, but this time using the correct utf-8 sequence:</p>

```php
<?php
file_put_contents("uumlaut2_\xC3\xBC.txt","contents");
?>
```

<p>Upon first sight this seems to have worked as expected, but it gets weird when we check out how this was actually stored:</p>

```php

<?php
list($file) = glob('uumlaut2_*');
echo urlencode($file) . "\n";
?>
```

<p><strong>Output:</strong></p>

```
uumlaut2_u%CC%88.txt
```

<p>OS/X stored u0xCC88 instead of 0xC3BC. Note that the u is not a typo. OS/X uses a different way to store the ü. The encoding we used is unicode codepoint U+00FC, which is ü. OS/X first stores the u and the two little dots as separate characters, taking up 3 bytes instead of 2.</p>

<p>This is called normalization. Unicode defines a few different normalization models which dictate how these combinations of characters are stored. So even though they are different byte-sequences and different codepoints they are still considered equivalent.</p>

<p>The <a href="http://kr2.php.net/intl">PHP intl extension</a> includes a class that allows you to do the unicode normalization yourself, namely the <a href="http://kr2.php.net/manual/en/class.normalizer.php">normalizer</a> class. The <a href="http://kr2.php.net/manual/en/class.normalizer.php">documentation</a> also includes a short description of what the 4 different normalization forms are. OS/X uses a slightly modified version of Normalization Form D (yes, nobody can ever standardize on anything).</p>

<p>This is how you would do this conversion yourself:</p>

```php

<?php

$before = "\xC3\xBC";
$after = Normalizer::normalize($before, Normalizer::FORM_D);

echo 'Before: ', urlencode($before),  "\n";
echo 'After: ', urlencode($after),  "\n";
?>

```

<p><strong>Output:</strong></p>

```

Before: %C3%BC
After: u%CC%88

```

<p>This normalization process for OS/X is also transparent. Whenever you will try to open a file with the wrong normalization form, OS/X will put it in form D before opening.</p>

<h4>Windows</h4>

<p>Windows also uses UTF-16 to store filenames (using NTFS). Just like OS/X, this translation is done automatically, due to the filesystem api's php uses. We'll start with the bell-test:</p>

```php
<?php
file_put_contents("saved by the \x07.txt","contents");
?>
```

<p><strong>Output:</strong></p>

```
Warning: file_put_contents(saved by the .txt): failed to open stream: Invalid argument in C:\Documents and Settings\Administrator\test\test.php on line 2
```

<p>Indeed, windows does not allow control characters such as bell. The second thing we'll try is the latin-1 encoded ü:</p>

```php
<?php
file_put_contents("uumlaut_\xFC.txt","contents");
list($file) = glob('uumlaut_*');
echo urlencode($file) . "\n";
?>
```

<p><strong>Output:</strong></p>

```
uumlaut_%FC.txt
```

<p>Not only did windows accept this encoding, it also displayed correctly in both cmd.exe, and the windows explorer. So it appears that windows and PHP actually translate from and to ISO-8859-1/latin1 instead of UTF-8. When trying this with the UTF-8 encoding of ü this gets confirmed.</p>

```php
<?php
file_put_contents("uumlaut2_\xC3\xBC.txt","contents");
list($file) = glob('uumlaut2_*');
echo urlencode($file) . "\n";
?>
```

<p><strong>Output:</strong></p>

```
uumlaut2_%C3%BC.txt
```

<p>While windows stores this correctly, the filename is now garbled in cmd.exe and windows explorer. Here it looks like Ã¼. This is pretty bad. I do know that Windows does support UTF-8, so I can't help but wonder what would happen if I do the exact opposite: making a file containing non-ascii characters in windows explorer, and reading out the filename in PHP.</p>

<p>The results were interesting. I used the ü again, and 한글, which is the name of the korean writing system, hangul. With 2 files in this directory, I simply did:</p>

```php
<?php
$files = glob('*');
foreach($files as $file) {
    echo urlencode($file), "\n";
} 
echo "total: " . count($files) . "\n";
?>
```

<p><strong>Output:</strong></p>

```
test.php
uumlaut%FC.txt
total: 2

```

<p>My korean file was completely missing. Just to make sure I did the same with scandir:</p>

```php
<?php
$files = scandir('.');
foreach($files as $file) {
    echo urlencode($file), "\n";
} 
echo "total: " . count($files) . "\n";
?>
```

<p><strong>Output:</strong></p>

```
.
..
hangul_%3F%3F.txt
test.php
uumlaut%FC.txt
total: 5

```

<p>Oddly enough it did show up here. This time however, the korean characters were replaced by %3F, which is, surprise: the question mark. We've seen characters replaced by question marks before, but this is the first time it ends up in a literal string.</p>

<h4>Conclusion</h4>

<p>Using non-latin characters in filenames is messy. It would be possible to provide a consistent experience, if it weren't for windows. Windows does have all the proper api's to deal with international filenames, but I can only assume PHP simply does not support them. I do believe this was scheduled for PHP6, but now that's off the hook. I hope the filesystem api's are replaced even before the entire language is unicode-based.</p>

<p>While the Linux solution (treat everything as binary, allow everything besides 0x00) might seem like the most straightforward, in the end filenames are meant to be written or read by <em>people</em> which means it will be encoded.</p>

<p>The best system in this case really is OS/X, which not only treats everything as UTF-8, it also handles incorrect sequences well and makes sure that characters with an identical meaning are also always stored the same way (normalization).</p>

<p>Here's what I recommend:</p>

<p>If you want to support all characters on all operating systems in a consistent matter, you have no other option than to use an intermediate encoding. You could for instance simply urlencode all your filenames before writing them to disk.</p>

<p>Url-encoding does not mean you can forget about the encoding though. urlencoding means that a different way is used to store certain bytes, but the characters they represent remain the same. Therefore, you should always make sure that the filenames you're using are valid UTF-8 sequences. UTF-8 is today's encoding of choice.</p>

<p>If you know absolutely sure you will only use characters in the ISO-8859-1/latin-1 character-set, the following table applies:</p>

<table>
  <tr><td>Windows</td><td>Encode using ISO-8859-1</td></tr>
  <tr><td>Linux</td><td>Encode using UTF-8 (will accept other encodings, but not recommended).</td></tr>
  <tr><td>OS/X</td><td>Encode using UTF-8. Will transparently encode to normalization-form D</td></tr>
</table>

<p>Here's a table of sequences and what happens on specific operating systems:</p>

<table>
  <tr><th>url-encoded filename</th><th>description</th><th>Linux</th><th>OS/X</th><th>Windows</th></tr>
  <tr><td>%07</td><td>bell</td><td>%07 on disk</td><td>%07 on disk</td><td>throws error and doesn't save</td></tr>
  <tr><td>%FC</td><td>ü in ISO-8859-1</td><td>%FC on disk, question marks in UI's</td><td>%25FC on disk (%25 = %, so the literal string %FC on disk).</td><td>%FC on disk, correct in UI</td></tr>
  <tr><td>%C3%BC</td><td>ü in UTF-8 normalization form C</td><td>%C3%BC on disk. correct in UI</td><td>u%CC%88 on disk, correct in UI</td><td>%C3%BC on disk, shows up as Ã¼ in UI's</td></tr>
  <tr><td>u%CC%88</td><td>ü in UTF-8 normalization form D</td><td>u%CC%88 on disk, correct in UI</td><td>u%CC%88 on disk, correct in UI</td><td>untested, but assumed to be similar to the last testcase.</td></tr>
</table>

<h4>Configuration list</h4>

<p>Lastly, the list of relevant software I used for this:</p>

<ul>
  <li>Windows<ul>
     <li>Tested on XP SP3 and 7</li>
     <li>PHP 5.3.2 VC9 x86 build from <a href="http://windows.php.net">windows.php.net</a></li>
     <li>NTFS filesystem</li>
   </ul></li>
   <li>Linux<ul>
     <li>Ubuntu 9.10</li>
     <li>PHP 5.2.10 from ubuntu package repository</li>
     <li>ext3 filesystem</li>
   </ul></li>
   <li>OS/X<ul>
      <li>v10.6.3</li>
      <li>PHP 5.3.1 as shipped with OS/X</li>
      <li>HFS+ filesystem</li>
   </li>
</ul>
  
