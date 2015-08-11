---
date: 2011-01-11 18:14:51 UTC
layout: post
slug: my-gripe-with-prototype
title: "My gripe with Prototype"
tags:
  - javascript
  - jquery
  - prototype
  - json
  - stringify
  - featured
---
<p>Many of you might already know this, but I wanted to point out why I think using the <a href="http://www.prototypejs.org/">Prototype Javascript library</a> is a bad idea. The biggest problem is actually highlighted in it's name: it changes many of the prototypes of core javascript types.</p>

<p>You might have realized this before, when you tried to 'for(i in arr)' and came across many of the extra functions prototype added. (and you should have realized at this point this wasn't the proper way to loop through an array anyway.).</p>

<p>This is a big difference with other established libraries such as jQuery. If you want to use any of the jQuery functionality, you're expected to wrap other types in a jQuery object, for example:</p>

```javascript

var myElem = $(myDomNode);

```

<p>This augments the underlying variable with jQuery functionality. Besides the '$' (which can be turned off), jQuery pretty much keeps it's hands off your global namespace</p>

<p>Same with YUI. All the functionality is imported through the YUI object:</p>

```javascript

YUI().use('node-base', function(Y) {

   Y.on("domready", function() { console.log('ready!'); });

});

```

<p>This is a stark contrast with Prototype. As soon as you include it, it changes basic types such as strings, arrays and numbers. An example:</p>

```javascript

alert( [1, 2, 3].toJSON() ); // outputs "[1, 2, 3]"

```

<p>While from an API perspective, this seems quite nice and by far the simplest. Prototype provides these handy methods close to where you need them.</p>

<p>This has one devastating effect though. It violates the holy "don't pollute the global namespace" rule. In an isolated environment this will work fine, but as soon as you work on an application that includes scripts from different sources or libraries these scripts are now also affected by prototypes changes to core types. In a "mash-up era" it's just not feasible to assume you'll be working in an isolated, sterile environment forever.</p>

<p>My latest example of having to hunt down what prototype feature caused a stir, was when I tried to use the <a href="https://developer.mozilla.org/En/Using_JSON_in_Firefox">JSON.stringify</a> function. This is a fairly new feature, added by all the modern browsers.</p>

<p>Whenever stringify comes across an object that has a toJSON() method, it will call it. This allows objects to specify their own 'json representation' to for example filter out 'private properties'.</p>

<p>Example:</p>

```javascript

var test = {
 
  prop1: 'val1',

  privateProp: 'hidden',

  toJSON : function() {

     return { prop1: this.prop1 };

  }
}
alert(JSON.stringify(test));

```

<p>The output of this last example will be :</p>

```javascript
{"prop1":"val1"}
```

<p>I would argue that this functionality is not a great design decision (separation of concerns!). However, it's there and it's standard. Prototype however, adds a toJSON() method to every Array, Object and String. In Prototype this has a different meaning though. The prototype methods actually json-encode themselves and return a string.</p>

<p>From an API perspective this is as bad as a choice as JSON.stringify defining toJSON(). And this problem  highlights exactly <em>why</em> it's a bad idea, as these 2 libraries both define a global toJSON, and add their own meaning to it.</p>

<p>Example of how this fails:</p>

```javascript

JSON.stringify({
  prop : [1, 2, 3, 4]
});

```

<p>The normal result:</p>

```javascript

{"prop":[1,2,3,4]}

```

<p>The result with prototype:</p>

```javascript

{"prop":"[1, 2, 3, 4]"}

```

<p>The easy fix is to simply get rid of toJSON functions as such:</p>

```javascript

delete Object.prototype.toJSON;
delete Array.prototype.toJSON;
delete Hash.prototype.toJSON;
delete String.prototype.toJSON;

```

<p>There's even a comment on <a href="http://stackoverflow.com/questions/710586/json-stringify-bizarreness">stackoverflow</a> that fixes the issue and keeps Prototype's methods intact, but I know that as long as I will maintain applications that use Prototype, I'll have to deal with API collisions and incompatibilities.</p>

<p>Therefore, Prototype will never be the choice of JS library for me.</p>
