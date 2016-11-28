'use strict';

var _db;

module.exports = function(DbService, MongoClient) {

  class MongoDbService extends DbService {
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
              },
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
        });
      })
    }

  }

  return MongoDbService;
}
