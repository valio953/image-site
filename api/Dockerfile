FROM node:18

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run start"]
