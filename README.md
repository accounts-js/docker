# accounts

## How to use this image

### build and run using Docker CLI

```console
$ docker build -t accounts-js .
$ docker run -it accounts-js -e ACCOUNTS_DB=mongo -e ACCOUNTS_DB_URL=mongodb://db -e ACCOUNTS_SECRET=my_secret
```

### or if you prefer Docker Compose

```yml
version: "3"

services:
    app:
        build:
            context: .
            dockerfile: Dockerfile
        environment:
            - ACCOUNTS_DB=mongo
            - ACCOUNTS_DB_URL=mongodb://db
            - ACCOUNTS_SECRET=my_secret
        ports:
            - 4000:4000
        
    db:
        image: mongo:4
```

You can then run using Docker Compose command

```console
$ docker-compose up -d
```
