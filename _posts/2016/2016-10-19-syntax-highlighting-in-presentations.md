---
date: 2016-10-19 19:14:17 -0400
layout: post
title: "Syntax highlighting in presentations"
tags:
   - libreoffice 
   - make  
geo:  [43.642392, -79.414486]
location: "Shank St, Toronto, ON, CA"
---

I often go back and forward between presentations software, trying to find
the best one, never being happy. I [recently used cleaver][1], which is nice
for simple stuff, but this time I'm back to LibreOffice Impress because I
don't want to spend a long time fighting with layout.

One task that's never super obvious is figuring out how to do syntax
highlighting of code in my presentations. I wanted to share my solution. I'm
fairly sure this will also work for MS Office and maybe even Keynote.

First, download [Pygments][2]. Pygments is a syntax highlighting tool for the
command line.

On ubuntu it can be installed with:

	apt-get install python-pygments

If you're on a Mac, I don't believe there's a homebrew package. This _should_
work though:

	sudo easy_install Pygments

After that, we're using the tool to convert your source file into a syntax
highlighted [RTF file][3]! Yes, the old school format you'd never thought
you'd need again.

Run it like this:

	pygmentize -O style=xcode -o output.rtf input.js

I picked the `xcode` style, because it worked fairly well with the light
backgrounds in my presentation, but other styles are supported. To see a list
run:

	pygmentize -L

Instead of pygmentize I also tried [highlight][4], but it was impossible for
me to build and seems a bit over engineered.

Using the file
--------------

In LibreOffice Impress, just click "Insert" and then "File" to find your rtf
file.


Batch syntax highlighting
-------------------------

I don't want to have to type this every time, so I made this Makefile to
automatically do this. The file assumes that you have:

* A `src/` directory containing `.js` files (you can change the extension).
* An empty `rtf/` directory.

```make

STYLE=xcode
SRC = $(wildcard src/*.js)

RTF = $(patsubst src/%.js, rtf/%.js.rtf, $(SRC))

all: $(RTF)

rtf/%.js.rtf: src/%.js
	pygmentize -O style=$(STYLE) -o $@ $<

clean:
	rm rtf/*.rtf

```


[1]: https://evertpot.com/go-for-php-programmers/
[2]: http://pygments.org/docs/cmdline/
[3]: https://en.wikipedia.org/wiki/Rich_Text_Format
[4]: http://www.andre-simon.de/doku/highlight/en/highlight.php
