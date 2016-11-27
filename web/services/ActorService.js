'use strict';

module.exports = function(MongoClient) {
  return class ActorService {
    static get INVALID_LOGIN() { return 'INVALID_LOGIN' };

    static getActor(login) {
      return new Promise(function(resolve, reject) {
        login = login.trim();

        if(login && login.length > 0) {

        } else {
          reject({
            name: ActorService.INVALID_LOGIN,
            message: 'Invalid login specified'
          });
        }

        resolve({ login: login });
      });
    }

    static getActorTopRepos(login) {

    }
  }
};
