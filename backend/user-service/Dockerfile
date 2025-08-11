FROM node

WORKDIR /app/user-service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]