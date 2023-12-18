FROM node:lts-alpine

ENV APP_NAME key-controler-front

WORKDIR /app

COPY .env package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts ./

COPY src ./src

RUN npm install --silent

EXPOSE 3000

CMD [ "npm", "run", "dev"]


