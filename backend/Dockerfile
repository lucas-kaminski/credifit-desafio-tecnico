FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

RUN ls -la dist/ || echo "dist directory is empty"
RUN find dist -type f || echo "No files found in dist"

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start:prod"] 