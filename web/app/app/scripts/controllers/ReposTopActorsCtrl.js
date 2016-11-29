'use strict';

angular.module('githubEventsExplorer')
  .controller('ReposTopActorsCtrl', function ($scope, $http, $mdDialog) {
    $scope.loading = false;
    $scope.repos = [];
    $scope.quantity = 20;

    $scope.performSearch = function(ev) {
      $scope.loading = true;
      $http({
        method: 'GET',
        url: '/api/repos/topActors'
      }).then(function successCallback(response) {
        $scope.loading = false;
        $scope.repos = response.data;
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

    $scope.loadMore = function() {
      $scope.quantity += 20;
    }
  });
