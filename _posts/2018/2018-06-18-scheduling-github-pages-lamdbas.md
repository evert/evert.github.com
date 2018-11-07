---
title: Scheduling posts on Github pages with AWS lambda functions
date: 2018-06-18 09:00:00 -0700
update_date: 2018-08-30 02:24:00 +0200
location: "Haight St, San Francisco, CA, United States"
geo: [37.772252, -122.431250]
tags:
  - aws
  - lamdba
  - github
  - jekyll
---

If you are reading this post, it means it worked! I scheduled this post
yesterday to automatically publish at 9am the next day, PDT.

I've been trying to find a solution for this a few times, but most recently
realized that with the AWS Lamdba functions it might have finally become
possible to do this without managing a whole server.

I got some inspiration from [Alex Learns Programming][1], which made me
realize Github has a simple [API][2] to trigger a new page build.

You need a few more things:

1. Create a [Personal Access Token][3] on GitHub.
2. Make sure you give it at least the `repo` and `user` privileges.
3. Make sure you add `future: false` to your `_config.yaml`.
4. Write a blog post, and set the `date` to some point in the future.
5. Create an [AWS Lambda function][4].

To automatically have a lamdba run on a specific schedule, you can use a
'CloudWatch Event'.

Source
------

This is (most of the) code for the actual AWS lambda function:

```js
const { TOKEN, USERNAME, REPO } = require('./config');
const fetch = require('node-fetch');

exports.handler = async (event) => {

  const url = 'https://api.github.com/repos/' + USERNAME + '/' + REPO + '/pages/builds';
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Token ' + TOKEN,
      'Accept': 'application/vnd.github.mister-fantastic-preview+json',
    }
  });

  if (!result.ok) {
    throw new Error('Failure to call github API. HTTP error code: ' + result.status);
  }

  console.log('Publish successful');
};
```

I released the [full source on Github][5], it's pretty universal. Just add your
own configuration to `config.js`.

Cost
----

The Free Tier for AWS allows for 1,000,000 triggers per month, which is plenty (I'm
triggering it every 15 minutes, which is less than 3000 triggers per month).

I configured it use 128M memory. The free tier includes 3,200,000 seconds per month
at that memory limit. Since the script takes around 400ms to run, this is also more
than plenty.

tl;dr: it's free.

Conclusion
----------

This was my first foray into AWS Lamdba Functions, and I was surpised how easy
and fun it was.

Hope it's useful to anyone else!

Updates
-------

[Cory Cox](https://twitter.com/CoryKnox) did a similar thing, but with Azure
Functions instead of AWS. Read more in [his article][6].

[1]: http://code.alxmjo.com/how-to-schedule-posts-with-jekyll/
[2]: https://developer.github.com/v3/repos/pages/#request-a-page-build
[3]: https://github.com/settings/tokens
[4]: https://aws.amazon.com/lambda/
[5]: https://github.com/evert/github-pages-aws-lambda-publish
[6]: https://knoxy.ca/2018/08/Azure-Functions-FTW/
