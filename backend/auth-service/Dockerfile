FROM node:20-alpine

# Install dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache wget \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

# Copy service's package.json first
COPY auth-service/package*.json ./ 

# Install dependencies
RUN npm ci --only=production

# Copy service code
COPY auth-service/ ./

EXPOSE 3002
# Auth service depends on Postgres, Redis, and User Service
CMD ["dockerize", \
     "-wait", "tcp://postgres-db:5432", \
     "-wait", "tcp://redis-cache:6379", \
     "-timeout", "120s", \
     "npm", "start"]