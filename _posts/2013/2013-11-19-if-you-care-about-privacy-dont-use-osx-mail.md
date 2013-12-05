---
date: 2013-11-19 22:21:22 UTC
layout: post
title: "If you care about privacy, don't use OS X mail"
tags:
  - mail 
  - osx

---


I've been happily using the standard Mail application that ships with Apple's
OS X for years. Before this I had been using [Thunderbird][1], but at around
the time of Thunderbird 2 and 3, it wasn't very good at managing hundreds of
thousands of emails. (A situation that has since then changed again).

Since the amount of spam I'm receiving appears to increase every day, I wanted
to look a bit into how sensitive Mail.app is to letting spammers known I
(accidentally) read their email.

Turns out it is absolutely horrendous. I'm talking Outlook Express in 1995-bad.

I already had a hunch that it would automatically load in external images, but
it also loads `<iframe>`, `<object>`, and believe it or not, it follows
redirects and loads in external websites when the redirect is specified as:

```html
<meta http-equiv="Refresh" content="1; URL=http://TRACKING_URL/">
```

So for the moment I'm back to Thunderbird. If you're interested in testing
how well your mail client or webmail behaves in the department of privacy,
have a look at the [email privacy tester][2], which is pretty nifty.

My results:

<a href="/resources/images/posts/emailprivacy.png"><img src="/resources/images/posts/emailprivacy.png" style="max-width: 100%"/></a>

For comparison, clients such as Thunderbird will show the above grid as
completely gray.

What's especially telling here, is that the privacy problems here are not
simple mistakes, but definite design choices.

### Edit

Ken Neville points out in the comments that there's actually a setting in Mail
that allows you to turn off this behavior.

I have to be honest that I looked for this very setting several times, but
must have simply missed it.

However, I feel that my earlier point stands. Unlike other almost every other
client on the planet, in Mail the default is terrible for privacy, and unless
you are aware of the privacy implications of 'not displaying remote images',
there is absolutely no indication why it's a good idea to turn this off.

In my opinion the setting should be well hidden and off by default.

[1]: http://www.mozilla.org/en-US/thunderbird/
[2]: https://emailprivacytester.com/
