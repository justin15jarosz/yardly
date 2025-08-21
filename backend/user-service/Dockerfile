FROM node:18-alpine

# Install dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache wget \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

# Copy service's package.json first
COPY user-service/package*.json ./ 

# Install dependencies
RUN npm ci --only=production

# Copy service code
COPY user-service/ ./

EXPOSE 3001
# User service depends on Postgres, Kafka
CMD ["dockerize", \
     "-wait", "tcp://postgres-db:5432", \
     "-wait", "tcp://kafka-broker:9092", \
     "-timeout", "90s", \
     "sh", "-c", "npm run migrate:up && npm start"]