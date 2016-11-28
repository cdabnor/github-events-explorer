'use strict';

module.exports = function(RedisService, MongoDbService) {
  return class ActorService {
    static get INVALID_LOGIN() { return 'INVALID_LOGIN' };

    static getActor(login) {
      return new Promise((resolve, reject) => {
        login = login.trim();

        if(login && login.length > 0) {
          RedisService.getActor(login).then((cachedResult) => {
            if(cachedResult) {
              resolve(cachedResult);
            } else {
              MongoDbService.getActor(login).then((actor) => {
                if(actor) {
                  // now fetch contributed repos for actor
                  MongoDbService.getActorContributedRepos(login).then((repos) => {
                    let result = {
                      actor: actor,
                      repos: repos || []
                    };
                    // cache the result
                    RedisService.setActor(login, result);
                    // return the result
                    resolve(result);
                  }, (err) => {
                    reject(err);
                  });
                } else {
                  // actor does not exist in events, no need to fetch repos
                  let result = {
                    actor: actor,
                    repos: []
                  };
                  // cache the result
                  RedisService.setActor(login, result);
                  // return the result
                  resolve(result);
                }
              }, (err) => {
                reject(err);
              });
            }
          });
        } else {
          reject({
            name: ActorService.INVALID_LOGIN,
            message: 'Invalid login specified'
          });
        }
      });
    }

    static getActorTopRepos(login) {
      return new Promise((resolve, reject) => {
        login = login.trim();

        if(login && login.length > 0) {
          RedisService.getActorTopRepos(login).then((cachedResult) => {
            if(cachedResult) {
              resolve(cachedResult);
            } else {
              MongoDbService.getActorTopRepos(login).then((repo) => {
                // cache the result
                RedisService.setActorTopRepos(login, repo);
                // return the result
                resolve(repo);
              }, (err) => {
                reject(err);
              });
            }
          });
        } else {
          reject({
            name: ActorService.INVALID_LOGIN,
            message: 'Invalid login specified'
          });
        }
      });
    }
  }
};
