'use strict';

/**
 * @ngdoc overview
 * @name app2App
 * @description
 * # app2App
 *
 * Main module of the application.
 */
angular
  .module('githubEventsExplorer', [
    'ngRoute',
    'ngMaterial',
    'md.data.table'
  ]).config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/actor.html',
        controller: 'ActorCtrl',
        controllerAs: 'actor'
      })
      .when('/actorTopRepos', {
        templateUrl: 'views/actorTopRepos.html',
        controller: 'ActorTopReposCtrl',
        controllerAs: 'actorTopRepos'
      })
      .when('/reposTopActors', {
        templateUrl: 'views/reposTopActors.html',
        controller: 'ReposTopActorsCtrl',
        controllerAs: 'reposTopActors'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).controller('AppCtrl', function($scope, $location) {
    $scope.currentNavItem = 'page1';
    $scope.$watch('currentNavItem', function(current) {
      switch (current) {
        case 'page1':
            $location.url("/");
            break;
        case 'page2':
            $location.url("/actorTopRepos");
            break;
        case 'page3':
            $location.url("/reposTopActors");
            break;
      }
    });
  });
