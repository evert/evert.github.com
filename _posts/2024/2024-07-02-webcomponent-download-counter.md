---
title: "Creating a fake download counter with Web Components"
date: "2024-07-02 16:07:33 UTC"
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
and show a 'live' download counter on my blog.

This is how that looks like:


> My open source packages were downloaded roughly
<strong><download-counter inc-per-day="157444" date="2024-06-29T15:34:00Z">138945563</download-counter></strong> times.

Like most live counters, this number isn't tracked in real-time. Instead it
just uses a start number and updates the number based on an average number
of downloads.

One day it might be nice to make it live, but this is a static blog and this
would need proper hosting and a database.

### Why is this number so high?

This data comes from NPM and Packagist, and they both
count any download. So this number doesn't represent necessarily 138 million
users, but simply this many downloads by any means including bots, CI
environments and so on. I think for both package managers the goal was
probably not to have a realistic representation of users, but rather a number
that makes developers feel good. And I like that. It's nice to see a number
go up and it's still a nice proxy for relative popularity.

The Web Component
-----------------

This seemed like a good use-case for a web component. Always wanted to build
one! I was surprised how easy it was.

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
class DownloadCounter extends HTMLElement {

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

You cannot easily ask these APIs what the download count or download rate at a
given date was, and for both the numbers might be a bit delayed. So I've opted
to simply:

* Get a grand total of all downloads up until this date.
* Wait at least 24 hours or more.
* Get another grand total and use the difference to caclulate average download rate.

Below is my approach for getting the numbers from NPM and Packagist. It's a bit
messy and imperative.

### NPM

The NPM api gave me weird, incomplete results for getting the whole list of packages
I've authored, so I worked around this by hardcoding some package names, and then
augmenting this with the result of 3 searches.

This gives us the full list of packages I'm interested in:

```javascript
// Searches

const npmSearches = [
  // by author
  'author:evrt',

  // by org name
  'scope:badgateway',
  'scope:curveball',
];

// Hardcoded extra packages that for some reason didn't get returned with
// the searches
const npmPackages = {
  'davclient.js': 0,
  'structured-headers': 0,
  'bigint-money': 0,
  'fetch-mw-oauth2': 0,
  'hal-types': 0,
  'react-ketting': 0,
  'ketting': 0,
  'html-form-enhancer': 0,
  'changelog-tool': 0,
};


async function fetchNpmPackageList() {

  for(const search of npmSearches) {

    const res = await fetch('https://registry.npmjs.org/-/v1/search?text=' + search);
    const body = await res.json();

    for(const object of body.objects) {
      npmPackages[object.package.name] = 0;
    }
  }

}
```

NPM doesn't return absolute total download counts but instead we can get a
count for a specific time range with a maximum range of 18 months. I've
opted to instead to get download counts per year, counting backwards for
each package until get a result of 0.

```javascript
async function fetchNpmDownloadCounts(packageName) {

  let year = new Date().getFullYear();
  let count = 0;
  let yearCount;

  do {
    yearCount = await fetchNpmDownloadCountsByYear(packageName, year);
    count += yearCount;
    year--;
  } while (yearCount > 0);

  console.log('%s: %i', packageName, count);
  return count;
}

async function fetchNpmDownloadCountsByYear(packageName, year) {

  const res = await fetch(`https://api.npmjs.org/downloads/point/${year}-01-01:${year}-12-31/${packageName}`);
  const body = await res.json();
  return body.downloads;

}
```

### Packagist

Getting totals from packagist was considerably easier:

```javascript
const packagistOrgs = [
  'sabre',
  'evert',
];

const packagistPackages = {};

async function fetchPackagistPackages() {

  for(const vendor of packagistOrgs) {
    const res = await fetch(`https://packagist.org/packages/list.json?vendor=${vendor}`);
    const body = await res.json();
    for(const pkg of body.packageNames) {
      packagistPackages[pkg] = 0;
    }
  }

}

async function fetchPackagistDownloadCounts(packageName) {

  const res = await fetch(`https://packagist.org/packages/${packageName}/stats.json`);
  const json = await res.json();
  const count = json.downloads.total;

  console.log('%s: %i', packageName, count);

  return count;

}
```

### Putting it together

```javascript
async function main() {

  await fetchNpmPackageList();
  await fetchPackagistPackages();

  for(const pkg of Object.keys(npmPackages)) {
    npmPackages[pkg] = await fetchNpmDownloadCounts(pkg);
  }

  for(const pkg of Object.keys(packagistPackages)) {
    packagistPackages[pkg] = await fetchPackagistDownloadCounts(pkg);
  }

  const packagesCombined = [];
  for(const [packageName, downloads] of Object.entries(npmPackages)) {
    packagesCombined.push({
      ecosystem: 'npm',
      packageName,
      downloads
    });
  }
  for(const [packageName, downloads] of Object.entries(packagistPackages)) {
    packagesCombined.push({
      ecosystem: 'packagist',
      packageName,
      downloads
    });
  }
  console.log(packagesCombined);
  console.log('Total: %i', packagesCombined.reduce((acc, cur) => acc+cur.downloads, 0));

}
await main();
```

Conclusion
-------

Whenever I need small bits of Javascript to enhance a web application (and
not a full-blown framework) I tend to write code that looks for an element
with a particular class, and then start my logic and hook up events.

Web Components seems like a really great replacement for that.

Got comments? Liked this aticle? You can reply to [this Mastodon post][1]
to make the comments show up here.

[1]: #
