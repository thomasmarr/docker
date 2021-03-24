---
title: "Practical 3 - Containers that run as short-lived tasks"
---

In the previous sections we talked about various use cases for containerised processes.

A common use is for long-lived applications such as web-facing servers, where containers bring the advantage of:
- allowing rapid scaling up or down, by deploying more or fewer containers, in response to external demand
- optimising utilisation of compute resources, by sizing processes appropriately and stacking efficiently
- rolling deployments, where application updates can be reliably released incrementally

Another use case is for running one-off or scheduled processes, which run to some completion state and exit. These can form part of data pipelines, build environments, or be actions that run in response to a trigger event.

In this practical we are going to look at how containers can be usefully used to package up a command line tool and distribute that functionality in a cross-platform-compliant executable. This pattern can be useful in avoiding platform-specific bugs, as well as dependency management issues and the classic "but it works on my machine" headache.

The example source code can be copied directly from the [dev sessions repo](https://github.com/arup-group/ade-software-dev-sessions/tree/master/sessions/cloud-and-deployment/week2), but you can also add the files one by one as detailed here.

### Create the sample python application
We are going to create a simple python tool, for use on the command line, that takes some data as input and converts it into a pandas dataframe. This is intended to be a proxy to display how data ingest and transformation could be done in this manner.

The application, called `datamax` is going to have the following structure:
```
- datamax/
-   data/
        example.json
-   scripts/
        minmax.py
-   .dockerignore
-   Dockerfile
-   requirements.txt
```

Create the project root somewhere locally; from now on all commands will assume you are in the application root

```bash
$ pwd
~/ade-software-dev-sessions/sessions/cloud-and-deployment/week2/datamax 
OR
~/path/to/your/repo/datamax
```

The `requirements.txt` contains one dependency:

```
pandas==1.0.3
```


The `data/example.json` file is:

```json
{ "min": [4, 3, 2, 5, 3, 2, 1, 6, 2, 4], "max": [6, 7, 5, 6, 7, 8, 2, 7, 5, 9] }
```

The entry point for the application is the script `scripts/minmax.py`. This contains:

```python
import argparse
import pandas as pd
import logging
import json
import os

LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

def show_df(data):
    df = pd.DataFrame(data)
    print(df.head())
    print(df.max())

if __name__ == '__main__':
    arg_parser = argparse.ArgumentParser(description='Some example python data analysis available via the command line')

    arg_parser.add_argument('-f',
                            '--filepath',
                            help='Location of the data input file')

    arg_parser.add_argument('-i',
                            '--input',
                            help='Data as literal input')

    args = vars(arg_parser.parse_args())

    # configure verbosity of logging output
    logging.basicConfig(level=LOG_LEVEL)

    filepath = args['filepath']
    input = args['input']

    if filepath:
        logging.info(f'Reading data from file system at {filepath}')
        with open(filepath) as data:
            show_df(json.loads(data.read()))
    elif input:
        logging.info('Reading data from command line input')
        show_df(json.loads(input))
    else:
        logging.error('You must provide a dataset via a file or directly as command line input')
        
```

This script is simply reading input data either from a provided filepath or as a string literal, converting it into a pandas dataframe and displaying some descriptive info about the dataset.

### Running it directly

This python script can be called directly to display the behaviour:

```bash
$ python3 scripts/minmax.py -f data/example.json
INFO:root:Reading data from file system at data/example.json
   min  max
0    4    6
1    3    7
2    2    5
3    5    6
4    3    7
min    6
max    9
dtype: int64
```

If this did anything actually useful, it might be the kind of thing that becomes version controlled, shared among team members, and run in multiple environments, on potentially different operating systems. [Python virtual environments](https://docs.python.org/3/tutorial/venv.html) can help manage dependency isolation in python, but that can still be error-prone and have divergent behaviour across operating systems. Some environments may also not allow a remote user to install dependencies onto the host, or have a networking configuration that allows connections to arbitray endpoints to fetch dependencies. In these cases running the application as a container might help.


### Dockerising the application


The `.dockerignore` specifies everything that we don't want included in the output built image. The priority here is for large items and dependencies that will be installed anyway, but it is good practice to exclude anything not required for the running of the application itself:

```md
data
.git
.dockerignore
Dockerfile
README.md
```

The `Dockerfile` defines the base image, dependency installation, inclusion of application source code, setting some environment variables, and the entrypoint. We will come back to these in more detail later. Note that the files in the `data/` directory are not being built into the image.

```Dockerfile
FROM python:3.7-slim-stretch

WORKDIR /usr/src/app

RUN /usr/local/bin/python -m pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./scripts .

ENV LOG_LEVEL=WARNING
ENV PYTHONPATH=./scripts:${PYTHONPATH}

ENTRYPOINT ["python3"]
```

With these added, we can build the image:

```bash
$ docker build -t datamax .
```

What will happen when we run the image with no extra arguments or flags?


```bash
$ docker run datamax
```

The python interpreter exits immediately as there is no terminal output to connect to, and no script to execute. Run the command again but this time tell Docker to attach the output of the Docker container to your terminal window, and make the session interactive:


```bash
$ docker run -it datamax
```

We get a python [REPL](https://en.wikipedia.org/wiki/REPL), just like if you were to execute `python` in your local terminal. This is because the entrypoint to our Docker image is `ENTRYPOINT ["python3"]`, that is the process that is running inside the container. Exit with `exit()`, and the container terminates.

We can now pass extra commands to the container, which will become extra arguments to `python3`:


```bash
$ docker run -it datamax --version
Python 3.7.10
```

### Running the Dockerised application

We now want to run our actual application code. We can pass some input data directly along with the command line invocation:

```bash
$ docker run -it datamax minmax.py \
    -i '{ "min": [4, 3, 2, 5, 3, 2, 1, 6, 2, 4], "max": [6, 7, 5, 6, 7, 8, 2, 7, 5, 9] }'
```

We can also try providing an input file:

```bash
$ docker run -it datamax minmax.py -f data/example.json
```

This isn't going to work, as the data does not exist by default with the container itself. Lets mount the example data in a corresponding directory within the container. Optionally set a `DATA_DIR` environment variable to make subsequent commands more readable:

```bash
$ export DATA_DIR=/path/to/datamax/data

$ docker run -it -v $DATA_DIR:/usr/src/app/data datamax minmax.py -f data/example.json
```

These commands can become a bit of a mouthful, so `bash aliases`, or equivalents, can be helpful. Once you have a steady invocation in terms of parameters/arguments, you can add something like this to your `~/.bashrc`:

```bash
alias example='docker run --rm -it ~/example:/root/example image-name'
```


### Dockerfile in more detail
Lets have a look at some of the commands specified in the `Dockerfile` for this app in more detail.

```Dockerfile
FROM python:3.7-slim-stretch
```
This is specifying a base image that includes python3.7 and it's runtime dependencies. There are often multiple variations of popular images, differing in what they are optimised for. This can be small image size, broad set of functionality, specific c-libs etc. The tags after the `:` determine which version.

By default, this base image will be pulled from [Dockerhub](https://docs.docker.com/docker-hub/official_images/). We can see the commands to build this base image itself [here](https://hub.docker.com/layers/python/library/python/3.7.10-slim-stretch/images/sha256-0cdd21c23f7be7e72fb26ad3fd931a5912d02f682ce84a8b66fa3eb918dc999d?context=explore). We will cover image registries in more detail later on.

```Dockerfile
COPY ./requirements.txt .
RUN pip3 install -r requirements.txt
COPY ./scripts .
```
We copy the dependency specification and do the install before adding any of the source code. This is so we don't trigger the dependency install process again if we update the source. Each line in a Dockerfile creates a new layer, which will be cached, and can be used again during the build, as long as no previous layers have changed. Therefore it's usual to put any inputs to the image that are more iterated more frequently towards the bottom of the Dockerfile.

```Dockerfile
ENV LOG_LEVEL=WARNING
ENV PYTHONPATH=./scripts:${PYTHONPATH}
```

Here we are setting environment variables that are using during container execution. We can override this at runtime by passing environment variables to the container as part of the run command:

```bash
$ docker run -it -e LOG_LEVEL=INFO -v $DATA_DIR:/usr/src/app/data datamax minmax.py -f data/example.json
```

