'use strict';

angular.module('githubEventsExplorer')
  .controller('ActorCtrl', function ($scope, $http, $mdDialog) {
    $scope.loading = false;
    $scope.user = {
      name: ""
    };
    $scope.performSearch = function(ev) {
      $scope.loading = true;
      console.log($scope.user.name);
      $http({
        method: 'GET',
        url: '/api/actor/' + $scope.user.name
      }).then(function successCallback(response) {
        $scope.loading = false;
        console.log(response);
      }, function errorCallback(response) {
        console.log(response);
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
