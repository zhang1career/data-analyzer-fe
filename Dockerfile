FROM node:20.18-alpine

RUN sudo mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node package*.json ./

USER node

RUN npm config set registry http://registry.npmjs.org
RUN npm install --production

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD [ "node", ".next/standalone/server.js" ]