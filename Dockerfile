# This file is a template, and might need editing before it works on your project.
FROM node:alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN npm config set registry https://registry.npm.taobao.org && npm install
COPY . /usr/src/app

CMD [ "npm", "start" ]

# replace this with your application's default port
EXPOSE 8888