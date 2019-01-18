FROM node:current-alpine

RUN npm install jsonwebtoken

ADD index.js index.js

ENTRYPOINT ["node", "index.js"]