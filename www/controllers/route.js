/**
 * Created by nahrae on 10/20/14.
 */


MapApp.controller('RouteCtrl', ['$scope', '$rootScope', '$http','$location',
  function($scope, $rootScope, $http, $location){

    window.current_location = appStorage.get('current_location') || window.current_location;
    window.destination = appStorage.get('destination');
    $scope.destination = appStorage.get('destination');

    $scope.get_direction = function(){
      appStorage.set('mapmode','routing');
      $location.path('/result');
    };

  }
]);