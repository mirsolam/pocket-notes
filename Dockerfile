# For development image
FROM node:26-bookworm-slim AS build

RUN npm install -g npm@12.0.2

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./

RUN npm ci

# Copy the application
COPY . .

ARG VITE_APP_API_URL

ENV VITE_APP_API_URL=$VITE_APP_API_URL

RUN npm run build

FROM node:26-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/build ./build

COPY --from=build /app/public ./public

EXPOSE 3100

CMD ["npm", "run", "start"]