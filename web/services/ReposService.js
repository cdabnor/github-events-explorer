'use strict';

module.exports = function(RedisService, MongoDbService) {
  return class ReposService {

    static getTopActors() {
      return new Promise((resolve, reject) => {
        RedisService.getReposTopActors().then((cachedResult) => {
          if(cachedResult) {
            resolve(cachedResult);
          } else {
            MongoDbService.getReposTopActors().then((repos) => {
              // cache the result
              RedisService.setReposTopActors(repos);
              // return the result
              resolve(repos);
            }, (err) => {
              reject(err);
            });
          }
        });
      });
    }

  }
};
