FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build && ls -la dist/

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start:prod"] 