---
date: 2011-08-30 02:01:25 UTC
layout: post
slug: fake-googlecom-ssl-certificate-in-the-wild
title: "Fake *.google.com SSL certificate in the wild"
tags:
  - websec
  - ssl

---
<p>Interesting news passed by today, apparently a fraudelent SSL was issued by <a href="http://www.diginotar.com/">Diginotar</a>, effectively allowing wrong-doers to perform MITM attacks for all google services. Normally fake certificates will clearly error up in the browser, but because Diginotar is a trusted CA (certificate authority) it won't.</p>

<p>This says something about how much we can trust SSL. All it takes is one corrupt employee at a trusted CA and it falls down. <a href="http://news.cnet.com/8301-27080_3-20098894-245/fraudulent-google-certificate-points-to-internet-attack/">CNET</a> has pretty good coverage of the story.</p>
