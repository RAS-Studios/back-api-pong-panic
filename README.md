# REST Back-end API

## Description
This repository contains the **back-end exposing an API** used by the VR game [Pong-Panic-VR](https://github.com/RAS-Studios/Pong-Panic-VR) as well as the game's [website]().
## Project Structure

```plaintext
back-api-pong-panic/
├── node_modules/ ➔  Project dependencies installed via npm
├── src/ ➔  Back-end API source code
|   ├── config/ ➔  Configuration files
|   |   └── db.js ➔  Database configuration and connection
|   ├── features/ ➔  API features
|   |   ├── matches/ ➔  Game match management
|   |   |   ├── matches.controller.js
|   |   |   ├── matches.model.js
|   |   |   └── matches.routes.js
|   |   └── users/ ➔  User management
|   |       ├── users.controller.js
|   |       ├── users.model.js
|   |       └── users.routes.js
|   ├── middlewares/ ➔  Application middlewares
|   |   └── auth.middleware.js ➔  Authentication middleware
|   ├── app.js ➔  Express application configuration
|   └── server.js ➔  Server entry point
├── .env ➔  Environment variables
├── .gitignore
├── package-lock.json
└── package.json
```
## Installation

Git clone :

```bash
  git clone https://github.com/RAS-Studios/back-api-pong-panic.git
```
## Technologies used 

- NodeJS
- Express

## Teams

- Sonny NAIDJA
- Alexandre VANNEUVILLE
- Raphaël BEDLEEM

