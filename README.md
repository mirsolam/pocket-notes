# Welcome to Pocket Notes!

A simple solution for carrying your notes anywhere without the restrictions of platform or os.

## Features

- 🚀 Lightweight with minimal dependencies other than for frameworks and configurations.
- ⚡️ SQLite for hosting on any device.
- 🔒 Password and note/notebook content encryption.

## Getting Started

### Installation

Install Docker or Podman:

- Docker: https://www.docker.com/products/docker-desktop/
- Podman: https://podman.io/

### Create .env file in project root

Go to the project root directory:
1. Create a .env and add the following varaibles: 

```bash
API_PORT=3500
REACT_PORT=3100
VITE_APP_API_URL=/api
CONTENT_ALGORITHM=aes-256-gcm
CONTENT_IV_LENGTH=12
CONTENT_ENCRYPTION_KEY=
```

2. Generate your own AES-256-GCM content encryption key in a terminal using on of the commands below and save the output in the CONTENT_ENCRYPTION_KEY variable:

```bash
openssl rand -hex 32
```

Or

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Building and start containers

Using your prefered container application, or a terminal, open a terminal in the project root directory and run:

```bash
podman-compose up --build
```

or

```bash
docker compose up --build
```

The application will be available at: http://localhost:3100

## Stopping and removing containers
To stop the containers either use the stop button in the docker/podman desktop application or press the below keys in the container terminal:

`
Ctrl C
`

To remove the containers, first stop them using `Ctrl C` then enter the below command in the project root directory:

```bash
podman-compose down
```

or

```bash
docker compose down
```



Built with ❤️ in Finland using React Router.
