'use strict';

angular.module('githubEventsExplorer')
  .controller('ActorTopReposCtrl', function ($scope, $http, $mdDialog) {
    $scope.loading = false;
    $scope.user = {
      name: ""
    };
    $scope.repos = [];

    $scope.performSearch = function(ev) {
      $scope.loading = true;
      $http({
        method: 'GET',
        url: '/api/actor/' + $scope.user.name + '/topRepos'
      }).then(function successCallback(response) {
        $scope.loading = false;
        $scope.repos = [response.data];
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
