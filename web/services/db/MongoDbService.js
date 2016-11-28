'use strict';

var _db;

module.exports = function(MongoClient) {

  class MongoDbService {
    static get connection() {
      return new Promise((resolve, reject) => {
        if(_db) {
          resolve(_db);
        } else {
          let host = process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost';
          let port = process.env.MONGODB_PORT_27017_TCP_PORT || 27017;
          let dbName = process.env.MONGDB_DBNAME || 'Github';
          MongoClient.connect(`mongodb://${host}:${port}/${dbName}`, {
            db: { bufferMaxEntries: 0 }
          }, (err, db) => {
            if(!err) {
              _db = db;
              resolve(_db);
            } else {
              reject(err);
            }
          });
        }
      });
    }

    static getActor(login) {
      return new Promise((resolve, reject) => {
        MongoDbService.connection.then((connection)=> {
          let collection = connection.collection('events');
          // find the actor.login details from the most recent event
          collection.findOne(
            { "actor.login": login },
            {}, // return all fields
            { "sort": [['created_at','desc']] },
            (err, document) => {
              if(!err) {
                let actor = document ? document.actor : document;
                resolve(actor);
              } else {
                reject(err);
              }
            }
          );
        }, (err) => {
          reject(err);
        });
      });
    }

    static getActorContributedRepos(login) {
      return new Promise((resolve, reject) => {
        MongoDbService.connection.then((connection)=> {
          let collection = connection.collection('events');
          // select unique repo (id, name, url) combination to determine the
          // repos that the supplied actor.login has contributed to
          collection.aggregate([
            {
              $match: {
                "actor.login": login
              }
            }, {
              $sort: {
                'created_at': -1
              }
            }, {
              $group: {
                _id: '$repo.id',
                repoName: { $first: '$repo.name' },
                repoUrl: { $first: '$repo.url' }
              }
            }
          ]).toArray((err, documents) => {
            if(!err) {
              resolve(documents);
            } else {
              reject(err);
            }
          });
        }, (err) => {
          reject(err);
        });
      })
    }

    static getActorTopRepos(login) {
      return new Promise((resolve, reject) => {
        MongoDbService.connection.then((connection)=> {
          let collection = connection.collection('events');
          // select unique repo (id, name, url) combination to determine the
          // repos that the supplied actor.login has contributed to
          collection.aggregate([
            {
              $match: {
                "actor.login": login
              }
            }, {
              $group: {
                _id: "$repo.id",
                repoName: { $first: '$repo.name' },
                repoUrl: { $first: '$repo.url' },
                count: {
                  $sum: 1
                }
              }
            },
            {
              $sort: {
                count: -1,
                created_at: -1
              }
            }
          ]).toArray((err, documents) => {
            if(!err) {
              let topRepo = undefined;
              if(documents && documents.length > 0) {
                topRepo = documents[0];
              }
              resolve(topRepo);
            } else {
              reject(err);
            }
          });
        }, (err) => {
          reject(err);
        });
      })
    }

    static getReposTopActors() {
      return new Promise((resolve, reject) => {
        MongoDbService.connection.then((connection)=> {
          let collection = connection.collection('events');
          collection.aggregate([
            {
              $match: {}
            }, {
              $group: {
                _id: { id: "$repo.id", name: '$repo.name', url: '$repo.url' },
                contributors: {
                  $push: "$actor"
                },
                count: {
                  $sum: 1
                }
              }
            }
          ]).toArray((err, documents) => {
            if(!err) {
              var repos = [];
              var contributors = {};
              documents.forEach((d) => {
                var repo = d._id;
                // create map of contributor to
                // contribution count to determine top contributor
                // TODO: Perform this as part of the MongoDB aggregation
                repo.topContributor = null;
                d.contributors.forEach((c) => {
                  if(contributors[c.login]) {
                    contributors[c.login].count += 1
                  } else {
                    contributors[c.login] = c;
                    contributors[c.login].count = 1;
                  }

                  if(!repo.topContributor || c.count > repo.topContributor.count) {
                    repo.topContributor = c;
                  }
                });

                repos.push(repo);
              });
              resolve(repos);
            } else {
              reject(err);
            }
          });
        });
      })
    }

  }

  return MongoDbService;
}
