'use strict';

var _client;

module.exports = function(redis) {

  class RedisService {
    static get connection() {
      return new Promise((resolve, reject) => {
        if(_client) {
          resolve(_client);
        } else {
          let host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.01';
          let port = process.env.REDIS_PORT_6379_TCP_PORT || 6379;
          let client = redis.createClient(port, host);

          client.on("error", (err) => {
            reject(err);
          });

          client.on("connect", () => {
            _client = client;
            resolve(_client);
          });
        }
      });
    }

    static getActor(login) {
      return new Promise((resolve, reject) => {
        // TODO: Handle errors. For now, if cache fails we just continue
        RedisService.connection.then((client) => {
          client.get(`actor:${login}`, (err, reply) => {
            resolve(JSON.parse(reply));
          });
        }, (err) => {
          resolve(null);
        })
      });
    }

    static setActor(login, data) {
      return new Promise((resolve, reject) => {
        // TODO: Handle errors. For now, if cache fails we just continue
        RedisService.connection.then((client) => {
          // cache the JSON value as a String
          client.set(`actor:${login}`, JSON.stringify(data), () => {
            resolve(data);
          });
          // set TTL on the key
          client.expire(`actor:${login}`, 60);
        }, (err) => {
          resolve(null);
        })
      });
    }

    static getActorTopRepos(login) {
      return new Promise((resolve, reject) => {
        // TODO: Handle errors. For now, if cache fails we just continue
        RedisService.connection.then((client) => {
          client.get(`actorTopRepos:${login}`, (err, reply) => {
            resolve(JSON.parse(reply));
          });
        }, (err) => {
          resolve(null);
        })
      });
    }

    static setActorTopRepos(login, data) {
      return new Promise((resolve, reject) => {
        // TODO: Handle errors. For now, if cache fails we just continue
        RedisService.connection.then((client) => {
          // cache the JSON value as a String
          client.set(`actorTopRepos:${login}`, JSON.stringify(data), () => {
            resolve(data);
          });
          // set TTL on the key
          client.expire(`actorTopRepos:${login}`, 60);
        }, (err) => {
          resolve(null);
        })
      });
    }

    static getReposTopActors() {
      return new Promise((resolve, reject) => {
        // TODO: Handle errors. For now, if cache fails we just continue
        RedisService.connection.then((client) => {
          client.get(`reposTopActors`, (err, reply) => {
            resolve(JSON.parse(reply));
          });
        }, (err) => {
          resolve(null);
        })
      });
    }

    static setReposTopActors(data) {
      return new Promise((resolve, reject) => {
        // TODO: Handle errors. For now, if cache fails we just continue
        RedisService.connection.then((client) => {
          // cache the JSON value as a String
          client.set(`reposTopActors`, JSON.stringify(data), () => {
            resolve(data);
          });
          // set TTL on the key
          client.expire(`reposTopActors`, 60);
        }, (err) => {
          resolve(null);
        })
      });
    }
  }

  return RedisService;

};
