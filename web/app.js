'use strict';

let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let redis = require('redis');
let bodyParser = require('body-parser');

// Wire up dependencies
let redisService = require('./services/cache/RedisService')(
  redis
);

let mongodbService = require('./services/db/MongoDbService')(
  MongoClient
);

let actorService = require('./services/ActorService')(
  redisService, mongodbService
);
let reposService = require('./services/ReposService')(
  redisService, mongodbService
);
let actorHandler = require('./handlers/ActorHandler')(
  actorService
);
let reposHandler = require('./handlers/ReposHandler')(
  reposService
)

let app = express();

app.use(express.static(__dirname + '/app/dist'));

app.get('/api/actor/:login', actorHandler.getActor);
app.get('/api/actor/:login/topRepos', actorHandler.getActorTopRepos);

app.get('/api/repos/topActors', reposHandler.getTopActors);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {});
