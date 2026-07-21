---
title: "Using a SSH bastion, but only when I'm touching grass"
date: "2026-07-20 21:35:00 -0400"
location: "Toronto, Canada"
geo: [43.67825, -79.347042]
tags:
  - homelab
  - ssh
  - tunnel
  - bastion
---

I'm a few years into my homelab. (might go into a bit more detail about that
at some point!), and I often need to `ssh` into one of my servers.

At home, I can just do this by using a domain name like:

```sh
ssh ahoy.m.example.ca
ssh bread.m.example.ca
```

I have set up [Split-Horizon DNS][2] at home using [DNSMasq][1], so these domains resolve but
only at home.

When I'm outside, I use a a 'bastion' server that I can `ssh` into and hop
to another server. It's on a 'secret' port.

To automatically tell SSH to go _via_ the bastion server, I have this in my `~/.ssh/config`:

```ssh
Host *.m.example.ca
    ForwardAgent yes
    User evert
    ProxyCommand ssh -q -W %h:%p -l evert bastion.example.ca -p 6767
```

`bastion.example.ca` does resolve to a real IP (my home IP). The annoyance with
this is that if I use one of the above commands, I always go through the bastion
whether I'm home or not.

I recently found about about the `Match` and `ProxyJump` command, and cludged
together this:

```ssh
Match host *.m.example.ca exec "! getent hosts %h >/dev/null"
    ForwardAgent yes
    User evert
    ProxyJump evert@bastion.example.ca:6767
```

This works the same as before, except this rule only kicks in if the command
command `getent hosts %h` fails.

The `ProxyJump` is a slightly simpler command from `ProxyCommand`. I think this
has been around for a bit, but I've just been copy-pasting `ProxyCommand` from
previous configs for a decade+.

You might not have a DNS setup like this, and might be using `.local` domains
to access local servers, if this also work, HOWEVER:

```ssh
Match host *.local exec "! getent hosts %h >/dev/null"
    HostName %h
    ForwardAgent yes
    User evert
    ProxyJump bastion.example.ca:6767
```

Every time you do this, you computer likely first
broadcasts on your local network it's looking for that machine. `.local` / MDNS
also tends to be a bit slower when you're local, and given that you're paying
that cost. `ForwardAgent` agent can also make this extremely dangerous because
someone might impersonate `target.local` and get access to your entire SSH keychain.
So maybe for that case it's not the worst thing to just always go
through a bastion server. If so, this config is for you:


```ssh
Host *.local
    HostName %h
    ForwardAgent yes
    User evert
    ProxyJump bastion.example.ca:6767
```



[1]: https://thekelleys.org.uk/dnsmasq/doc.html
[2]: https://en.wikipedia.org/wiki/Split-horizon_DNS
