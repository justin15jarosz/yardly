FROM node:18-alpine

# Install dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache wget \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

# Copy service's package.json first
COPY api-gateway/package*.json ./ 

# Install dependencies
RUN npm ci --only=production

# Copy service code
COPY api-gateway/ ./

EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Email service depends on Redis and Kafka
CMD ["dockerize", \
     "-timeout", "150s", \
     "npm", "start"]