---
title: "Why Virtualise?"
---

Virtualisation technologies help optimise use of compute resources.

# Resource Utilisation

Arguably the primary reason for virtualisation is to try to use as much of the available hardware resource as possible. The idea is to go from something like this...

![server resource use without virtualisation](/without_virtualisation.svg)

to something like this...

![server resource use with virtualisation](/with_virtualisation.svg)

This is beneficial for those managing large physical hardware resource pools, for example on-premise datacentres or entire cloud service providers, as they can optimise utilisation, consolidate management, minimise energy, space used etc. It is also beneficial for the users of those resource pools, as they are able to be more specific with how much resource they need, and when they need it.

# Partitioning / Isolation

Virtualisation enables you to use more than one operating system in parallel, utilisting the same physical hardware. It also means that none of Application A's dependencies (installed on VM 1) will conflict with Application B's dependencies (installed on VM 2).

# Portability

A virtual machine (or a container image), can easily be saved as a file and copied or moved to run on a completely different set of physical hardware.

# Security

With VMs, the phsyical hardware is isolated from the operating system, and each application's operating system is isolated from the other's, helping to contain the effects of security breaches.