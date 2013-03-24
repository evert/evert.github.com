---
date: 2010-09-25 12:00:00 UTC
layout: post
slug: killing-a-dead-ssh-connection
title: "Killing a dead ssh connection"
tags:
  - ssh

---
<p>One feature telnet has and I always missed from ssh was the ^] shortcut, giving you a way to terminate the connection.</p>

<p>ssh has a similar feature. If you setup 'escape characters', you can terminate the connection by typing '~.' Just add the following to your .ssh/config:</p>

```

Host *
EscapeChar ~

```

<p>You can change the character here too, but ~ is the default and a sensible one.</p>

<p>If you're dealing with crappy ssh connections that often terminate, you can add the following to make the client send a keep-alive package every 60 seconds:</p>

```

Host *
ServerAliveInterval 60

```
