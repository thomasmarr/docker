---
title: "Why Virtualise?"
---

# Resource Utilisation

Arguably the primary reason for virtualisation is to try to use as much of the available hardware resource as possible. The idea is to go from something like this...

![server resource use without virtualisation](/without_virtulisation.svg)

to something like this...

![server resource use with virtualisation](/with_virtulisation.svg)

# Partitioning / Isolation

Virtualisation enables you to use more than one operating system in parallel, utilisting the same physical hardware. It also means that none of Application A's dependencies (installed on VM 1) will conflict with Application B's dependencies (installed on VM 2).

# Portability

A virtual machine (or a container image), can easily be saved as a file and copied or moved to run on a completely different set of physical hardware.

# Security

With VMs, the phsyical hardware is isolated from the operating system, and each application's operating system is isolated from the other's, helping to contain the effects of security breaches.