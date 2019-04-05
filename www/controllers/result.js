/**
 * Created by nahrae on 10/20/14.
 */


MapApp.controller('ResultCtrl', function($scope, $location, $ionicPopover, LoaderService) {
  _LoaderService = LoaderService;
  $ionicPopover.fromTemplateUrl('templates/popover.html?'+Math.random(),{
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.viewmode = 'list';
  $scope.maneuvers = [];
  $scope.destination = appStorage.get('destination');
  $scope.speed = 1;
  $scope.current_distance = 0;
  $scope.next_distance = 0;

  window.current_location = appStorage.get('current_location') || window.current_location;
  window.destination = appStorage.get('destination');

  $scope.openPopover = function($event){
    $scope.popover.show($event);
    $scope.popover.modalEl.style.height = (50*3+20)+'px';
  };

  $scope.closePopover = function($event){
    $scope.popover.hide();
  };

  $scope.goto_map = function(){

  };

  $scope.hms = function(total_seconds){
    total_seconds = parseInt(total_seconds);
    var h=parseInt(total_seconds/3600), m=parseInt((total_seconds%3600)/60), s=total_seconds%60;
    var ret = "";
    if(h>0) ret += h + " hr ";
    if(m>0) ret += m + " min ";
    if(s>0) ret += s + " sec ";
    return ret;
  };


  $scope.viewList = function(){
    $scope.viewmode = 'list';
    $scope.closePopover();
    $scope.$evalAsync();
  };

  $scope.viewMap = function(){
    $scope.viewmode = 'map';
    $scope.closePopover();
    setTimeout(function(){
      window.map.invalidateSize();
    },100);
  };


  $scope.close = function(){
    if(window.mapInterval) clearInterval(window.mapInterval);
    $location.path('/route');
  };

  $scope.goto_homelocation = function(){
    current_location = appStorage.get('current_location');
    if(window.map)
      window.map.setView(current_location.latlng);
  };


  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  $scope.$on('popover.hidden', function() {

  });

  $scope.$on('popover.removed', function() {

  });

});