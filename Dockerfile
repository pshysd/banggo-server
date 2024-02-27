FROM node:20-alpine

WORKDIR /home/app

COPY . .

ENV NODE_ENV production

ENV PORT 80

RUN npm ci

RUN npm run  api-docs

RUN npx pm2 install typescript

CMD ["npm", "run", "prod"]

EXPOSE $PORT