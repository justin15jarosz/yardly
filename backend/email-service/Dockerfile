FROM node:18-alpine

# Install dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache wget \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

# Copy service's package.json first
COPY email-service/package*.json ./ 

# Install dependencies
RUN npm ci --only=production

# Copy service code
COPY email-service/ ./

EXPOSE 3003
# Email service depends on Redis and Kafka
CMD ["dockerize", \
     "-wait", "tcp://redis-cache:6379", \
     "-wait", "tcp://kafka-broker:9092", \
     "-timeout", "90s", \
     "npm", "start"]