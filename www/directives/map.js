/**
 * Created by nahrae on 10/20/14.
 */



/**
 * Handle Maps API
 */
MapApp.directive("appMap", function ($window) {

  return {
    restrict: "E",
    replace: true,
    template: "<div id='map'></div>",
    link: function (scope, element, attrs) {
      var toResize, toCenter;
      var map;
      var currentMarkers;
      var callbackName = 'InitMapCb';
      $window[callbackName] = function() {
        createMap();
        //updateMarkers();
      };
      if ( window.MQ ) {
        createMap();
      }

      function createMap2() {
        var options = {
          elt: document.getElementById('map'),            // ID of map element on page
          zoom: 7,                                        // initial zoom level of the map
          latLng: { lat: window.current_location.latlng.lat, lng: window.current_location.latlng.lng }    // center of map in latitude/longitude
        };
        window.map = new MQA.TileMap(options);
        MQA.withModule('new-route', 'smallzoom', 'mousewheel', function() {
          var locations  = [
            { latLng: { lat: window.current_location.latlng.lat, lng: window.current_location.latlng.lng } },
            { latLng: { lat: window.destination.latlng.lat, lng: window.destination.latlng.lng } }
          ];
          window.route = window.map.addRoute({
            request: {
              locations: locations
            }
          });
          //window.map.addControl(new MQA.SmallZoom());
          //window.map.enableMouseWheelZoom();
          
        });
      }


      function createMap() {
        scope.current_location = appStorage.get('current_location');
        window.map = L.map('map', {
          layers: MQ.mapLayer(),
          center: [ scope.current_location.latlng.lat, scope.current_location.latlng.lng ],
          zoom: 7,
          zoomControl: false
        });

        setTimeout(function(){
          window.marker = L.marker(scope.current_location.latlng.lat, scope.current_location.latlng.lng);
          window.marker.setIcon(L.icon({iconUrl: 'js/images/marker-icon.gif', iconSize:[50,50] }));
          window.marker.addTo(window.map);

        }, 1000);

        scope.maneuvers = [];
        scope.maneuver_index = 0;
        scope.current_distance = 0;
        scope.total_distance = 0;
        scope.total_remaining_distance = 0;  // total_remaining_distance + current_distance = all remaining distance
        scope.passed_indice = [];

        if(appStorage.get('mapmode')=='routing'){

          window.directions = MQ.routing.directions();
          var locations  = [
            { latLng: { lat: scope.current_location.latlng.lat, lng: scope.current_location.latlng.lng } },
            { latLng: { lat: window.destination.latlng.lat, lng: window.destination.latlng.lng } }
          ];
          window.directions.route({
            locations: locations
          });
          _LoaderService.show();
          window.directions.on('success', function(result){
            var current_location = appStorage.get('current_location');
            scope.current_location = current_location;

            if(result.route.legs !== undefined && result.route.legs !== undefined &&
              result.route.legs.length>0 && result.route.legs[0].maneuvers !== undefined ){
              var total_distance=0;
              scope.maneuvers = result.route.legs[0]['maneuvers'];
              scope.maneuvers.map(function(o){total_distance += o.distance; });
              scope.total_distance =  total_distance;
              scope.total_remaining_distance = total_distance;
              scope.maneuver_index = 0;
              scope.left_index = 0;
              scope.arrive_index = 1;

              scope.passed_indice.push(scope.left_index);

              scope.$evalAsync();
              _LoaderService.hide();
            }
          });

          window.directions.on('error', function(){
            console.log("window.directions.on('error')");
            _LoaderService.hide();
          });

          window.map.addLayer(MQ.routing.routeLayer({
            directions: directions,
            fitBounds: true
          }));
        }



        if(window.mapInterval) clearInterval(window.mapInterval);
        window.mapInterval = setInterval(function(){
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
            scope.speed = speed;
            scope.heading = heading;
            scope.checkRouting();
            window.marker.setLatLng([current_location.latlng.lat, current_location.latlng.lng]);
          }else{
            var current_location = appStorage.get('current_location');
            scope.checkRouting();
            window.marker.setLatLng([current_location.latlng.lat, current_location.latlng.lng]);
          }
        }, 2000);

        scope.check_shortest_index = function(current_location){
          var D = 28000;
          if(scope.maneuvers.length == scope.passed_indice.length){
            clearInterval(window.mapInterval);
            return;
          }
          scope.maneuvers.map(function(o, i){
            if(scope.passed_indice.indexOf(i)>-1) return;
            var d = get_distance(current_location.latlng, o.startPoint);
            if(d<D) {
              D = d; scope.arrive_index = i;
            }
          });

        };

        scope.checkRouting = function(){
          var current_location = appStorage.get('current_location');
          var speed = current_location.speed;
          scope.current_location = current_location;
          scope.heading_text = get_heading_text(current_location.heading);
          scope.speed = speed;
          scope.heading = current_location.heading;

          scope.check_shortest_index(current_location);

          if(scope.maneuvers.length>0){
            scope.current_distance = get_distance(current_location.latlng, scope.maneuvers[scope.arrive_index].startPoint);
            var distance = scope.current_distance; scope.maneuvers.map(function(o, i){ if(i>=scope.arrive_index) distance += o.distance; });
            scope.total_remaining_distance = distance;

            if(scope.current_distance < 0.01){
              scope.left_index = scope.arrive_index;
              scope.passed_indice.push(scope.arrive_index);
            }

            if(scope.passed_indice.length==scope.maneuvers.length){
              scope.total_remaining_distance = 0;
              $('.arrived-item').removeClass('hide');
            }
          }
          scope.$evalAsync();
          
        };


      }
    } // end of link:
  }; // end of return
});



