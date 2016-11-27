'use strict';

var actorService = require('./ActorService');
var MongoClientMock = require('../test/mocks/MongoClient.js');

describe('ActorService', function() {
  var subject;

  describe('getActor', function() {
    before(function() {
      sinon.sandbox.create();

      subject = actorService(MongoClientMock);
    });

    after(function() {
      sinon.sandbox.restore();
    });

    it('should ...', function() {

    });
  });

});
