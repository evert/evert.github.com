---
date: 2012-01-21 18:10:08 UTC
layout: post
slug: rfc-search-provider
title: "RFC search provider"
tags:
  - opensearch
  - rfc
  - phpfog

---
<p>In my work I have to look a lot at the IETF rfc documents, and I always have to jump through a bunch of hoops to find the document I want. Google often links me to the text version, and often I'm looking at obsoleted versions of documents when a new rfc has been published.</p>

<p>Well, so I created a simple <a href="https://developer.mozilla.org/en/Creating_OpenSearch_plugins_for_Firefox">OpenSearch provider</a> to solve this. It does exactly what I need, and I only tested in Firefox. If it's useful to anyone else, you can add the provider from <a href="http://rfcsearch.phpfogapp.com/">rfcsearch.phpfogapp.com</a>.</p>

<p>It works with a simple hardcoded list of known keywords, and it will fall back to "Google's I'm feeling lucky" if it doesn't know the keyword. Feel free to <a href="https://github.com/evert/rfcsearch">fork it</a> or laugh at my source code.</p>
