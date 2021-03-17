---
title: "Practical 1 - Write a Dockerfile, build an Image and run a Container"
---

We are going to write a very basic Dockerfile which we can build an image from, and then run a container from that image which executes some javascript code.

# Source code
---

Create a directory somewhere on your machine. Doesn't matter where, or what it's called. Create a file named `hello-world.js` in that directory with the below contents.

hello-world.js
```javascript
console.log('Hello, world!')
```

This is pretty self explanatory. If you execute this javascript file (i.e. `node ./hello-world.js`) it'll spit out the 'Hello, world!' string to your terminal. You are going to copy this file into a docker image and run a container based on that image, which executes the file.

# Write a Dockerfile
---

Next, create a file called `Dockerfile` in the same directory, with the following contents:

```dockerfile
FROM node:latest
COPY ./hello-world.js .
CMD ["node", "./hello-world.js"]
```

The first line specfies that we want to build from the latest version of the stock node image. This will be downloaded automatically from docker hub which we'll come back to later.

The second line `COPY`s the `hello-world.js` file from the current working directory on the host (i.e. the `./` part) to the current working directory in the container image (the `.` at the end of the line)

The third line is the command (`CMD`) which will be run whenever a container is started based on the image. There is more than one way to specfiy this. The `CMD ["executable", "and", "params"]` format is used here. More on the alternatives later.

# Build a container image
---

Now you have the Dockerfile. That defines how to build an image, but you haven't *built* the image yet. To build it, (from the same directory) run the following command.

```bash
$ docker build -t hello-world .
```

This command has a few parts.
- `docker build` tells docker to build an image from a Dockerfile.
- `-t hello-world` *tags* the image with a recognisable name (this is optional but if you don't to it docker will assign a random name and that makes working with multiple images harded to make sense of).
- `.` tells docker that the **build context** is the current directory. This means it'll look for a Dockerfile here and build from that. Each line in the dockerfile will run relative to the build context, so when you do sometghing like `COPY ./some-file .` it will look for `some-file` in the build context.

Full documentation for `docker build` can be found [here](https://docs.docker.com/engine/reference/commandline/build/).

You should see output which looks a bit like this:

```bash
[+] Building 37.7s (7/7) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 37B
 => [internal] load .dockerignore
 => => transferring context: 2B
 => [internal] load metadata for docker.io/library/node:latest
 => [internal] load build context
 => => transferring context: 35B
 => [1/2] FROM docker.io/library/node:latest@sha256:def7bb01cc33bc226e2fb94e6b820e5db9a3793e342c21d70e18ed6e3e3cc68a
 => => resolve docker.io/library/node:latest@sha256:def7bb01cc33bc226e2fb94e6b820e5db9a3793e342c21d70e18ed6e3e3cc68a
 => => sha256:def7bb01cc33bc226e2fb94e6b820e5db9a3793e342c21d70e18ed6e3e3cc68a 776B / 776B
 => => sha256:56bc674036dc4e2bd2cd490939d04842c10a0c195c9184363573860c359086fc 7.83kB / 7.83kB
 => => sha256:3ddd031622b35dad4be68eec6ac0787b0394f37b3dbb600a04e8b2363297b8d7 11.27MB / 11.27MB
 => => sha256:ed78ee5153382701a4ca5d363a56b526fca073841186b70b9ed1c280dee92363 2.21kB / 2.21kB
 => => sha256:16cf3fa6cb1190b4dfd82a5319faa13e2eb6e69b7b4828d4d98ba1c0b216e446 45.38MB / 45.38MB
 => => sha256:69c3fcab77df556f3a56ec3d2a5b5cc304f4c4d4341b6f8423dd86ebe5ddaebb 4.34MB / 4.34MB
 => => sha256:a403cc031caeb1ddbae71b9f7e47d7854415c8aa6f0b84b8e7be4b3db513867e 49.79MB / 49.79MB
 => => sha256:b900c5ffbaf4b4884b18eb27cec8a890510d745d6a65ba90efe10c9cdeaaade8 214.34MB / 214.34MB
 => => sha256:f877dc3acfca02604e73fb01208848941a1718b55297038decc5464f36edd649 4.19kB / 4.19kB
 => => extracting sha256:16cf3fa6cb1190b4dfd82a5319faa13e2eb6e69b7b4828d4d98ba1c0b216e446
 => => sha256:6779ae40941d54401cbb2a16e55b2a4e2dcaf635aaf5c0edc1140867660fbd78 34.05MB / 34.05MB
 => => sha256:cc22e2b1bc09a54e7d1fb7dc84f037cedba749071cc5fa0f9056232054801884 2.38MB / 2.38MB
 => => extracting sha256:3ddd031622b35dad4be68eec6ac0787b0394f37b3dbb600a04e8b2363297b8d7
 => => extracting sha256:69c3fcab77df556f3a56ec3d2a5b5cc304f4c4d4341b6f8423dd86ebe5ddaebb
 => => sha256:70e96dddd4f16fb4e8cbe8c671d40acdb485440e5346e86eca021b82d7c739e2 294B / 294B
 => => extracting sha256:a403cc031caeb1ddbae71b9f7e47d7854415c8aa6f0b84b8e7be4b3db513867e
 => => extracting sha256:b900c5ffbaf4b4884b18eb27cec8a890510d745d6a65ba90efe10c9cdeaaade8
 => => extracting sha256:f877dc3acfca02604e73fb01208848941a1718b55297038decc5464f36edd649
 => => extracting sha256:6779ae40941d54401cbb2a16e55b2a4e2dcaf635aaf5c0edc1140867660fbd78
 => => extracting sha256:cc22e2b1bc09a54e7d1fb7dc84f037cedba749071cc5fa0f9056232054801884
 => => extracting sha256:70e96dddd4f16fb4e8cbe8c671d40acdb485440e5346e86eca021b82d7c739e2
 => [2/2] COPY ./hello-world.js . 
 => exporting to image
 => => exporting layers
 => => writing image sha256:849dc92d9df44a82396f7b5c74989a3418b5bf0dcb3ca5a4288c88e968f50886
 => => naming to docker.io/library/hello-world
 ```

The container image has now been created. You can confirm this by telling docker to list (`ls`) the `image`s:

```bash
$ docker image ls
```

Full documentation for `docker image` can be found [here](https://docs.docker.com/engine/reference/commandline/image/).

The output should look something like this (if you've used docker before there may be other images shown in the list - that's fine):

```bash
REPOSITORY                       TAG                 IMAGE ID            CREATED             SIZE
hello-world                      latest              849dc92d9df4        7 seconds ago       937MB
```

# Run the container
---

Now that we have the image, the last thing to do is `run` it.

```bash
$ docker run --name hello-world-container hello-world
```

Technically, `docker run` can be used to run any arbitrary command inside a container, but since we are not specifying a command it will just run the command specified in the Dockerfile.

The `--name hw-container` bit is telling docker we want to call the new container 'hw-container'. You can call it whatever you want but it's recommended to always name your containers so you can make sense of them later. If you don't, docker will assign a random name which makes that difficult.

The `hello-world` bit is telling docker which image to use (i.e. the one we just built).

Full documentation for `docker run` can be found [here](https://docs.docker.com/engine/reference/commandline/run/).

You should see output like this:

```bash
/directory-name$ docker run hello-world
Hello, world!
```

Now, the fact that we used `docker run` implies that we have created a container from the image we built. We *should* be able to tell docker to list (`ls`) the `container`s on the system and see it there.

```bash
$ docker container ls
```

But it's not there, right? Remember that if the main container's process dies, so does the container. When it executes `node ./hello-world.js`, a node process starts, logs 'Hello, world!' to the terminal, and then terminates. The docker container then stops. `docker container ls` by default only shows *running* containers. You have to add a `-a` flag to see *all* containers (including the stopped ones). Just like when you want to list hidden files in a directory with `ls -a`.

Full documentation for `docker container` can be found [here](https://docs.docker.com/engine/reference/commandline/container/).

```bash
$ docker container ls -a
```

Now you should see your (stopped) container in the output. Note that the `IMAGE` is 'hello-world', `NAMES` is 'hw-container' and the `STATUS` is 'Exited (0) ...'

```bash
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS                           PORTS                    NAMES
172d332aa8ad        hello-world              "docker-entrypoint.s…"   About an hour ago   Exited (0) About an hour ago                              hw-container
```

# Cleanup
---

You now have the following items on your system:

- A directory with a javascript file and a Dockerfile
- A docker image (at least two images, technically)
- A docker container

You can delete the directory and files in the usual way, but the image and container will stick around until you use the docker CLI to remove them. 

Docker will not allow you to remove an image if there is a container on your system still using that image - so you'll have to remove the container first, then the image.

To remove (`rm`) the container you need to run:

```bash
$ docker rm hw-container
```

If you had not named the container, then you'd have to run `docker container ls` first, get the autogenerated name, and use that.

Full documentation for `docker rm` can be found [here](https://docs.docker.com/engine/reference/commandline/rm/).

It's also possible to use `docker container prune`, but this will remove **all** stopped containers so just be sure that's what you want. Full documentation for `docker prune` can be found [here](https://docs.docker.com/engine/reference/commandline/container_prune/).

To remove (`rm`) the image (`i`) you need to run:

```bash
$ docker rmi hello-world
```

Note that rmi == 'remove image', and the image name is hello-world. If you had not tagged the image when you ran `docker build`, then you'd have to run `docker image ls` first. The output would look something like this:

```bash
REPOSITORY                       TAG                 IMAGE ID            CREATED             SIZE
<none>                           <none>              849dc92d9df4        2 hours ago         937MB
```

In that case you need to reference the image by it's ID (i.e. `docker rmi 849dc92d9df4`).

Full documentation for `docker rmi` can be found [here](https://docs.docker.com/engine/reference/commandline/rmi/).

