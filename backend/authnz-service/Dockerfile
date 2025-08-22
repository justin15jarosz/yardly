FROM node:18-alpine

# Install dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache wget \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

# Copy service's package.json first
COPY authnz-service/package*.json ./ 

# Install dependencies
RUN npm ci --only=production

# Copy service code
COPY authnz-service/ ./

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

CMD ["dockerize", \
     "-timeout", "90s", \
     "npm", "start"]