/**
 * Created by nahrae on 10/20/14.
 */


/**
 * A google map / GPS controller.
 */
MapApp.controller('MapCtrl', ['$scope','$ionicPlatform',
  function($scope, $ionicPlatform) {
    appStorage.set('mapmode', '');
    window.current_location = appStorage.get('current_location') || window.current_location;
    window.destination = appStorage.get('destination');
    $scope.destination = window.destination;
    $scope.whoiswhere = [];

    $scope.gotoLocation = function(lat, lng){

    };

    $scope.gotoCurrentLocation = function(){

    }


  }]);
