# Kdan Check-In

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Swagger API](#swagger)
- [Tests](#tests)

---

## Installation

1. You'll need [Docker and docker-compose][dc].

```bash
$ git clone git@github.com:hsinyu716/kdan-check-in.git && cd kdan-check-in
```

2. Build Docker containers locally:

```bash
$ docker compose up -d --build
```

3. Run migrations & seed:

```bash
$ docker compose exec node_app knex migrate:latest --env development
$ docker compose exec node_app knex seed:run --env development
```

## Usage

```bash
docker-compose up -d
```

Go to `http://localhost:3000` to see the Express app.

## Swagger

Go to `http://localhost:3001` to see the Swagger Api.


## Tests

After you've spun up the container:

```bash
docker compose exec node_app mocha --exit
```

[dc]: https://docs.docker.com/compose/
