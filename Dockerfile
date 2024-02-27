FROM node:20-alpine

WORKDIR /home/app

COPY . .

RUN npm install

RUN npm run  api-docs

RUN npx pm2 install typescript

CMD ["npm", "run", "prod"]

EXPOSE 80