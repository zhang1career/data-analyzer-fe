FROM node:20.18-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node package*.json ./

USER node

RUN npm install --production
RUN npm install typescript

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "--env-file", ".env", ".next/standalone/server.js" ]
