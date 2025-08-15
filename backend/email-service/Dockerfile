FROM node

WORKDIR /app/email-service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]