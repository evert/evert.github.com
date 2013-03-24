---
date: 2010-04-13 13:38:58 UTC
layout: post
slug: html5-on2-vp8-h264-ogg-theora
title: "HTML5 video: On2 VP8, H.264 and Ogg Theora"
tags:
  - h264
  - html5
  - on2 vp8
  - ogg
  - theora

---
<p>HTML 5 video is coming, but which codec is going to be used to deliver it?</p>

<p>Internet Explorer, Safari and Chrome have chosen on H.264, while Firefox and Opera are going for Ogg Theora. For us developers this sucks, because there is no one codec we can bet on to work in any browser. There's flash, which is more ubiquitous than any single browser, but it's a whole new toolchain to learn, and in my opinion it's a declining technology which will one day join the ranks of shockwave and &gt;applet&lt;. The future is in HTML, so what to do? Unfortunately there's no easy answer, so the most I can do is give an overview of what is going on today.</p>

<h3>Choose multiple</h3>

<p>First and foremost, keep in mind that the standard for the &lt;video&gt; tag allows multiple codes. You can easily specify a video tag with both an ogg vorbis and an H.264 source. This works as follows:</p>

```html

<video controls="true">  
   <source src="video.ogg" type="video/ogg" />  
   <source src="video.mp4" type="video/mp4" />
  
   Alternative content

</video>

```

<p>There are big drawbacks to this approach though. Having 2 different files means it will take (about) twice as much diskspace, cpu, energy and time to encode. So there is definitely benefit in having a single filetype that works everywhere.</p>

<h3>H.264</h3>

<p><a href="http://en.wikipedia.org/wiki/H264">H.264/MPEG-4 AVC</a> seems to have the most backing at the moment, getting support from Chrome, Safari and Internet Explorer. H.264 is widely regarded as technically superior. What this means beyond anything else is that it has the best quality/compression ratio. It's encoders are better, there's plenty of competition and it's already widely in use.</p>

<p>The big issue is that H.264 is owned by the <a href="http://www.mpegla.com/main/default.aspx">MPEG LA</a> organization. Technology within the H.264 is patented by many different companies, which all came together in MPEG-LA. There's very little chance H.264 is becoming an open standard.</p>

<p>This doesn't mean it's not free to use today. MPEG-LA initially planned to expire the current royalty-free license this year, but it's been extended until 2015. A very smart move. Now H.264 uptake is going through the roof, it's a much smarter idea to wait until everybody has bought into H.264 and then charge everybody for using it.</p>

<p>This can lead to similar situations to what happened to the GIF image format (<a href="http://en.wikipedia.org/wiki/GIF#Unisys_and_LZW_patent_enforcement">reference</a>), in which Unisys wanted to charge intranets $5000 for using gif images.</p>

<h3>OGG Theora</h3>

<p>The alternative is choosing for Theora. If you choose for Theora there's no risk (provided there's no future patent claims on the technology) you will get sued 5 years in the future for putting up video on the web. Theora was developed as an open standard.</p>

<p>From this perspective it's understandable why an open source company like Mozilla would go for Theora over H.264. It might be technically not as great as H.264, but at least the entire internet won't get a huge bill from MPEG LA 5 years in the future.</p>

<p>What completely amazes me is that the other browser vendors do not provide support for OGG. I understand there's a preference for H.264, but there is absolutely no reason to not provide support for multiple video codecs. Even if the browsers just interfaced with the media layers on the respective operating systems (<a href="http://en.wikipedia.org/wiki/GStreamer">GStreamer</a>, <a href="http://en.wikipedia.org/wiki/Core_Video">Core Video</a>, <a href="http://en.wikipedia.org/wiki/DirectShow">DirectShow</a>). it would allow users themselves to install the codec. You can disagree with Mozilla, but they're making an ideological standpoint. The other vendors however, I can't think of a reason why they wouldn't <strong>also</strong> want to support ogg.</p>

<h3>And then there's VP8</h3>

<p>VP8 (and VP1 - 7) has been developed by On2. On2 has quite a reputation. VP3 was released as an open codec, which ended up becoming the basis for Ogg Theora. VP6 is one of the major codecs in the Flash Player since 2005, and VP7 is the video codec used by Skype. Technically it's supposed to match H.264.</p>

<p>Google 'finalized' buying On2 in february, and since then it controls VP8. There's been many speculations about google buying them to open source the codec and make it the winning standard. Even the FSF has written an <a href="http://www.fsf.org/blogs/community/google-free-on2-vp8-for-youtube">open letter</a> asking them to do just this. This would be great news for the web, because it would provide a codec that meets all the interested party's requirements. Just yesterday <a href="http://newteevee.com/2010/04/12/google-to-open-source-vp8-for-html5-video/">newteevee</a> reports this might actually come to happen, and it should be announced at Google's I/O conference. </p>

<p>I'm worried though. Microsoft tried to make it's own codec (<a href="http://en.wikipedia.org/wiki/VC-1">VC-1</a>) the big video standard. It actually believed at one point it completely owned the standard, until the MPEG-LA members got an eye on it. It turned out Microsoft infringed patents of over 16 different patent holders (<a href="http://www.theregister.co.uk/2007/04/14/microsoft_vc-1_codec_analysis/page2.html">reference</a>). I'm willing to bet microsoft has more lawyers on staff than On2 had employees. I can't imagine On2 has not made similar mistakes.</p>

<p>If Google indeed tries to release VP8 as an open, royalty free standard, I would be surprised it doesn't turn out that it didn't even own it in the first place.</p>

<h3>One last word</h3>

<p>Don't forget that the only reason we are in this mess in the first place, is because it's legal in most countries to claim ownership of ideas presented as software. Whether or not software patents could make sense from a theoretical point of view, in practice it's preventing innovation because large corporations have the legal advantage.</p>

<p>This problem would not exist if it weren't for software patents.</p>
