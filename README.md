# express-js-auth-api

NodeJS - ExpressJS API with token based auth and a sequelize DB-Connection.

## Message States

-   0: Created
-   1: Ready to Send
-   3: Send

## Docker

Build:

```sh
docker build -t registry.gitlab.com/timgabhh/docker/template-mailer .
```

Push:

```sh
docker push registry.gitlab.com/timgabhh/docker/template-mailer
```

Run:

```sh
docker run -it --env-file=.env -p 3090:3090 -v ./data:/app/data registry.gitlab.com/timgabhh/docker/template-mailer
```
