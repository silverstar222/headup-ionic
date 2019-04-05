angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    var current_location = appStorage.get('current_location');
    $scope.map.setCenter(new google.maps.LatLng(
      current_location.latlng.lat,
      current_location.latlng.lng
      ));
    $scope.loading.hide();
  };
});
