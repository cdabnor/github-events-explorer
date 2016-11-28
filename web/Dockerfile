FROM node:6.9.1

RUN mkdir /src

RUN npm install nodemon -g
RUN npm install bower -g

WORKDIR /src
ADD package.json package.json
RUN npm install

ADD nodemon.json nodemon.json
