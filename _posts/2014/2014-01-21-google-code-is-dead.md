---
date: 2014-01-21 22:40:04 UTC
layout: post
title: "Google Code is dead."
tags:
  - Google Code
  - Github
  - SabreDAV

---

Last year Google [announced][1] they would no longer provide a 'downloads'
feature on [google code hosting][2] for new projects. Starting January 15th
2014, creating new downloads would also no longer be possible for existing
projects.

It's been sort of obvious for a while that they've stopped caring about their
code hosting. At the time, it was a refreshing way to do open source project
hosting. All we really had was [SourceForge][3], which at the time was already
really starting to feel dated.

But with the advent of Github and others, google code pretty much dropped out
of the race. The [last new feature announcement][5] was from 2011.

So last night I created a script that would:

* Download all 92 SabreDAV releases from google code.
* Parse the [ChangeLog][6].
* Automatically create releases on GitHub with the changelog information.

[The result][7] looks quite nice :).

So after [migrating the source][8] in 2011, now all that's left on google code
is the wiki. Hopefully I can find a new place for that soon too :).

[1]: http://google-opensource.blogspot.ca/2013/05/a-change-to-google-code-download-service.html
[2]: http://code.google.com/hosting/
[3]: http://sourceforge.net/
[4]: http://github.com/
[5]: http://google-opensource.blogspot.ca/2011/07/announcing-git-support-for-google-code.html
[6]: https://github.com/fruux/sabre-dav/blob/master/ChangeLog.md
[7]: https://github.com/fruux/sabre-dav/releases
[8]: http://evertpot.com/moved-sabredav-to-github/
