'use strict';

module.exports = function(MongoDbService) {
  return class ActorService {
    static get INVALID_LOGIN() { return 'INVALID_LOGIN' };

    static getActor(login) {
      return new Promise((resolve, reject) => {
        login = login.trim();

        if(login && login.length > 0) {
          MongoDbService.getActor(login).then((actor) => {
            if(actor) {
              // now fetch contributed repos for actor
              MongoDbService.getActorContributedRepos(login).then((repos) => {
                resolve({
                  actor: actor,
                  repos: repos || []
                });
              }, (err) => {
                reject(err);
              });
            } else {
              // actor does not exist in events, no need to fetch repos
              resolve({
                actor: actor,
                repos: []
              });
            }
          }, (err) => {
            reject(err);
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
          MongoDbService.getActorTopRepos(login).then((repo) => {
            resolve(repo);
          }, (err) => {
            reject(err);
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
