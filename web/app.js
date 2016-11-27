'use strict';

let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');

// Wire up dependencies
let actorService = require('./services/ActorService')(
  MongoClient
);
let reposService = require('./services/ReposService')(
  MongoClient
);
let actorHandler = require('./handlers/ActorHandler')(
  actorService
);
let reposHandler = require('./handlers/ReposHandler')(
  reposService
)

let app = express();

app.get('/api/actor/:login', actorHandler.getActor);
app.get('/api/actor/:login/topRepos', actorHandler.getActorTopRepos);

app.get('/api/repos/topActors', reposHandler.getTopActors);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {});
