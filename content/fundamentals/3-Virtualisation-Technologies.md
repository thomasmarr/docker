---
title: "Virtualisation Technologies"
---

## VMs and Hypervisors

VMs depend on an abstraction layer above the host OS called a Hypervisor, also sometimes called a Virtual Machine Monitor (VMM). It is responsible for managing multiple guest OSs and their resource requests to the actual hardware. These can be run either directly on the underlying hardware (Type 1) or as a software layer within the host OS (Type 2).

Each VM has its own isolated OS, which can be different from that of the host. This is what's known as true virtualisation. The drawback of this is larger resource requirement of each VM itself. The advantage is that the VM can offer performance close to that of using bare metal.

Some well-known Hypervisors include Xen, Microsoft Hyper-V (Type 1), VirtualBox, VMWare Server & Workstation (Type 2)

![VMs](/virtual_machines.png)

## Containers and Container Runtimes

Containers are not a true virtualisation technology, but can be used in place of virtualisation to solve similar requirements, so are often talked about together. 
A container is fundamentally just a single process running on the host system. This makes them much more lightweight and portable than VMs.

Containers rely on native host OS functionality to isolate processes within a system. These therefore vary between platforms, but are generally known as:
- Control groups, for managing allocation of resources to a process
- Namespaces, to define what that process can/can't interact with (or is even aware of)
- Layer Capabilities, which manage file system operations and extensions

When a container is created, a process is started within the host OS, which thinks it is the root. It has access to a "root" level file system (which is actually a subdirectory of the real root filesystem), and is only aware of child processes of itself (it has a process id, `PID`, of 1, within its own process namespace). It also has access to a virtualised version of other key hardware resources, such as the network interface, that allow it to function as if it were running as an isolated system.

![Containers](/docker_containers.png)

Docker is one of the best known container tools, but is not the only option. It provides functionality for image creation, distribution, and a container runtime engine. There are multiple other tools that aim to solve some or all of the functionality required to run containers effectively. Thankfully, the [Open Container Inititive](https://opencontainers.org/) defines a set of standards for container runtimes, image definitions and distributions that should make the tools somewhat consistent. There is a good review of alternatives to Docker [here](https://towardsdatascience.com/its-time-to-say-goodbye-to-docker-5cfec8eff833), but for the majority of examples and discussion going forward we shall be referring to Docker in particular.
