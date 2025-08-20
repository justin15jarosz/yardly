FROM node:20-alpine

WORKDIR /app

# Copy shared exceptions into image
COPY shared ./shared

# Copy and install dependencies
COPY auth-service/package.json ./auth-service/

WORKDIR /app/auth-service
RUN npm install

# Copy the rest of auth-service source code
COPY auth-service/. .

# Wait-for script
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

EXPOSE 3002

CMD ["/wait-for.sh", "redis", "6379", "/wait-for.sh", "user-service" ,"3001", "npm", "start"]
