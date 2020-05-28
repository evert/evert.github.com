---
title: "ECMAscript 4: The missing version"
date: "2020-05-28 09:41:38 UTC"
tags:
  - javascript
  - ecmascript
  - actionscript
  - jsx
geo: [43.660773, -79.429926]
location: "Bloor St W, Toronto, Canada"
---

In your build tools, you may have noticed that you have an ECMAscript 3
target, and 5 and up, but never a 4. Why is that?

I thought it would be fun to dive into ECMAscript 4 a bit and see what
we didn't get.


A brief history
---------------

According to [Wikipedia][1], the first draft of ECMAscript 4 was dated
February 1999. The original target for completion was August 2008.

ECMAscript 4 was very ambitious, and added a ton of features that were
percieved as important and missing from ECMAscript 3. It also 'fixed' a
number of things in the previous version, making it backwards incompatible
in various ways.

ES4 was met with a bunch of controversies, and lacked sufficient support
from browser vendors to be released and was ultimately abandoned.

In 2008 the standard was pronounced dead, and ES3.1 was renamed to ES5,
which was a much more conservative and incremental update to ECMAScript.

The closest thing we had for ES4, was probably Flash Actionscript 3.
There was a point during the release of AS3 that some of us thought that
Flash and the Web was eventually going to converge.

For more details on politics and history of ES4, check out
[this great article][2] on the auth0 blog.



What could have been?
---------------------

### Classes

Classes eventually landed in ES6, but here's how it might have looked like
earlier:

```as3
class C {

 var val
 var number = 500;

 const pi = 3.14

 // A function
 function f(n) { return n+val*2 }

 // Getters and setters
 function set foo(n) {
   val = n;
 }

 function get foo() {
   return val;
 }
}
```

The syntax here is pretty different, but another notable is that these classes
had properties and constants. [Field declarations][3] are currently
'experimental', so we almost caught up here.

Another surprising thing is that there is no `this`. Instead of variables being
global by default, ES4 would first look in the class scope before checking higher
scopes.

ES4 also had the following keywords for class members:

1. `static`
2. `final`
3. `private`, `protected`, `public`.
4. `prototype`, to define class members on its prototype. Not sure what the
   use-case is, but it's there.


### Interfaces

ES4 introduced interfaces, which is something we don't have today (unless you use
Typescript):

```as3
interface MyInterface {
  function foo();
}
```

### Strict typing

ES4 introduced strict typing:

```as3
function add(a: int, b:int): int {
  return a + b;
}
```

It also had the `type` keyword similar to Typescript and union types. A typescript
union like the following:

```typescript
let a : number | string;
```

Is written as follows in ES4:

```as3
var a: (number, string)
```

ES4 also had generics:

```as3
class Wrapper<T> {
  inner: T
}
```

### Like 👍

By default types in ES4 had to be exact types, and not a superset. Using the
`like` keyword you can make this less restrictive:

```as3
function getCell(coords: like { x: int, y: int }) {

}
```

This probably exists because in ES4 types were Nominal and not Structural like
Typescript.


### New types

In current ES we have booleans, objects, arrays, number, BigInt, but ES4 was
going to introduce:

1. `byte`
2. `int`
3. `unit`
4. `double`
5. `decimal`

Of those, only the decimal type is in the planning today, and it will eventually
probably look like:

```javascript
const allowance = 1.50m
```

This `m` suffix also existed in ES4, and stands for "money".

### triple-quoted strings.

To encode a string like: `Hello my name is "Evert"` in ES4, you could use triple-quotes:

```as3
const hi = """Hello my name is "Evert"""";
```

### Packages

Packages are a bit like what we have now with modules. Packages can be
imported, but unlike ES6 modules, namespaces are more like
a global naming system.

If a class is defined as :

```as3
package com.evertpot {

  // Private
  internal const foo = 5;

  class MyClass {

  }

}
```

Then you could use this class as follows:


```as3
const myObj = com.evertpot.MyClass;
```

Or:


```as3
import * from com.evertpot;
const myObj = MyClass;
```

As far as I know the standard doesn't define a relationship between namespaces
and where the files can be loaded from.

### Generic functions

Generic functions are not parameterized functions, they resemble
["Overloaded functions"][5] in typescript a bit, but they're not quite the same
and much more powerful.

Example:

```as3
class Foo {


  generic function addItem(x);

  function addItem(x: int) {
  }

  function addItem(x: number) {
  }

}
```


In the above example, I can call `addItem` with either a `int` or `number`, and
the correct implementation will be picked at run-time.

### E4X

While E4X was technically an extension to ES4, I think it deserves a mention.

E4X stands for ECMAScript for XML, and while that might not sound very
exciting, take a look at a code snippet:

```jsx
const myClass = 'welcome';
const name = 'Evert';
const foo = <div class={myClass}>{"Hello " + name }</div>;
```

Looks familiar?

Although not quite the same as [JSX][7], it's becoming clear that this might
have been a part of JSX's origin story.

While ES4 never landed, E4X actually lived in Firefox for a long time.

### More features

* `let const` as a syntax for block-level constants. In ES5 and up `const` is
  already block-scope.
* Generators (`yield`).
* Tail-calls
* Namespaced properties, classes and everything to avoid collisions, much like
  XML namespaces.

How would you load it?
----------------------

Because Ecmascript 4 would break backwards compatibility, it would be important
to tell a browser to interpret a script as ES4:

```html
<script type="text/javascript;version=4" src="..."></script>
```

This is not unlike what we do with modules today:

```html
<script type="module" src="..."></script>
```

Afterword
---------

I hope this was an interesting view in the Javascript that could have been.
Although we are slowly catching up with newer ECMAScript versions and
tools like Typescript and JSX preprocessors, we're still not quite at 2007's
vision for ECMAScript.

Perhaps if ES4 landed, fewer people would need complex build tools like Babel,
Webpack and Typescript.


Sources
-------

* [The Real Story Behind ECMAScript 4][2]
* [Proposed ECMAScript 4th Edition – Language Overview][4]
* [Wikipedia: ECMAScript for XML][6]

[1]: https://en.wikipedia.org/wiki/ECMAScript#4th_Edition_(abandoned)
[2]: https://auth0.com/blog/the-real-story-behind-es4/ "The Real Story Behind ECMAScript 4"
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields
[4]: https://www.ecma-international.org/activities/Languages/Language%20overview.pdf
[5]: https://www.typescriptlang.org/docs/handbook/functions.html
[6]: https://en.wikipedia.org/wiki/ECMAScript_for_XML
[7]: https://reactjs.org/docs/introducing-jsx.htm://reactjs.org/docs/introducing-jsx.html
