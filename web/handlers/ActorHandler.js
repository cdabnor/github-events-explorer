'use strict';

let handler = function(ActorService) {

  return class ActorHandler {

     static getActor(req, res) {
      let login = req.params.login;
      if(login && login.length > 0) {
        ActorService.getActor(login).then(function(data) {
          ActorHandler.sendResponse(res, data);
        }, function(err) {
          // TODO: Handle specific errors
          ActorHandler.sendUnknownError(res, err);
        });
      } else {
        ActorHandler.sendUnknownLogin(res, login);
      }
    }

    static getActorTopRepos(req, res) {

    }

    static sendUnknownError(res, err) {
      res.status(500).send(err);
    }

    static sendResponse(res, data) {
      res.send(data);
    }

    static sendUnknownLogin(res, login) {
      res.status(404).send(```Invalid login "${login}" specified```);
    }
  };
}

module.exports = handler;
