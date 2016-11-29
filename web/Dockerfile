FROM node:6.9.1

RUN mkdir /src

RUN npm install nodemon -g
RUN npm install bower -g
RUN npm install gulp-cli -g

WORKDIR /src
ADD package.json package.json
RUN npm install

ADD nodemon.json nodemon.json

RUN mkdir /src/web/
RUN mkdir /src/web/app
WORKDIR /src/web/app
ADD app/package.json package.json
RUN npm install
ADD app/bower.json bower.json
RUN bower install --allow-root
#ADD app/ .
#RUN gulp

WORKDIR /src
