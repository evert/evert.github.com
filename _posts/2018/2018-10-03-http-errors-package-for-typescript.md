---
title: "Http errors package for Typescript"
date: 2018-10-03 11:00:00 -0400
tags:
  - http
  - api
  - curveball
  - koa
  - typescript
location: Toronto, CA 
---

[Hacktoberfest 5][1] has begon, and as my first contribution I wanted to make
a tiny Typescript library with HTTP errors.

Whenever I start a new Javascript-based project, whether that's on the server,
or if I'm writing an API client with [Fetch][2], I often find myself do the
same thing over and over again, which is to define a simple set of exceptions
representing HTTP errors, like this:

```typescript
class NotFound extends Error {
   httpStatus = 404;
}
```

A bit fed up with this, I decided to make a small package that's just a list
of errors for Typescript, along with some tiny utilities.

Example:

```typescript
import { NotFound } from '@curveball/http-errors';
throw new NotFound('Article not found');
```

The idea is that the interface is really just this:

```typescript
export interface HttpError extends Error {
  httpStatus: number;
}
```

Which means that any error with a `httpStatus` property automatically follows
this pattern, and generic middlewares can be written to listen for them.

It comes with a simple utility function to see if the `Error` conforms with
this pattern:

```typescript
import { isHttpError } from '@curveball/http-errors';

const myError = new Error('Custom error');
myError.httpStatus = 500;

console.log(isHttpError(myError)); // true
```

Problem+json
------------

A great idea for emitting errors from a HTTP API is to use the
`application/problem+json` format, defined in [RFC7807][3]. The package also
contains a few utilities to help with these:

```typescript
export interface HttpProblem extends HttpError {

  type: string | null;
  title: string;
  detail: string | null;
  instance: string | null;

}
```

Every standard exception that ships with this package also implements this
interface. Most properties (except `title`) default to `NULL` as they are likely
application specific.

Hypothetically, someone could write a library that emits an error with
`HttpProblem` properties, without having to depend on this package and a generic
application middleware can magically turn this into the right format.


Additional headers
------------------

A few HTTP responses require or suggest including extra HTTP headers with more
information about the error. For example, the [`405 Method Not Allowed`][6] response
should include an `Allow` header, and `503 Service Unavailable` should have a
`Retry-After` header. The built-in errors support these:

```typescript
import { MethodNotAllowed, ServiceUnavailable } from '@curveball/http-errors';

try {
  throw new MethodNotAllowed('Not allowed', ['GET', 'PUT']);
} catch (e) {
  console.log(e.allow);
}

try {
  throw new ServiceUnavailable('Not open on sundays', 3600*24);
} catch (e) {
  console.log(e.retryAfter);
}
```

I intend to add a few more like this. The `UnsupportedMediaType` class could for
example include a list of content-types that are supported. This might not
correlate directly to a HTTP response header, but someone could use this to
for example automatically populate a JSON response body.

I hope this is useful to anyone else. By doing this once in the right way, I
hope to never have to do this again.

Links:

* [Github project][4]
* [NPM package][5]

[1]: https://hacktoberfest.digitalocean.com/
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[3]: https://tools.ietf.org/html/rfc7807
[4]: https://github.com/curveballjs/http-errors
[5]: https://www.npmjs.com/package/@curveball/http-errors
[6]: /http/method-not-allowed
