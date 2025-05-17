FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"] 