# todo-server-ts

This is a simple todo server written in typescript using express and postgresql (Dockerized).

There is a client written in Svete, which can be found [here](https://github.com/mxmarchal/todo-client).

## How to run

### Prerequisites

- Docker
- Docker-compose
- Node.js

### Steps

1. Clone the repository
2. Run `npm install`
3. Run `docker-compose up -d` to start the database
4. Create a `.env` file in the root of the project and add the following variables:

```
PORT=3000 # Port on which the server will run
PGUSER=postgres # Username for the database
PGHOST=localhost # Host for the database
PGPASSWORD=test # Password for the database (default is test, can be changed in docker-compose.yml)
PGDATABASE=postgres # Database name
PGPORT=5432 # Port on which the database will run
```

5. Run `npm run dev` to start the server in development mode. The server will restart automatically when a file is changed.

The server should now be running on `http://localhost:3000`.

## API

### GET /

Returns a list of all todos.

### GET /:id

Returns a single todo.

### POST /

Creates a new todo.

Sample request body:

```
{
    "text": "Todo title",
    "complete": false
}
```

### PUT /:id

Updates a todo.

Sample request body:

```
{
    "text": "Todo title updated",
    "complete": true
}
```

### DELETE /:id

Deletes a todo.

## Good to know

- This project is not meant to be used in production. It is just a simple project to try Postgres with Docker and Typescript.
- There is no authentication or authorization (or any other security measure) implemented.
- The database is persistant, so you can stop the container and start it again without losing data.
- The database is initialized with a table called `todos`.
