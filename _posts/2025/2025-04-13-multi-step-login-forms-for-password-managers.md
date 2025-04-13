---
title: "Building multi-step login forms that work well with password managers"
date: "2025-04-13 12:28:00 +0200"
location: "Nijega, NL"
geo: [53.140006, 6.032090]
tags:
  - password
  - login
  - html
  - ux
---

Password managers are still the best way to manage credentials, and if you
are doing things on the web, you should be using one.

Increasingly, websites are using multi-step login forms which don't work as
well with password managers. They might first ask for _just_ an email address
and only after present users with a password field.

<figure>
  <img src="/assets/posts/login-forms/google-login.png" />
  <figcaption>Google Login form</figcaption>
</figure>

<figure>
  <img src="/assets/posts/login-forms/amazon-login.png" />
  <figcaption>Amazon Login form</figcaption>
</figure>

Why do they do that?
--------------------

The short version is that many companies want to centralize their login /
password management systems for all their employees. This lets them change
passwords in a single place, and also disable accounts after an employee
leaves the company. This is called Single Sign-On (SSO) and is often facilitates
using the SAML or OpenID Connect protocols.

When you log in with a web application that supports this, and you enter
your email, the first thing the system needs to do is check if a SSO system
is in place for your account (or the domainname of your email address), and
if so they will redirect out to your sign-on system.

Only if this is not the case, they will present you with a password field.

Another reason is that systems increasingly allow users to auhtenticate with
means other than a password, and similarly they first need to know your
email address / username before they can know what login flow to present you
with.


Password managers
-----------------

Password managers such as [KeepassXC][1], [Bitwarden][2] and [1Password][3],
but also the 'save password' feature that's built into browsers look for
HTML forms that are roughly 'login form shaped' to do their thing. If something
looks like a login form, they will suggest or auto-fill your username and
password.

The problem with multi-step login forms that ask for an email address first,
is that they no longer look like plain old login forms, which either means
that a user has to do more clicks to complete the login, or in the worst
case the password manager can't detect the fields at all and you end up
copy-pasting your password. This is pretty annoying and something I see people
often yelling about on the internet.

So, how do you fix this?
------------------------

### 1. Make sure you have the correct autocomplete attribute

If you have a lone `<input>` field for the username, it should have the
attribute to signal password managers that this is a username field:

```html
<input type="text" autocomplete="username" name="username" required />

or:

<input type="email" autocomplete="username" name="username" required />
```

### 2. Add a hidden username field on the password page

The [Chrome Wiki][4] recommends that when you collect the email first, and
redirect the user after to a password page, to include the username
field again (prefilled), and hidden with CSS.


```html
<input
    type="email"
    autocomplete="username"
    name="username"
    required
    value="spam@evertpot.com"
    style="display:hidden"
/>

<input
    type="password"
    autocomplete="password"
    name="password"
    required
/>
```

This is particularly great if the user has multiple accounts on your system.
The pre-filled username lets a password manager detect which account is
being used to log in.

### 3. If you're using one-time-codes, also annotate those fields

Many login systems use SMS codes or TOTP (Authenticator App) codes for
additional security. Password managers let you store TOTP codes, but in order
for your password manager to detect the field, you also need to annotate this
correctly:

<input
    type="string"
    autocomplete="one-time-code"
    name="otp"
    required
    pattern="0-9{6}"
    inputmode="numeric"

/>

The key attribute here is 'autocomplete'. You can even get this auto-filled
with SMS codes, if you use a [specially formatted SMS][6], which looks a bit
like this:

```
Your one-time code is 123123

@mydomain #123123
```

Password manager developer advice
---------------------------------

Please also try to follow these recommendations! For better or worse, this
is where a lot of applications are going to. [KeepassXC-Browser][5] in
particular does a pretty poor job at handling some of these cases. I've filed
a feature request but it was unfortunately closed despite some luke-warm interest.

References and further reading:
-------------------------------

* [Origin-bound one-time codes delivered via SMS][6]
* [Design your website to work best with 1Password][7]
* [Password Form Styles that Chromium Understands][4]
* [Create Amazing Password Forms (chromium.org)][9]
* [`<input type="password">` (MDN)][10]
* [KeeppassXC-browser rejected feature request to better support multi-step login forms][8]


[1]: https://keepassxc.org/
[2]: https://bitwarden.com/
[3]: https://1password.com/
[4]: https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands/
[5]: https://github.com/keepassxreboot/keepassxc-browser
[6]: https://wicg.github.io/sms-one-time-codes/
[7]: https://developer.1password.com/docs/web/compatible-website-design/
[8]: https://github.com/keepassxreboot/keepassxc-browser/issues/2436
[9]: https://www.chromium.org/developers/design-documents/create-amazing-password-forms/
[10]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/password
