FROM node:20-slim

RUN apt-get update && apt-get install git -y

ENV PORT 3000
EXPOSE $PORT

WORKDIR /app

ADD ./package.json ./package.json
ADD ./package-lock.json ./package-lock.json

RUN npm install

ADD . /app

RUN npm run build

ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]
