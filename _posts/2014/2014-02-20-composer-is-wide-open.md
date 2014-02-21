---
date: 2014-02-20 18:12:48 UTC
layout: post
title: "Composer is wide open with a massive security vulnerability"
tags:
  - php
  - composer
  - packagist
---

**Update: bug is now fixed. See [my new post][3]**

There's been a bit of an uproar in the php world. The short version is that
composer has a `replace` feature, that allows pretty much anyone to 'replace'
a package of someone else.

The result is, that a simple `composer update` can allow an attacker to
execute code on your machine. ~~Either by using `post-install-cmd` or~~ by
replacing things in packages that get executed after the fact.

[Pádraic Brady][1] has more details. Largly as a response to [this post by naderman][2].

The response
------------

Getting a 0-day security vulnerability can happen to the best of us. What's
worrying is that the problem is completely ignored by the developers, and
dismissed as: a feature, not a bug.

Well... I can't argue that. It's certainly a feature and there are legit
reasons why the feature exists. Just like there are legit reasons to give
everyone write access to my github repositories so it's easier to contribute.

An unaltered comment from Jordi Boggiano, composer's lead developer:

> I'm not going to argue with the fact that it sucks that replace can be abused. But I don't think you present the full picture (and I assume it's due to a misunderstanding). First of all we did take steps in the past to mitigate this already: when multiple replacer packages match the ones of a similar vendor namespace will be preferred.
>
> If we take for example zendframework/zendframework dev-develop, it replaces zendframework/zend-barcode dev-develop. So if you request zendframework/zend-barcode dev-develop and it didn't exist, you would get zendframework/zendframework, even if foo/bar replaces it as well. The problem now is if you require the barcode package in dev-bonkers for example, then none of the versions of zendframework/zendframework replace dev-bonkers, so if foo/bar says it replaces * it will win in this case and be installed.
>
> So to sum it up:
>
> * The replace feature is legit, and necessary, and used by many high profile packages. We can't just remove it, and we can't block it entirely. Yet when someone marks their forked package as replacing another one, it *is* an abuse of the feature since they don't replace the same code. We can't easily check this automatically though. The only way to improve it on packagist's side is to restrict replace to same vendors for example, but that would also require that people can own a vendor namespace. Those would be two nice features, but they take time to implement, and we all only have so much of that.
> * Unless we introduced a regression, the only way to get some code injected in this way is if your requirements are invalid and some abusive package has overly-greedy replace constraints. The simple fact that someone adds an exploit package would not lead to all users of the replaced package to be vulnerable.
> * It's overall a bad situation, and we are doing what we can to improve things. But replace itself is not a security vulnerability, it's a feature.

To me this is an absolute crazy and irresponsible way to deal with this issue.

The two things that _must_ happen now:

1. Turn off this feature completely, until it's fixed. Install a whitelist if
   you're worried about the response, but *close the hole first*.
2. Add a system to packagist that forces the original package to give
   _explicit permission_ for another package to replace it.


Workarounds
-----------

The workaround explained by [naderman][2] is unsufficient, because it will
only protect you against _known_ package replacements.

The best thing I can imagine you can do, is to only run `composer update` in
an isolated vm to first ensure there's no fake package replacements.

Identifying those can be hard as well.. when is something legit, and when is
it not? Do we manually go through the (potentially massive) list of packages
and compare it with what we expect to see on github?

[1]: http://blog.astrumfutura.com/2014/02/composer-downloading-random-code-is-not-a-security-vulnerability/
[2]: http://blog.naderman.de/2014/02/17/replace-conflict-forks-explained/
[3]: http://evertpot.com/composer-bug-fixed/
