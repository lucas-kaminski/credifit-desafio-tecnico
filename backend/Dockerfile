FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

RUN npx prisma generate

RUN ls -la dist/ && ls -la dist/src/

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/src/main"] 