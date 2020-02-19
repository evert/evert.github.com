---
title: "Implementing an opaque type in typescript"
date: "2020-02-18 18:30:00 UTC"
tags:
  - typescript
  - types
location: Adelaide St W, Toronto, ON, Canada
geo: [43.647767, -79.389963]
---


Say, you're in a situation where you have a user type, that looks a bit as
follows:

```typescript
export type User = {
  firtName: string;
  lastName: string;
  email: string;
}

function save(user: User) {
   // ...
}

const user = {
  firstName: 'Evert',
  lastName: 'Pot',
  email: 'foo@example.org',
}

save(user);
```

But, instead of accepting _any_ string for an email address, you want to
ensure that it only accepts email addresses that are valid.

You might want to structure your user type as follows:

```typescript
type Email = string;

export type User = {
  firtName: string;
  lastName: string;
  email: Email
}
```

This doesn't really do anything, we aliased the Email to be exactly like a
string, so any string is now also an `Email`.

We can however extend the email type _slighty_ to contain a property that
nobody can ever add.

```typescript
declare const validEmail: unique symbol;

type Email = string & {
  [validEmail]: true
}

export type User = {
  firstName: string;
  lastName: string;
  email: Email
}
```

In the above example, we're declaring a symbol. This is similar to using
`const validEmail = Symbol('valid-email');`, but it doesn't exist
after compiling.

The `unqiue symbol` type is a type that can never be created.

We're adding a property with this key to our Email string. A user can _only_
add this property, if they have an exact reference to the original symbol.

Given that we don't export this symbol, it's not possible anymore for a user
to construct an `Email` type manually.

Now when we compile this:

```typescript
const user = {
  firstName: 'Evert',
  lastName: 'Pot',
  email: 'foo@example.org',
}

save(user);
```

We get the following error:


```
src/post/user.ts:31:6 - error TS2345: Argument of type '{ firstName: string; lastName: string; email: string; }' is not assignable to parameter of type 'User'.
  Types of property 'email' are incompatible.
    Type 'string' is not assignable to type 'Email'.
      Type 'string' is not assignable to type '{ [validEmail]: true; }'.
```

So how do turn our strings into a valid `Email` type? With an assertion
function:

```typescript
function assertValidEmail(input: string): asserts input is Email {
  
  // Yes this is very basic, but it's here for illustration purposes.
  if (!input.includes('@')) {
    throw new Error(`The string: ${input} is not a valid email address`);
  }

}
```

Now to construct our valid user object:

```typescript
const email = 'foo@example.org';
assertValidEmail(email);
const user:User = {
  firstName: 'Evert',
  lastName: 'Pot',
  email,
}

save(user);
```

This is helpful, because it allows you to construct types, such as string
types, and enforce their contents to be validated.

The implication is that the fact that an email address is valid, is almost
like a tag or label on the original string.

It ensures that whomever constructed the original `User` object, was already
forced to make sure that it was valid. Therefore, it's not possible to ever
receive a `User` object that's in an invalid state.

An interesting side-note is that even though we used a symbol as a marker, we
never actually had to add it to string. The marker only exists in the
type-system as a means to ensure that nobody can easily create the `Email` type,
circumventing the validation system.

After compilation, from a javascript perspective, email is still always just a
string. Typescript trusts that your assertion function is correct, and doesn't
double-check its internal behavior.


Instead of an assertion function, you can also use a type guarding function:

```typescript
function isValidEmail(input: string): input is Email {
  
  return (input.includes('@')); 


}
```

The difference is that assertions should throw an exception, and type
guards just return true or false. This means that you need to handle the
"false case" of the type guard.


The full source
---------------

```typescript
declare const validEmail: unique symbol;

type Email = string & {
  [validEmail]: true
}

export type User = {
  firstName: string;
  lastName: string;
  email: Email
}

function save(user:User) {

}

function assertValidEmail(input: string): asserts input is Email {
  
  if (!input.includes('@')) {
    throw new Error(`The string: ${input} is not a valid email address`);
  }

}

const email = 'foo@example.org';
assertValidEmail(email);
const user:User = {
  firstName: 'Evert',
  lastName: 'Pot',
  email,
}

save(user);
```

This compiles to:

```javascript
function save(user) {

}

function assertValidEmail(input) {
    if (!input.includes('@')) {
        throw new Error(`The string: ${input} is not a valid email address`);
    }
}

const email = 'foo@example.org';
assertValidEmail(email);
const user = {
    firstName: 'Evert',
    lastName: 'Pot',
    email,
};
save(user);
```

Effectively, having a variable that has the type `Email` is proof that at some point
`assertValidEmail` was called, and it didn't throw the exception.

Should you use this pattern?
----------------------------

It feels like a good idea, but I haven't seen this in the wild much. The biggest
drawback of not having a 'native' opaque type, like Flow does, is that it might
confuse the users that are not used to running into errors associated with it.

That said, it does feel like a smart way to ensure correctness across the
system.

Not only could this be used for strings, it could also be a good way to validate
more complex business logic and associations.

For example, when a type refers to some other database object by its id, using
this system you could force developers to first make sure that the object with
that id exists in the database. You can also limit the range of numbers, make
sure that a number is a whole number, etc.

In general it allows your type system do more complex assertions that
typescript itself can't express.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
