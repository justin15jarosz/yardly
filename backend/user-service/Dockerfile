FROM node:20-alpine

WORKDIR /app

# Copy shared exceptions into image
COPY shared ./shared

# Copy and install dependencies
COPY user-service/package.json ./user-service/

WORKDIR /app/user-service
RUN npm install

# Now copy the user-service source
COPY user-service/. .

# Wait-for script
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

EXPOSE 3001
CMD ["/wait-for.sh", "kafka", "29092", "/wait-for.sh", "postgres", "5432", "npm", "start"]
