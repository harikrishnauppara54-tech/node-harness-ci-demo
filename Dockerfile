FROM node:24-alpine

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY src/ ./src/

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
