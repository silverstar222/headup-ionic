/**
 * Created by nahrae on 10/20/14.
 */


MapApp.controller('SearchCtrl', 
  function($scope, $rootScope, $location, $http, $q, LoaderService){
  $scope.selected_address = null;
  
  $scope.search_by_google = function(){
    var key = document.getElementById('txtAddress').value;
    if(key=='') return;
    var current_location = appStorage.get('current_location');
    //var current_location = {latlng: {lat: 43.466654814437405, lng: -80.52430319048342}, speed: 1, heading: 0 };
    var searchURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+key+'&location='+current_location.latlng.lat
      +','+current_location.latlng.lng+'&radius=100&key=AIzaSyDBgr9_5XBeXF1MkDzIYTT8T7js30Iicnc&_=1';

    var canceler = $q.defer();
    LoaderService.show();
    $http
      .get(searchURL, {timeout: canceler.promise})
      .success(function(data, status){
        var r = data['results'];
        var addresses=[], i=0;

        for(var k in r){
          addresses.push({
            latlng: r[k].geometry.location,
            formatted_address: r[k].formatted_address
          });
          if(i>4)break;
        }
        $rootScope.addresses = addresses;
        setTimeout(function(){LoaderService.hide();}, 500);
      })
      .error(function(data, status){
        LoaderService.hide();
        alert('Error: '+JSON.stringify(arguments));
      });
  };

  $scope.search_by_mapq = function(){
    var key = document.getElementById('txtAddress').value;
    if(key=='') return;
    var current_location = appStorage.get('current_location');
    var searchURL = 'http://photon.komoot.de/api/?q='+key+'&limit=10&lat='+current_location.latlng.lat+'&lon='+current_location.latlng.lng;
    var canceler = $q.defer();
    LoaderService.show();
    $http
      .get(searchURL, {timeout: canceler.promise})
      .success(function(data, status){
        var r = data.features;
        var addresses=[], latlng, formatted_address;
        var i = 0;
        for(var k in r){
          if(r[k].properties.osm_key!='boundary')
            i++;
          else
            continue;
          latlng= {lat: r[k].geometry.coordinates[1], lng: r[k].geometry.coordinates[0]};
          formatted_address = (function(a){
            var r = [];
            a.map(function(o){ 
              if(o=='' || o == undefined)
                ;
              else if(o.indexOf(';')!=-1)
                r.push(o.split(/\;/)[0]);
              else
                r.push(o);
            }); return r;
          })([r[k].properties.name,r[k].properties.city,r[k].properties.postcode,r[k].properties.country]).join(',');
          addresses.push({
            latlng: latlng,
            formatted_address: formatted_address
          });
          if(i>4)break;
        }

        $rootScope.addresses = addresses;
        setTimeout(function(){LoaderService.hide();}, 500);
      })
      .error(function(data, status){
        LoaderService.hide();
        alert('Error: Could not find. Please try again with another keyword.');
      });
  };

  $scope.suggest = function(e){
    var key = e.target.value;
    var current_location = appStorage.get('current_location');
    //current_location = {"latlng":{"lat":"43.35371215340655","lng":"-80.42387055613533"},"speed":1,"heading":"55"};
    //var searchURL = 'http://photon.komoot.de/api/?q='+key+'&limit=10&lat='+current_location.latlng.lat+'&lon='+current_location.latlng.lng;
    //var searchURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+current_location.latlng.lat
    //    +','+current_location.latlng.lng+'&radius=100&name='+key+'&key=AIzaSyCeQH_w9FaV4gQZar_PFZf6SlOHMlkvcmc';

    var searchURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+key+'&location='+current_location.latlng.lat
      +','+current_location.latlng.lng+'&radius=100&key=AIzaSyCeQH_w9FaV4gQZar_PFZf6SlOHMlkvcmc';

    var canceler = $q.defer();
    $http
      .get(searchURL, {timeout: canceler.promise})
      .success(function(data, status){
        console.log(data['results']);
        var r = data['results'];
        var addresses=[], i=0;

        for(var k in r){
          addresses.push({
            latlng: r[k].geometry.location,
            formatted_address: r[k].formatted_address
          });
          if(i>4)break;
        }
        $rootScope.addresses = addresses;
      })
      .error(function(data, status){
        console.log('Error: '+status.text);
      });
  };


  $scope.suggest1 = function(e){
    var key = e.target.value;
    var current_location = appStorage.get('current_location');
    var searchURL = 'http://photon.komoot.de/api/?q='+key+'&limit=10&lat='+current_location.latlng.lat+'&lon='+current_location.latlng.lng;
    var canceler = $q.defer();
    $http
      .get(searchURL, {timeout: canceler.promise})
      .success(function(data, status){
        var r = data.features;
        var addresses=[], latlng;
        var i = 0;
        for(var k in r){
          if(r[k].properties.osm_key!='boundary')
            i++;
          else
            continue;
          latlng= {lat: r[k].geometry.coordinates[1], lng: r[k].geometry.coordinates[0]};
          addresses.push({
            address_name: '',
            latlng: latlng,
            country: r[k].properties.country,
            name: r[k].properties.name
          });
          if(i>4)break;
        }

        $rootScope.addresses = addresses;
      })
      .error(function(data, status){
        console.log('Error: '+status.text);
      });
  };

  $scope.add_route = function(){
    if($scope.selected_address == null) return;
    appStorage.set('destination', $scope.selected_address);
    $location.path('/route');
  };

  $scope.select_address = function(address){
    $scope.selected_address = address;
  };
});