## POETRY LOCK PARSER

### Description

Poetry lock parser
[poetry.lock](./storage/poetry.lock) to database and filter the database by using search bar

### Layout

![screenshot01](./img/screenshot01.png)
![screenshot02](./img/screenshot02.png)

### Backend

- NodeJS, ExpressJS
- express-fileupload
- concurrently

### Frontend

- ReactJS
- [component diagram](./client/README.md)

### Deployment

- heroku

### Setup

> create .env in <b> client/ </b> with the contain as following

```
    REACT_APP_SERVER_API=http://localhost:5000
    # you can set your server port at root/server.js

```

> install dependencies

```
    npm install
```

> run web app

```
    npm run dev
```
