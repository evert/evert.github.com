---
date: 2012-01-25 14:03:52 UTC
layout: post
slug: silex-routing-issues
title: "Silex routing issues"

---
<p>I've had a bit of an interest for micro frameworks, and for a new project I'm working on I decided on <a href="http://silex.sensiolabs.org/">Silex</a>.</p>

<p>I've started hitting some nasty walls though, the routing system seems inconsistent and intuitive. To better explain, some examples.</p>

<p>I have a default route that acts as a fallback. This default route simply includes a static template (if it exists). This route looks something like this:</p>

```php
<?php

$app->get('/{name}', function($name) { 
   // If the page exists, render it, otherwise throw 404
});

```

<p>Simple enough. We also want to match the root of the application (the index, basically). This can be easily done with a default value:</p>

```php
<?php

$app->get('/{name}', function($name) { 
   // If the page exists, render it, otherwise throw 404
})->value('name','index');

```

<p>The first problem arose here. The existing site used urls all ending with a slash (/contact/ for example). But these routes won't match that. These routes will match /contact, but not /contact/. This can be fixed though. If your routes end with a slash, silex will be able to match both:</p>

```php
<?php

$app->get('/{name}/', function($name) { 
   // If the page exists, render it, otherwise throw 404
})->value('name','index');

```

<p>The preceding example will match /contact/. If the user went to /contact instead, it will redirect the user back to /contact/. I would have preferred the opposite in this case, but fair enough. This route will however no longer match the root of the website, so we need to refactor this a bit:</p>

```php
<?php

$staticHandler = function($name) {
  // If the page exists, render it, otherwise throw 404
}

$app->get('/{name}/', $staticHandler);
$app->get('/', function() use ($staticHandler) { 
  return $staticHandler('index'); 
} );

```

<p>Note that the last example could have been structured a bit nicer, but you get the point.</p>

<p>The first real problem arose when trying to use 'ControllerProviders, or ControllerCollections'. These objects can be responsible for a sub-tree. An example of how we want to use this is have a single class be responsible for a /blog/ section of the site. This would be done with something like:</p>

```php
<?php

$app->mount('/blog/', new MySite\Controller\Blog());

```

