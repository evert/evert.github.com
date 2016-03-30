---
date: 2016-03-29 19:56:00 -0400
layout: post
title: "WebDAV resource sharing: an overview"
tags:
  - webdav
  - caldav
  - carddav
  - sabredav
  - calconnect
---

I've been working on a specification for WebDAV resource sharing since early
2014, and it's getting fairly close to completion. Time for a blog post!

Background
----------

At CalConnect 29 in San Francisco it became apparent that there was a need to
standardize CardDAV address book sharing. There is currently no standard for
this, and different servers do different things to accomodate this.

CardDAV address book sharing would allow a user on a CardDAV server, to share
an address book with someone else, and then both these people can manage the
contacts in this address book.

In particular, both [Darwin Calendar Server][1] and [fruux][2] support this
feature, but using different, proprietary protocials and [BusyContacts][4]
supports both.

Clearly there's a need and this is ripe for standardization.

After that CalConnect event a new working group was started with members
from several vendors, and chaired by John Chaffee from [BusyMac][11]. I
joined shortly after. 


The Approach
------------

Calendar sharing, which solves a similar problem but for Calendars/CalDAV
was already wide-spread. 
Apple had produced a [draft specification][5] for this some time ago, many
clients and servers have adopted this with great success. Users love this
feature.

But the spec for this is non-standard, and has problems. It made sense that
as we're solving the problem for CardDAV, we should also do it correctly for
CalDAV.

We've then made the decision to create a total of 4 different specifications:

1. [WebDAV Notifications][6], describing a standard way to communicate
   notifications to a cal-, card- or webdav user.
2. [WebDAV Resource Sharing][7], describing a standard way for to invite
   people to a shared webdav resource (such as a shared folder on a WebDAV
   server), and to respond to invites. This is the common foundation for
   CalDAV and CardDAV sharing, but can also be used independently.
3. [CalDAV Calendar Sharing][8], describing details around how servers and
   clients must behave when sharing CalDAV calendars, as well as describing
   a way for servers to also interop with clients that support the [apple
   draft][5].
4. CardDAV Addressbook Sharing. Which does the same, but for address books.

This approach allowed us to create a common foundation for both CalDAV and
CardDAV, and also describe an API for file sharing systems. The latter
has already gotten some interest from [ownCloud][9], who will likely adopt it.


Where are we now?
-----------------

Both the [Notifications][6] and [WebDAV sharing][7] spec have progressed to
a point where we're inviting people to review and implement it. The [CalDAV
sharing][8] spec is pretty close too. Publicly we've seen commits from folks
implementing this at the [Cyrus IMAP server][10], and our own project
[sabre/dav][11]. Several other projects have privately committed to adopting
this too in the future.

Overall I would say that's really promising. I'm hoping we'll be able to
turn them into official rfc's soon, as soon as the remaining issues are
settled and put into prose.

The plan is to start doing the first interop tests next month during
CalConnect 36 in Hong Kong.


A list of features
------------------

We intend to create a system, that:

* Accomodates a invitation workflow, allowing a user to invite another user
  via their email address to join a shared directory/calendar/address book.
* Also supports a simpler workflow, that does not have invitations but allows
  an implementor to create a server where users get immediately added on a
  share after invitation.
* Allows the invitee to accept or reject the invite, or ignore it.
* Supports a read-only or read-write share.
* Makes sense for fileservers such as [ownCloud][9] or [Box][12]. 
* Supports a use-case where somebody is invited that does not yet exists on
  the card/caldav server.
* Shares a common base specification, so the same standard can be used for many
  use-cases.
* Does not ignore the DAV ecosystem.
* Could work in a federated sharing scenario. 


Things left to do
-----------------

* The CardDAV sharing spec needs to be written. With this, we need to figure
  out the scope for this. I would like to keep it fairly simple, but there's
  some voices that would like to see a few other features tacked on that
  could potentially make this more complex.
* We need to figure out exactly how Scheduling will work in conjunction with
  CalDAV sharing. Right now, if you create an Event on a CalDAV server, and
  you provide an `ORGANIZER` and `ATTENDEE`, the server will automatically
  send out invites. But what happens if somebody shared a calendar with you
  and you create an invite on that shared calendar? Some say that you should
  be creating an invitation on behalf of yourself, and some say that you
  should be creating the invitation on behalf of the owner of the calendar.
  It turns out that there's a lot to be said for either.
* This complexity extends even further as soon you throw "Federated Sharing"
  into the mix. Federated sharing would allow users in different calendar
  systems (such as for example iCloud and Google Calendar) to share calendars
  among each other.

We're pretty close though!

[1]: http://tools.ietf.org/html/rfc6352
[2]: http://calendarserver.org/
[3]: https://fruux.com/
[4]: http://www.busymac.com/busycontacts/
[5]: http://svn.calendarserver.org/repository/calendarserver/CalendarServer/trunk/doc/Extensions/caldav-sharing.txt
[6]: https://tools.ietf.org/html/draft-pot-webdav-notifications "WebDAV Notifications"
[7]: https://tools.ietf.org/html/draft-pot-webdav-resource-sharing "WebDAV Resource Sharing"
[8]: https://tools.ietf.org/html/draft-pot-caldav-sharing "CalDAV Calendar Sharing"
[9]: http://owncloud.org/
[10]: https://cyrusimap.org/
[11]: http://busymac.com/
[12]: https://www.box.com/
