# For production image
FROM node:26-bookworm-slim

RUN npm install -g npm@12.0.2

WORKDIR /app/backend

# Install dependencies first for better layer caching
COPY package*.json ./

RUN mkdir -p /data

RUN npm ci --omit=dev 

# Copy the application
COPY . .

EXPOSE 3500

CMD ["node", "index.js"]