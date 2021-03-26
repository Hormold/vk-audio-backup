FROM node:12.21-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY app.js .
COPY api.js .
COPY downloader.js .

CMD [ "node", "app.js" ]