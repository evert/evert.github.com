---
date: 2012-11-09 12:50:21 UTC
layout: post
slug: markdown-output-for-phpdocumentor2
title: "Markdown output for PHPDocumentor2"
tags:
  - github
  - phpdocumentor
  - phpdoc
  - markdown

---
<p>I'm moving some <a href="https://github.com/fruux/sabre-dav">codebases</a> to PHP namespaces, and as a result I could no longer use my crappy API documentation script.</p>

<p>So, I needed a replacement, and with the help of <a href="http://www.phpdoc.org/">PHPDocumentor</a>, I was able to create a simple package that outputs github-compatible markdown documentation, based on <a href="http://twig.sensiolabs.org/">twig</a> templates.</p>

<p><a href="https://github.com/fruux/sabre-dav/wiki/Sabre-DAV-FS-Directory">Here's an example</a>.</p>

<p>It's not perfect yet, but hopefully useful for others in the same boat. You can find the project and setup instructions here:</p>

<p><a href="https://github.com/evert/phpdoc-md">https://github.com/evert/phpdoc-md</a>.</p>
