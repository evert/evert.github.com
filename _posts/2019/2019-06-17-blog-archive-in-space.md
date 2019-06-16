---
title: "Blog archive in space"
date: "2019-06-17 21:14:00 UTC"
tags:
  - blog
  - archive
  - geo
  - kml
  - jekyll
---

I've been writing articles on this blog for about 13 years, and for a while
now I've marked all of the 400ish articles with geo tags.

This blog is [Jekyll][1]-based. To add Geo tags, all I had to do was add
the information to the 'front-matter'. Here's the header of a sample post:

<!--more-->

```yaml
title: "Browser tabs are probably the wrong metaphor"
date: "2019-06-11 21:14:00 UTC"
tags:
  - browsers
  - ux
geo: [43.660773, -79.429926]
location: "Bloor St W, Toronto, Canada"
```

I thought it would be neat to grab all these posts and plot them on a map, so
next to my 'time-based' archive, I can look at a 'space-based' one.

This is how that looks like:

<figure>
  <a href="/map"><img src="/resources/images/posts/map/blog-map.png" style="max-width: 100%" /></a>
  <figcaption>The archive of this blog in space!</figcaption>
</figure>

Want to check it out? [Browse this interactive map][2]

To generate this map, I did two things. First I generated a .kml file. The
process for this is basically the same as generating an atom feed for your
Jekyll blog. This is how mine looks like:

```markdown
{{ "---" }}
layout: null
{{ "---" }}
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
  <Document>
    <name>{{ "{{ site.title "}}}}</name>
    <description>
      This map contains a list of locations where I wrote an article on this blog.
    </description>
    <Folder>
      <name>Posts</name>
      {{ "{% for post in site.posts "}}%}{{ "{% if post.geo "}} %}
      <Placemark>
        <name>{{ "{{ post.title | xml_escape "}}}}</name>
        <Point>
          <coordinates>
          {{ "{{ post.geo[1] "}}}},{{ "{{ post.geo[0] "}}}},0
          </coordinates>
        </Point>
        <description>https://evertpot.com{{ "{{post.url"}}}}</description>
        <atom:link type="text/html" rel="alternate" href="https://evertpot.com{{ "{{ post.url "}}}}"/>
      </Placemark>
      {{"{% endif "}}%}{{"{% endfor "}}%}
    </Folder>
  </Document>
</kml>
```

Lastly, I needed to generate a map page and use the Google maps API to pull in
the .kml:

```markdown
{{ "---" }}
layout: default
bodyClass: map
title: "Blog archive in space"
{{ "---" }}
<div id="map"></div>
<script>
  var map;
  var src = 'https://evertpot.com/map.kml?v=6';

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(-19.257753, 146.823688),
      zoom: 2,
      mapTypeId: 'terrain'
    });

    var kmlLayer = new google.maps.KmlLayer(src, {
      suppressInfoWindows: false,
      preserveViewport: false,
      map: map
    });
  }
</script>
<script async defer
src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCcamk0BlviObQXlC0OYJQq8ywgbrPyANw&callback=initMap">
</script>
```

[1]: https://jekyllrb.com/
[2]: /map/
