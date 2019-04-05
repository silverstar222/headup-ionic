var appStorage = {
  set: function(name, data) {
    if(data && data['$$hashKey']) delete data['$$hashKey'];
    window.localStorage.setItem(name, JSON.stringify(data));
  },

  get: function(name) {
    var v = window.localStorage.getItem(name);
    if(v=='undefined') return '';
    return JSON.parse(v);
  },

  destroy: function(name) {
    return window.localStorage.removeItem(name);
  },

  clear: function() {
    return window.localStorage.clear();
  },

  has: function(name) {
    return name in window.localStorage;
  }
};

function deg2rad(deg) {
  rad = deg * Math.PI/180; // radians = degrees * pi/180
  return rad;
}

function round(x) {
  return Math.round( x * 1000) / 1000;
}

var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
function get_distance(latlng1, latlng2) {
  var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km;
  t1=latlng1.lat, n1=latlng1.lng, t2=latlng2.lat, n2=latlng2.lng;
  // convert coordinates to radians
  lat1 = deg2rad(t1);
  lon1 = deg2rad(n1);
  lat2 = deg2rad(t2);
  lon2 = deg2rad(n2);

  // find the differences between the coordinates
  dlat = lat2 - lat1;
  dlon = lon2 - lon1;

  // here's the heavy lifting
  a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
  c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
  dm = c * Rm; // great circle distance in miles
  dk = c * Rk; // great circle distance in km

  // round the results down to the nearest 1/1000
  mi = round(dm);
  km = round(dk);

  // display the result
  return mi;
}

function get_heading_text(heading) {
  if (heading >= 337.5 || heading >= 0 && heading <= 22.5) {
    return "N"
  }
  if (heading >= 22.5 && heading <= 67.5) {
    return "NE"
  }
  if (heading >= 67.5 && heading <= 112.5) {
    return "E"
  }
  if (heading >= 112.5 && heading <= 157.5) {
    return "SE"
  }
  if (heading >= 157.5 && heading <= 202.5) {
    return "S"
  }
  if (heading >= 202.5 && heading <= 247.5) {
    return "SW"
  }
  if (heading >= 247.5 && heading <= 292.5) {
    return "W"
  }
  if (heading >= 292.5 && heading <= 337.5) {
    return "NW"
  }
}

// set_test_pos(43, 125, 5, 123);
function set_test_pos(lat, lng, speed, heading){
  var pos = {coords: {latitude: lat, longitude: lng, speed: speed, heading: heading }};
  appStorage.set('pos', pos);
}

