'use strict';

angular.module('githubEventsExplorer')
  .controller('ActorCtrl', function ($scope, $http, $mdDialog) {
    $scope.loading = false;
    $scope.user = {
      name: ""
    };
    $scope.actors = [];
    $scope.repos = [];

    $scope.performSearch = function(ev) {
      $scope.loading = true;
      $http({
        method: 'GET',
        url: '/api/actor/' + $scope.user.name
      }).then(function successCallback(response) {
        $scope.loading = false;
        $scope.actors = [response.data.actor];
        $scope.repos = response.data.repos;
      }, function errorCallback(response) {
        $scope.loading = false;
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('.popupContainer')))
            .clickOutsideToClose(true)
            .title('Search Error')
            .textContent('Error performing search: ' + response.data)
            .ariaLabel('Search Error')
            .ok('Got it!')
            .targetEvent(ev)
        );
      });
    };
  });
