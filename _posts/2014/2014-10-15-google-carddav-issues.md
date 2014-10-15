---
date: 2014-09-15 17:55:21 UTC
layout: post
title: "Why Google's CardDAV server isn't."
tags:
    - google
    - contacts
    - carddav
---

For [fruux][1], we've decided to do implement syncing with Google Contacts
some time ago, allowing people to do bi-directional sync between their fruux
and Google Contacts addressbook.

Bi-directional sync is not particularly easy, but since Google implemented
[CardDAV][2] support [some time ago][3], and I'm pretty well versed at that
protocol, I thought it was doable.

I was wrong.

I'm writing this blog post as a general warning to _not_ use Google's CardDAV
server for well, pretty much anything. It's a huge mistake, and util they fix
massive mistakes in their interpretation of the protocol, you are much better
off using their proprietary [Contacts API][4].


Data-loss
---------

Lets start with the most glaring issue, the loss of data.
The primary data-format that's being used in CardDAV are [vCards][2], in
particular version 3.0.

There are certain expectations when use use vCards with CardDAV. In particular,
if you add some information to your vCard and send it to the server, with a `PUT`
request, you also expect that information back with `GET`.

Google's CardDAV server silently wipes out all kinds of data it doesn't care
about. Both the very important stuff, such as properties, but also other
relevant-meta data such as parameters and groups that influence how a vCard may
be interpreted.

The effect for the end-user is that a user may create vCards and add contact
information, this information gets saved by google, and upon a next sync, all of
this is gone.


Rejection of vCards
-------------------

We've sent hundreds of thousands of valid vCards to google's carddav server. The
server rejects a whopping 15% of all the vCards we send them.

The biggest issue we're having with this, is that we're not getting any feedback.

No, this isn't just a `400 Bad Request` we're getting back, we're not actually
not receiving any TCP packets back, at all. Any (valid) vCard that the carddav
serverdoes not understand, will result in our HTTP requests timing out.

There's no clear pattern to what they do and do not support. We've noticed that
almost every vCard with an attachment is rejected, and after dropping the
attachments, things will start working... but there's also a large amount
of cards that get rejected for certain Google accounts, but work fine in other
accounts.


Slowness
--------

Nearly any write operation you do on the CardDAV server will take 10-20 seconds
to complete. This may not seem like a big deal, but many of our pro users have
address books with over 2000 contacts. If you don't paralelize, it can mean
that the initial sync process can take 5-10 hours to complete.


UID and urls
------------

When sync with a carddav system, especially with carddav systems that discard
data when they feel like it, you'll need to keep some kind of reference to
the vCard you're sending, so you can keep the important data local.

CardDAV provides two identifiers that are unique and stable id's.

Google's CardDAV server discards both, and replaces them with their own. From
the perspective of any CardDAV client, google made it appear as if a new
contact is sent. That contact is deleted on the server, and a new contact
appears on the server that's similar, but not entirely (see Data-loss).

For very simple clients that may be sufficient, but even for for example the
Apple client, which uses ID's to group contacts together, this relationship
gets lost as soon as the card is sent to google.


Lack of documentatation
-----------------------

The official [documentation][5] for the server conveniently just refers to the
open standards, but since they are so far from a carddav-compliant server,
there's little to no information about why they do the things they do.


The response
------------

Normally, when running into bugs like this, I'm quite forgiving. I wrote a
[popular][6] server myself, and I know that standards are hard, and it's not
easy to write a well behaving server from scratch.

So the first thing I did was to try to contact the relevant developers.

Out of respect and privacy I will withold their response, but I was met with
disinterest, and kind of got the impression I was overstepping my boundaries
by suggesting that there may be one or two bugs in their system.

This was in August 2013, and nothing has changed since.


In conclusion
-------------

The Google Google CardDAV server has similarities to what we call CardDAV.
For very simple, controlled stuff, it may be possible to use it.

For anything advanced, and avoid it at all cost. I've made the mistake of
trying to work around various issues, when in reality that time could have
been better spent porting our code to the Google Contacts API. Which is much
simpler, but it's predictable and behaves sanely.

If you're a CardDAV client developer and you're thinking of syncing with
google, keep the following in mind:

1. Google only supports a very small part of vCards and will silently discard
   any of your user's data that it doesn't support.
2. About 15% of normal vCards will be rejected by google by timing out your
   http request.
3. It's extremely slow, which can be problematic for mobile clients.
4. You'll need to add additional heuristics to maintain referential integrety
   to your contacts.

Furthermore, if you're writing an actual vCard sync service, I think the only
correct way to implement this is to:

1. Maintain an additional database, as google's can't be trusted.
2. After sending vCards, immediately also retrieve it so find out how google
   mangled it.
3. After a change was made on the google contacts side, retrieve the updated
   vcard, compare it to the last version you received, and apply the
   differences to the *correct* copy of the vCards.

One issue with this is that it's hard to process semantic updates of vCards.
vCard properties may have a `PID` parameter to uniquely identify properties,
so you know what has been updated, but this is a vCard 4 feature, and even
if you specify it, google just discards it anyway.


[1]: https://fruux.com/
[2]: http://tools.ietf.org/html/rfc2426 
[3]: http://gmailblog.blogspot.ca/2012/09/a-new-way-to-sync-google-contacts.html
[4]: https://developers.google.com/google-apps/contacts/v3/
[5]: https://developers.google.com/google-apps/carddav/
[6]: http://sabre.io/dav/
