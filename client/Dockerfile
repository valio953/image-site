FROM node:18

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "-c", "npm run start"]
