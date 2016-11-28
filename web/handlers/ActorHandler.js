'use strict';

let handler = function(ActorService) {

  return class ActorHandler {

     static getActor(req, res) {
      let login = req.params.login;
      if(login && login.length > 0) {
        ActorService.getActor(login).then(function(data) {
          if(data.actor) {
            ActorHandler.sendResponse(res, data);
          } else {
            ActorHandler.sendNotFoundResponse(res, login);
          }
        }, function(err) {
          // TODO: Handle specific errors
          ActorHandler.sendUnknownError(res, err);
        });
      } else {
        ActorHandler.sendUnknownLogin(res, login);
      }
    }

    static getActorTopRepos(req, res) {
      let login = req.params.login;
      if(login && login.length > 0) {
        ActorService.getActorTopRepos(login).then(function(data) {
          if(data) {
            ActorHandler.sendResponse(res, data);
          } else {
            ActorHandler.sendNotFoundResponse(res, login);
          }
        }, function(err) {
          // TODO: Handle specific errors
          ActorHandler.sendUnknownError(res, err);
        });
      } else {
        ActorHandler.sendUnknownLogin(res, login);
      }
    }

    static sendUnknownError(res, err) {
      res.status(500).send(err);
    }

    static sendResponse(res, data) {
      res.send(data);
    }

    static sendNotFoundResponse(res, login) {
      res.status(404).send(`Login ${login} not found`);
    }

    static sendUnknownLogin(res, login) {
      res.status(400).send(```Invalid login "${login}" specified```);
    }
  };
}

module.exports = handler;
