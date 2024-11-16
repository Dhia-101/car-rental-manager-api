# Stage 1
FROM node:current-alpine3.13
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app
RUN npm install
ARG JWT_SECRET_KEY
ENV Carsen_jwtPrivateKey=$JWT_SECRET_KEY
COPY . /app

CMD ["node", "index.js"]

# must run in nodejs using cmd no run os tlq