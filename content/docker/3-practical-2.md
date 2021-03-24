---
title: "Practical 2 - Containers that don't die, and file storage that persists"
---

In the previous section we created a simple docker container which executed some javascript and then stopped running. In this section we'll create a docker container which runs a node.js express server, which will idle and listen for requests (i.e. the container won't exit immediately).

We'll access a terminal inside the container, and create a file. We'll see that files created or edited inside running containers do not persist after the container is removed, and finally we'll look at ways to persist data.

# Source code
---

Create a directory (the name and location don't matter). From inside that directory, run:

```bash
npm init -y
npm install express
```

In the same directory, create a javascript file named `server.js` with the following contents:

```javascript
'use strict'

const express = require("express")

const PORT = 8080
const HOST = '0.0.0.0'

const app = express()
app.get('/', (req, res) => {
        res.send('Hello, world!')
})

app.listen(PORT, HOST)
console.log(`Listening on http://${HOST}:${PORT}`)
```

# Dockerfile
---

Add a Dockerfile with the following contents:

```dockerfile
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
```

And a .dockerignore file (i.e. named `.dockerignore`) with the collowing contents:

```
node_modules
npm-debug.log
```

# Build
---

Now build the image:

```bash
$ docker build -t express-app .
```

# Run
---

Then run a container from that image:
```bash
$ docker run --name express-app-container -p 8080:8080 -d express-app
```

Then browse to localhost:8080 in your web browser and behold "Hello, world!'.

There a couple of important flags being passed to this command:
- `-p` identifies which port on the host machine to forward to the Docker container
  - try running the command above without including the port-forward. Visiting localhost:8080 will no longer work, as the container is listing on port 8080 of its own virtualised network interface, whereas your browser is hitting port 8080 of the host machine network interface
- `-d` runs the container in `detached` mode, which backgrounds the process from the terminal used to run the command
  - an alternative to this which is sometimes useful is `-it`, which attaches the current terminal to the container, so you can see `STDOUT` logs

# Access terminal
---

Now jump back to a terminal, and them move onto a terminal 'inside' the container by running the following:

```bash
$ docker exec -it express-app-container bash
```

Check the working directory:
```bash
container$ pwd
```

That'll output the WORKDIR from the dockerfile. Now create a file:

# Examine file persistence
---

```bash
container$ touch a-new-file.txt
```

`ls` to check it's really there

```bash
container$ ls
```

Now exit the container terminal

```bash
container$ exit
```

Stop the container
```bash
$ docker stop express-app-container
```

Start the container

```bash
$ docker start express-app-container
```

Jump back on a terminal 'inside' the container

```bash
$ docker exec -it express-app-container bash
```

Check if the file is still there:

```bash
container$ ls
```

Now exit the container:

```bash
container$ exit
```

Stop the container:
```bash
$ docker stop express-app-container
```

Remove the container:
```bash
$ docker rm express-app-container
```

Create a container:
```bash
$ docker run --name express-app-container -p 8080:8080 express-app
```

Get on a terminal in that container:
```bash
$ docker exec -it express-app-container bash
```

Check if the file is there:
```bash
container$ ls
```

Files do not persist when containers are removed. The next time you create a container it starts from scratch again, by design. Persistence can be added where needed, using bind mounts and/or volumes.

# Persisting storage

We have so far been running containers with temporary file systems, which are lost when the container exits. Let's allow the container to read and write from a persistent volume attached to the host.


Update the server.js file to include the following route:

```javascript
app.get('/mountedfile', (req, res) => {
  fs.readFile('data/testfile.txt', 'utf-8', (err, data) => {
                if(err) console.log(err)
                res.end(data)
        })
})
```

After updating the application source code, you will need to rebuild the image, so that the image contains the latest changes.

```bash
$ docker build -t express-app .
```

Create a directory on your host file system named e.g. `data`, and add a text file.

```bash
$ mkdir /tmp/data
$ echo "some example text" >> /tmp/data/testfile.txt
```

Now create a new container that will mount a host directory onto a location in the container file system, using the `-v` flag.

The syntax is `docker run -v /path/to/host/directory:/path/to/container/location ...`

```bash
$ docker run --name express-app-container -v /tmp/data/:/usr/src/app/data -p 8080:8080 express-app
```

Visit localhost:8080/mountedfile to view the file contents, which can then be changed independently of the container running.
This directory will now be accessible to this, and potentially other, running containers, and persist when they are removed.


# Examine processes

We said before that containers are isolated processes. We can use the `ps` command to investigate running processes in a unix system.

List running processes on your local host system:
```bash
$ ps aux
```

There is a lot going on here, most of which would be irrelevant to the running of the process in question e.g. a node server. Scaling this environment would require either weeding out only the relevant dependencies for ensuring node functions correctly, or replicating a lot of unnecessary overhead. 
A VM would not look dissimilar to this.

Get back on a terminal in the running container:
```bash
$ docker exec -it express-app-container bash
```

List running processes inside the container:
```bash
$ ps aux
```

You should see `node server.js` that has been run by the `root` user with a `PID` of 1. This means it is the root process of this Unix namespace.
There will also be a process for the `bash` shell you are currently running, plus the `ps` call, but these are only ephemeral.

Scaling this node server that has been containerised is simply a case of running more containers.
