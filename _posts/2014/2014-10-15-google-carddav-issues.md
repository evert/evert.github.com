---
date: 2014-10-15 19:03:49 UTC
layout: post
title: "Why Google's CardDAV server isn't."
tags:
    - google
    - contacts
    - carddav
---

For [fruux][1], we've decided to implement syncing with Google Contacts some
time ago, allowing people to do bi-directional sync between their fruux and
Google Contacts address book.

Bi-directional sync is not particularly easy, but since Google implemented
[CardDAV][2] support [some time ago][3], and I'm pretty well versed at that
protocol, I thought it was doable.

I was wrong.

I'm writing this blog post as a general warning to _not_ use Google's CardDAV
server for well, pretty much anything. It's a huge mistake, and until they fix
the massive mistakes in their interpretation of the protocol, you are much
better off using their proprietary [Contacts API][4].


Data-loss
---------

Lets start with the most glaring issue, the loss of data.
The primary data-format that's being used in CardDAV is [vCard][2], in
particular version 3.0.

There are certain things that you can expect when you use vCards with CardDAV.
In particular, if you add some information to your vCard and send it to the
server, with a `PUT` request, you also expect that information back with `GET`.

Google's CardDAV server silently wipes out all kinds of data it doesn't care
about. Both the very important stuff, such as properties, but also other
relevant meta-data such as parameters and groups that influence how a vCard may
be interpreted.

The effect for the end-user is that a user may create vCards and add a bunch of
information to a contact, which gets discarded by Google, and upon the next sync,
also gets removed from the users local version.


Rejection of valid vCards and error handling
--------------------------------------------

We've sent hundreds of thousands of valid vCards to Google's CardDAV server. The
server rejects a whopping 15% of all the vCards we send it. Note that these
are not vCards we produce. We receive them from other CardDAV clients, and since
we get millions of them, this is statistically a decent source on what kind of
vCards appear in the wild.

The biggest issue we're having with this though, is that we're not getting any
feedback.

No, this isn't just a `400 Bad Request` we're getting back, we're not actually
receiving any TCP packets back, at all. Any (valid) vCard that the CardDAV
server does not understand, will result in our HTTP requests timing out.

There's no clear pattern to what they do and do not support. We've noticed that
almost every vCard with an attachment is rejected, and after dropping the
attachments, things will start working... but there's also a large amount
of cards that get rejected for certain Google accounts, but work fine in other
accounts.


Slowness
--------

Nearly any write operation you do on Google's CardDAV server will take 10-20 seconds
to complete. This may not seem like a big deal, but many of our users have
address books with well over 2000 contacts.

Given that our HTTP requests time out after 1 minute, we retry HTTP requests
2 times before failing, and 15% of requests fail by timing out, this means that
for an address book with 2000 contacts, this would take over 22 hours to
complete.


UID and urls
------------

When syncing with a CardDAV system, especially with one that discards data
whenever it feels like it, you'll need to keep some kind of
reference to the vCard you're sending, so you can keep the important data
local.

CardDAV provides two identifiers that are unique and stable id's.

Google's CardDAV server discards both, and replaces them with their own. From
the perspective of any CardDAV client, Google makes it appear as if a new
contact is sent. That contact is deleted on the server, and a new contact
appears on the server that's similar, but not entirely (see Data-loss).

For very simple clients that may be sufficient, but even for example Apple's
Contacts app on OS X, which uses ID's to group contacts together, loses this
relationship as soon as the card is sent to Google.


Lack of documentation
---------------------

The official [documentation][5] for the server conveniently just refers to the
open standards, but since Google's system couldn't be further from being a 
CardDAV-compliant server, there's little to no information about why they do
the things they do.

For instance, if they only choose to support an extremely limited subset of
vCards, ignoring many often-used features, it would have been great if that
was documented.


The response
------------

Normally, when running into bugs like this, I'm quite forgiving. I wrote a
[reasonably popular server][6] myself, I know that standards are hard and
it's not easy to write a well behaving server from scratch.

So the first thing I did was to try to contact the relevant developers.

Out of respect and privacy I will withold their response, but I was met with
disinterest, and kind of got the impression I was overstepping my boundaries
by even suggesting that there may be one or two bugs in their system.

This was in August 2013, and nothing has changed since.


In conclusion
-------------

The fact that Google advertises their servers as supporting CardDAV is an
insult to anyone who does try to be standards compliant.

The Google CardDAV server has similarities to what we call CardDAV.
For very simple, controlled stuff, it may be possible to pretend it is.

For anything advanced, avoid it at all cost. I've made the mistake of trying
to work around various issues, when in reality that time could have
been better spent porting our code to the Google Contacts API. Which is much
simpler, but it's predictable and behaves sanely.

If you are a CardDAV client developer and you're thinking of syncing with
Google, keep the following in mind:

1. Google only supports a very small subset of vCards and will silently discard
   or mangle any of your user's data that it doesn't support.
2. About 15% of normal vCards will be rejected by Google without telling you
   why. Their system will just time out your http request.
3. It's extremely slow, which can be problematic for mobile clients and when
   you have to handle sync for many users.
4. You'll need to add additional heuristics to maintain referential integrity
   to your contacts.

Furthermore, if you're writing an actual vCard sync service that targets
Google, I think the only sane way to implement this is to:

1. Maintain an additional database, as Google's can't be trusted.
2. After sending vCards, immediately also retrieve it to find out how Google
   mangled it.
3. After a change was made on the Google contacts side, retrieve the updated
   vCard, compare it to the last version you received, and apply the
   differences to the *correct* copy of the vCards.

Another issue with this is that it's hard to process semantic updates of vCards.
vCard properties may have a `PID` parameter to uniquely identify properties,
so you know what has been updated, but this is a vCard 4 feature, and even
if you did specify it, Google would just discard it anyway.



[1]: https://fruux.com/
[2]: http://tools.ietf.org/html/rfc2426 
[3]: http://gmailblog.blogspot.ca/2012/09/a-new-way-to-sync-google-contacts.html
[4]: https://developers.google.com/google-apps/contacts/v3/
[5]: https://developers.google.com/google-apps/carddav/
[6]: http://sabre.io/dav/
