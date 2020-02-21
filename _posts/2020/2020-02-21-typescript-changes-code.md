---
title: "Typescript is changing how I write code"
date: "2020-02-21 20:14:58 UTC"
tags:
  - typescript
  - types
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---


Typescript is not just Javascript + types. Using TS more is slowly altering
how I think about how my code should be written. My code is becoming more
functional, and I'm incentivized to write things in a way that typescript
is more likely to catch.

I wanted to share an isolated example of this.

In this example we need to process a chat message. This message can be either
the type 'text', 'picture', or 'video'. After this process is complete, I'm
returning an 'id'.

In the past, this is how I would have handled it:

```javascript
function processMessage(message) {

  switch(message.type) {

    case 'text' :
      return processText(message); 
    case 'picture' :
      return processPicture(message);
    case 'video' :
      return processVideo(message);
    default :
      throw new Error('Unknown message type: ' + message.type);

  }

}
```

A direct translation to Typescript might look like this:


```typescript
type Message = {
  type: 'text' | 'picture' | 'video',
  sender: string;
}


function processMessage(message: Message): number {

  switch(message.type) {

    case 'text' :
      return processText(message); 
    case 'picture' :
      return processPicture(message);
    case 'video' :
      return processVideo(message);
    default :
      throw new Error('Unknown message type: ' + message.type);

  }

}
```

The area of interest is the `default` clause. It's perfectly reasonable in
Javascript and other dynamic languages to add guards for invalid conditions.

Throwing an exception makes sense, because if an invalid type was passed,
you'll want the function to fail and not silently ignore the error case.

However, having the default clause is worse in typescript.

Typescript *knows* that each branch of the function will return a number, or
throw an exception.

So what happens when we extend the `Message` type to include a new type:

```typescript
type Message = {
  type: 'text' | 'picture' | 'video' | 'sticker',
  sender: string;
}
```

After this change, typescript will still let the `processMessage` function
pass, and we can only find out that there was a failure case by running the
code.

If we remove the `default` clause:

```typescript
function processMessage(message: Message): number {

  switch(message.type) {

    case 'text' :
      return processText(message); 
    case 'picture' :
      return processPicture(message);
    case 'video' :
      return processVideo(message);

  }

}
```

Now, after adding the `sticker` to our `type`, enum, we'll get an typescript
error:

```
Function lacks ending return statement and return type does not include 'undefined'.(2366)
```


