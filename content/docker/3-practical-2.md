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