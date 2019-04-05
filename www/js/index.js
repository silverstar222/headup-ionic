
'use strict';
var MapApp = angular.module('MapApp', ['ionic']);
window.debug = true;

/**
 * Routing table including associated controllers.
 */
MapApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('menu', {url: "", abstract: true, templateUrl: "templates/menu.html"})
    .state('menu.home', {url: '/home', views: {'menuContent': {templateUrl: 'templates/home.html', controller: 'HomeCtrl'} }  })
    .state('menu.map', {url: '/map', views: {'menuContent': {templateUrl: 'templates/map.html', controller: 'MapCtrl'} }  })
    .state('menu.route', {url: '/route', views: {'menuContent': {templateUrl: 'templates/route.html', controller: 'RouteCtrl'} }  })
    .state('menu.result', {url: '/result', views: {'menuContent': {templateUrl: 'templates/result.html', controller: 'ResultCtrl'} }  })
    .state('menu.search', {url: '/search', views: {'menuContent': {templateUrl: 'templates/search.html', controller: 'SearchCtrl'} }  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
}]);

MapApp.run(['$rootScope', function($rootScope){
  var current_location = {latlng: {lat: 43.466654814437405, lng: -80.52430319048342}, speed: 1, heading: 0 };
  appStorage.set('current_location', current_location);
}]);

function onErrorForLocation_High(error){
  console.log(JSON.stringify(arguments));
  navigator.geolocation.getCurrentPosition(
    onSuccessForLocation, 
    onErrorForLocation_Low,
    {maximumAge:600000, timeout:10000, enableHighAccuracy: false}
  );
}

function onErrorForLocation_Low(error){
  console.log(JSON.stringify(arguments));
}

function onSuccessForLocation(pos){
  var speed = Math.abs(pos.coords.speed);
  var heading = pos.coords.heading;
  var current_location = {latlng: {lat: pos.coords.latitude, lng: pos.coords.longitude}, speed: speed, heading: heading };
  appStorage.set('current_location', current_location);
  $('#map_status').html(pos.coords.latitude+","+pos.coords.longitude);
}
if(window.gMapInterval) clearInterval(window.gMapInterval);
window.gMapInterval = setInterval(function(){
  if(window.debug){
    var pos = {coords: {
      latitude: parent.jQuery('#geo-latitude').val(),
      longitude: parent.jQuery('#geo-longitude').val(),
      heading: parent.jQuery('#geo-heading').val(),
      speed: Math.abs(parent.jQuery('#geo-speed').val())
    }};
    var speed = pos.coords.speed;
    var heading = pos.coords.heading;
    var current_location = {latlng: {lat: pos.coords.latitude, lng: pos.coords.longitude}, speed: speed, heading: heading };
    appStorage.set('current_location', current_location);
  }else{
    navigator.geolocation.getCurrentPosition(
      onSuccessForLocation,
      onErrorForLocation_High,
      {maximumAge:600000, timeout:5000, enableHighAccuracy: true}
    );
  }
}, 2000);

navigator.geolocation.watchPosition(
  onSuccessForLocation,
  onErrorForLocation_High,
  {maximumAge:600000, timeout:5000, enableHighAccuracy: true}
);

setInterval(function(){
  $('.blink').toggleClass('blink-red');
},1000);
