# For development image
FROM node:26-bookworm-slim

RUN npm install -g npm@12.0.2

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./

RUN npm install

# Copy the application
COPY . .


EXPOSE 3100

CMD ["npm", "run", "dev"]
