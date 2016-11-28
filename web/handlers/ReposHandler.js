'use strict';

let handler = function(ReposService) {
  return class ReposHandler {
    static getTopActors(req, res) {
      ReposService.getTopActors().then(function(data) {
        ReposHandler.sendResponse(res, data);
      }, function(err) {
        // TODO: Handle specific errors
        ReposHandler.sendUnknownError(res, err);
      });
    }

    static sendUnknownError(res, err) {
      res.status(500).send(err);
    }

    static sendResponse(res, data) {
      res.send(data);
    }
  };
}

module.exports = handler;
