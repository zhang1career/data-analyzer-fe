# Stage 1: Build
FROM node:20.18-alpine AS builder
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json ./
USER node
RUN npm install
RUN npm install typescript
COPY --chown=node:node . .
RUN npm run build

# Stage 2: Run
FROM node:20.18-alpine AS runner
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
ENV NODE_ENV production
COPY --chown=node:node --from=builder /app/next.config.js ./
COPY --chown=node:node --from=builder /app/package.json ./
RUN npm install --omit=dev
RUN npm install typescript
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/server.js ./
EXPOSE 3000
CMD ["npm", "start"]