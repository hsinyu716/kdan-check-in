[![MIT License][license-shield]][license-url]
[![pipeline status][pipeline-shield]][pipeline-url]

# tdd-node-shows

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Credit](#credit)

---

## About

**tdd-node-shows** is a an example REST API developed with Docker, Node.js, PostgreSQL, and Knex.js.

See [Test Driven Development with Node, Postgres, and Knex (Red/Green/Refactor)][mherman] by Michael Herman for details.

Dockerized with the help of Bret Fisher's [node-docker-good-defaults][nodedockerdefaults].

## Installation

You'll need [Docker and docker-compose][dc].

```bash
git@github.com:sohphiabrandt/tdd-node-shows.git && cd tdd-node-shows
```

## Usage

```bash
docker-compose up -d
```

Go to `http://localhost` to see the Express app.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](LICENSE)

## Credits

- [Michael Herman][mherman]
- [Bret Fisher][nodedockerdefaults]

[dc]: https://docs.docker.com/compose/
[mherman]: https://mherman.org/blog/test-driven-development-with-node/
[nodedockerdefaults]: https://github.com/BretFisher/node-docker-good-defaults
[license-shield]: https://img.shields.io/github/license/sophiabrandt/tdd-node-shows.svg?style=flat-square
[license-url]: https://github.com/sophiabrandt/tdd-node-shows/blob/master/LICENSE
[pipeline-shield]: https://gitlab.com/sophiabrandt/tdd-node-shows/badges/master/pipeline.svg?style=flat-square
[pipeline-url]: https://gitlab.com/sophiabrandt/tdd-node-shows/-/commits/master
