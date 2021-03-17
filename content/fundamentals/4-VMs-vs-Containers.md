---
title: "VMs vs. Containers"
---

While Virtual Machines and Containers rely on different underlying technologies, one of the main use cases of both is to address the problem of efficient hardware utilisation. They are therefore often observed in comparison.

### Benefits of VMs
- Performance closer to that of running on bare metal
- Greater isolation security between guest instances

### Benefits of Containers
- Smaller resource footprint
- Quicker start times
- More suitable for short-lived processes or tasks


## What are containers used for from a developer's perspective
Because of this greater flexibility with containers, they can solve multiple problems developers may face, and be suitable for a variety of tasks. For instance:

- deploying applications in a microservice architecture
- running short-lived processes e.g. scheduled tasks or as part of a pipeline
- CI/CD processes
- local development on different hosts without dependency or operating system conflict
- local development ease-of-setup

Check out [this set of Q&As with various speakers from DevOpsCon2020](https://devopscon.io/blog/docker/docker-vs-virtual-machine-where-are-the-differences), which is an interesting set of takes on the hype around Docker, and where VMs and Containers differ and flourish.

> ..for most users, VMs are created and managed as plain machines that never get replaced. One has to upgrade them, fix them, etc. But a VM is still a full system, when something goes wrong, it’s hard to tell who’s guilty. Containers and Docker are not in conflict with virtual machines; they are complementary technologies for distinct usages. VMs allow users to manage hosts by APIs and offer infrastructure elasticity. Docker allows users to define software as small lego blocks to assemble, so they embrace modern architectures: immutable infrastructures, microservices, distributed software, and more"

> Containers are processes, VMs are servers

> a VM is what it actually says – a hardware machine, virtualized. A container on the other hand is just a process, which using kernel features we can isolate and limit the resources available to it.
