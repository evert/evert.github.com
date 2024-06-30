---
title: "Creating a fake download counter with Web Components"
date: "2024-07-02 11:39:51 UTC"
geo: [43.663961, -79.333157]
location: "Leslieville, Toronto, ON, Canada"
tags:
  - open source
  - web components
  - npm
  - packagist
---

Over the years I've written several open source libraries. They're mostly
unglamorous and utilitarian, but a bunch of them obtained got a decent
download count, so I thought it would be fun to try and get a grand total
and show a live download counter on my blog.

This is how that looks like:

My open source packages were downloaded roughly
<strong><download-counter inc-per-day="157444" date="2024-06-29T15:34:00Z">138945563</download-counter></strong> times.

Like most live counters, this number isn't tracked in real-time. Instead it
just uses a start number and updates the number based on an average number
of downloads.

One day it might be nice to make it live, but this is a static blog and this
would require I need some kind of host. Anyway, this is how I've built it.

It should be noted that this is a pretty high number, almost unreasonably so.
(over 138 million now). This data comes from NPM and Packagist, and they both
count any download. So this number doesn't represent necessarily 138 million
users, but simply this many downloads by any means including bots, CI
environments and so on. I think for both package managers the goal was
probably not to have a realistic representation of users, but rather a number
that makes developers feel good. And I like that. It's nice to see a number
go up and it's still a nice proxy for relative popularity.

The Web Component
-----------------

This seemed like a good use-case for a web component. Always wanted to build
one! And dang it was really elegant.

This is how this looks in the HTML:

```html
<p>
  My open source packages were downloaded roughly
  <strong>
    <download-counter inc-per-day="157444" date="2024-06-29T15:34:00Z" >
      138945563
    </download-counter>
  </strong> times.
</p>
```

What's nice is that if Javascript is not enabled, or Web Components are
not supported, this will just fall back on showing the static number.

I included 3 parameters:

* The last recorded download count (in the element value)
* When that number was recorded (date)
* Average number of downloads per day.

I wanted to include the date because I only intend to update these numbers
rarely, so we need to know how many downloads have elapsed since the last
time.

Writing the web component was surprisingly straightforward too. Here is it
in its fully glory:

```javascript
class DownloadCounter extends HTMLSpanElement {

  connectedCallback() {
    this.count = +this.textContent;
    this.date = new Date(this.getAttribute('date'));
    this.inc = (+this.getAttribute('inc-per-day')) / (3600 * 24 * 1000) 
    this.calculateCurrentDownloads();

  }

  calculateCurrentDownloads() {

    const currentDownloads =
      Math.floor(
      this.count +
      (Date.now()-this.date) * this.inc
      );

    // Intl.NumberFormat adds thousands separators
    this.textContent = Intl.NumberFormat().format(currentDownloads);

    setTimeout(
      () => this.calculateCurrentDownloads(),
      // Add some randomnes
      Math.floor(Math.random() * 150)+50,
    );

  }

}

customElements.define(
  'download-counter',
  DownloadCounter, 
  { extends: 'span' }
);
```

Now just include the file in the HTML and you're good to go:

```javascript
<script type="module" src="/assets/js/downloadcounter.mjs"></script>
```

Obtaining the data
------------------

I've published 20 PHP libraries on [packagist](https://packagist.org/) and 30
Javascript libraries on [NPM](https://www.npmjs.com/). This is too much to
count, so instead I wrote some scripts that pull in the data for their
respective APIs.


