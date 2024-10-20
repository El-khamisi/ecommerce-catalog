FROM node:18 AS development

WORKDIR /app

COPY . . 

RUN npm install

RUN npm run build

CMD [ "npm", "run", "start:prod"]
