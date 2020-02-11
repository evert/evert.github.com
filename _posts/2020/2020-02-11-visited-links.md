---
title: "Use a:visited in your CSS stylesheet"
date: "2020-02-11 23:01:32 UTC"
tags:
  - html
  - links
  - css
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---


By default browsers will render links blue, and links that have been visited
purple.

This quality of life feature goes back as far as I can remember, a casual
search tells me the feature existed in Mosaic.

I kinda love blue links. They're so recognizable as links. But with CSS, many
people change the colors of their links.

```css
a { color: #44F }
```

Unfortunately, when setting a new color the 'purple visited link' feature also
gets disabled. I think this is a shame, as there's so many instances where
you're going through a list of links and want to see what you've seen before.

The 2 examples I ran into today were:

* AWS Cloudwatch Logs
* Stackoverflow search results

In each of these products I often find myself going through a list of results,
to find the exact log I need, or to go through a couple of answers before I find
a good one.

Except, every time I hit back, or go to a previous tab it's up to me to remember
which I have and haven't visited.

<img src="/assets/posts/aws.png" style="max-width: 100%" alt="AWS Cloudwatch logs" />

I get that not everyone wants to multi-colored links across their application,
but if you're making a list, consider the humble purple link!

```css
a:visited { color: purple }
```
