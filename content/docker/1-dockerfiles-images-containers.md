---
title: "Dockerfiles, Images and Containers"
---

# Terminology

There are three basic terms you need to understand to being working with docker:

1. Container **image** - you can think of this as a snapshot of your virtualised system (your container) frozen in time, and not doing anything. It just sits there on your filesystem (or in a registry somewhere) waiting to be *run*.
2. **Dockerfile** - this is just a text file with a list of instructions for how to create a *container image*. There is no file extension. Naming it Dockerfile is conventional, (and docker will automatically detect it with this name). You can name them anything you want though, and use CLI flags to tell docker which file you want to use. This will become clearer later.
3. **Container** - when you run a container image, docker creates a **container** which is isolated from the host system and exectues whatever process you have specfied in the dockerfile.

# Dockerfile

In a basic Dockerfile, there are three main sections:

1. The base image which you want to build on
2. The 'middle part', where you specify all the steps that need to be performed to flesh out the image. For example; copying some files from a directory on the host into the container image, installing dependencies, setting environment variables, running commands etc.
3. The 'command' or 'entrypoint'. This is where you define the core process you want to run when the container starts. If this process dies or is killed the container will stop running.

# Container image

When you **build** a container image from a Dockerfile, docker will go through the Dockerfile line-by-line in order, creating 'layers'. The layers are stacked one on top of the other in the order they were created, and all the layers combined form the complete image.

Don't worry if the 'layers' concept is hazy. It's not super important to you as a dev, except to remember that the *order* you choose to create layers in can be important. We'll come back to this later.

# Container

When the image is built, it's not really *doing* anything. In order to get it to run the command you specified in the dockerfile, you have to tell docker to `run` the image. At that point docker will create a **container** from the image, and execute the specified command.

A container does not run a full operating system like a VM does. A container runs on the host operating system, via the docker engine (a.k.a. the container runtime), but it is **isolated** from the host. This means it can be *much* lighter weight than a VM, as it only needs to contain direct dependencies for the required process.

It's important to note that every container should have a core process, which is defined by the main command at the end of the Dockerfile. When that process dies, the container dies.