---
date: 2010-10-12 19:28:34 UTC
layout: post
slug: new-ubuntu-font
title: "Ubuntu has a new font"
tags:
  - css
  - ubuntu
  - font-face

---
<p>Along with the release of <a href="http://www.ubuntu.com/">10.10</a>, Ubuntu came with a new self-named font. I love it. It's quirky, yet very legible.</p> 

<p>The font is open-source, with a pretty straightforward license, which comes down to: 'include this license when redistributing. There's very little good free fonts out there that actually allow you to embed it on your site, but with this one you can.</p>

<p>You can download the ttf's from <a href="http://font.ubuntu.com/">here</a>. Embedding it using css is easy:</p>

```css

@font-face {
        font-family: "Ubuntu Sans";
        src: url('font/ubuntu/Ubuntu-R.ttf');
} 
@font-face {
        font-family: "Ubuntu Sans"; 
        src: url('font/ubuntu/Ubuntu-B.ttf'); 
        font-weight: bold
} 
@font-face {
        font-family: "Ubuntu Sans"; 
        src: url('font/ubuntu/Ubuntu-I.ttf'); 
        font-style: italic 
} 
@font-face {
        font-family: "Ubuntu Sans"; 
        src: url('font/ubuntu/Ubuntu-BI.ttf'); 
        font-style: italic; font-weight: bold 
} 

```

<p>This looked immediately brilliant on Firefox, but Safari acts a bit weird, only anti-aliasing some of the text after hovering over.</p>

<p>Be aware though, this will add about 1.3MB to your page. If you don't need some of the italic or bold variations, i'd recommend leaving them out.</p>

<h3>On font and copyrights</h3>

<p>On a more serious note, many people don't know that most fonts you buy for your websites are never allowed to be straight-embedded into webpages. I've seen a number of people embedding their fonts with either @font-face or the dirty (but impressive) <a href="http://cufon.shoqolate.com/generate/">cufon</a>, or the worst of all worlds: <a href="http://www.mikeindustries.com/blog/sifr">sifr</a>.</p>

<p>Technically, with any of these technologies you are not just using, but redistributing the font. When you buy a font you are basically only allowed to generate static images. This might not be a big deal for your personal site, but it's not a wise thing to do for commercial sites.</p>
