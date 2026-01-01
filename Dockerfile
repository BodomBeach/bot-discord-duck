FROM node:20

WORKDIR /app
RUN mkdir /db
RUN  chown -R node:node /db

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci --include=dev

COPY . .

RUN npm run build

USER node

CMD ["npm", "start"]