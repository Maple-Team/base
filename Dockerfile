FROM node:18-alpine3.14

WORKDIR /app

VOLUME /app

RUN npm install pnpm -g

COPY scripts/while.js /app/scripts/while.js

COPY package.json /app/package.json

# TODO 暴露服务端口

CMD ["npm", "start"]