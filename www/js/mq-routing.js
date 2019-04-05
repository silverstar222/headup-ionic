MQKEY = Key = 'Fmjtd|luurnuuz2l,2g=o5-9wrsl0';
MQCONFIGNUMBER = 1;
if (window.MQPROTOCOL === undefined) {
  MQPROTOCOL = window.location.protocol === 'https:' ? 'https://' : 'http://';
}
MQPLATFORMSERVER = MQPROTOCOL + "www.mapquestapi.com";
MQSTATICSERVER = "http://www.mapquestapi.com/staticmap/";
MQTRAFFSERVER = TRAFFSERVER = "http://www.mapquestapi.com/traffic/";
MQROUTEURL = "http://www.mapquestapi.com/directions/";
MQGEOCODEURL = "http://www.mapquestapi.com/geocoding/";
MQNOMINATIMURL = MQPROTOCOL + "open.mapquestapi.com/";
MQSEARCHURL = "http://www.mapquestapi.com/search/";
MQLONGURL = MQPLATFORMSERVER;
MQSMSURL = MQPLATFORMSERVER;
MQTOOLKIT_VERSION = "v1.1".replace(/^v/, '');
MQCDN = MQIMAGEPATH = "http://api.mqcdn.com/" + "sdk/leaflet/v1.1/";
MQCDNCOMMON = "http://api.mqcdn.com/";
MQICONSERVER = ICONSERVER = MQPROTOCOL + 'icons.mqcdn.com';
LOGSERVER = MQTILELOGGER = "http://coverage.tt.mqcdn.com";
MQLOGURL = "http://coverage.tt.mqcdn.com/logger/v1";
COVSERVER = MQCOPYRIGHT = "http://coverage.tt.mqcdn.com";
MAPSERVER = "ttiles01.mqcdn.com,ttiles02.mqcdn.com,ttiles03.mqcdn.com,ttiles04.mqcdn.com".split(",");
MAPSERVER_TILEPATH = "/tiles/1.0.0/vx/map";
MQTILEMAP = "http://ttiles0{$hostrange}.mqcdn.com/tiles/1.0.0/vx/map/{$z}/{$x}/{$y}.{$ext}";
MQTILEMAPEXT = "jpg";
MQTILEMAPHI = 4;
MQTILEMAPLO = 1;
SATSERVER = "ttiles01.mqcdn.com,ttiles02.mqcdn.com,ttiles03.mqcdn.com,ttiles04.mqcdn.com".split(",");
SATSERVER_TILEPATH = "/tiles/1.0.0/vx/sat";
MQTILESAT = "http://ttiles0{$hostrange}.mqcdn.com/tiles/1.0.0/vx/sat/{$z}/{$x}/{$y}.{$ext}";
MQTILESATEXT = "jpg";
MQTILESATHI = 4;
MQTILESATLO = 1;
HYBSERVER = "ttiles01.mqcdn.com,ttiles02.mqcdn.com,ttiles03.mqcdn.com,ttiles04.mqcdn.com".split(",");
HYBSERVER_TILEPATH = "/tiles/1.0.0/vx/hyb";
MQTILEHYB = "http://ttiles0{$hostrange}.mqcdn.com/tiles/1.0.0/vx/hyb/{$z}/{$x}/{$y}.{$ext}";
MQTILEHYBEXT = "png";
MQTILEHYBHI = 4;
MQTILEHYBLO = 1;

function $pv() {};

function $a() {};

/**
 * MapQuest tiled map toolkit.
 * Copyright 2014, MapQuest Inc.  All Rights Reserved.
 * Copying, reverse engineering, or modification is strictly prohibited.
 */
MQ.Routing = {};
MQ.Routing.Directions = L.Class.extend({
  includes: L.Mixin.Events,
  options: {
    key: null,
    layer: null
  },
  initialize: function(B) {
    MQ.mapConfig.setAPIKey(this.options);
    L.setOptions(this, B)
  },
  route: function(H) {
    var J = "";
    if (H.locations.length > 50) {
      return this.fire("error", {
        info: {
          statusCode: -999,
          description: "Too many locations, MAX=50"
        }
      })
    }
    H = this._checkShapeFormat(H);
    H.maxRoutes = parseInt(H.maxRoutes, 10) || 1;
    if (H.maxRoutes > 1 && H.locations.length > 2) {
      return this.fire("error", {
        info: {
          statusCode: -999,
          description: "Too many locations (MAX=2) when requesting alternate routes"
        }
      })
    }
    if (!this.noTrim) {
      H.locations = this._trimLocations(H.locations)
    }
    if (H.maxRoutes <= 1) {
      J = "route?key=" + this.options.key
    } else {
      J = "alternateroutes?key=" + this.options.key
    }
    if (H.options.ambiguities) {
      var F = "ignore";
      delete H.options.ambiguities;
      J += "&ambiguities=" + F
    }
    J += "&json=" + MQ.util.stringifyJSON(H);
    var I = this,
      G = this.routeShapeRequestTime = new Date().getTime();
    MQ.mapConfig.ready(function() {
      MQ.util.doJSONP(MQ.mapConfig.getConfig("directionsAPI") + J, {}, function(A) {
        I._onResult(A, G, "route")
      })
    })
  },
  optimizedRoute: function(G) {
    G = this._checkShapeFormat(G);
    if (!this.noTrim) {
      G.locations = this._trimLocations(G.locations)
    }
    var E = "optimizedroute?key=" + this.options.key;
    E += "&json=" + MQ.util.stringifyJSON(G);
    var H = this,
      F = this.routeShapeRequestTime = new Date();
    MQ.mapConfig.ready(function() {
      MQ.util.doJSONP(MQ.mapConfig.getConfig("directionsAPI") + E, {}, function(A) {
        H._onResult(A, F, "optimized")
      })
    })
  },
  routeShape: function(G) {
    var E = "";
    G = this._checkShapeFormat(G);
    E = "routeshape?key=" + this.options.key;
    E += "&json=" + MQ.util.stringifyJSON(G);
    var H = this,
      F = this.routeShapeRequestTime = new Date().getTime();
    MQ.mapConfig.ready(function() {
      MQ.util.doJSONP(MQ.mapConfig.getConfig("directionsAPI") + E, {}, function(A) {
        H._onResult(A, F, "routeShape")
      })
    })
  },
  dragRoute: function(G) {
    G = this._checkShapeFormat(G);
    if (!this.noTrim) {
      G.locations = this._trimLocations(G.locations)
    }
    var E = "dragroute?key=" + this.options.key;
    E += "&json=" + MQ.util.stringifyJSON(G);
    var H = this,
      F = this.routeShapeRequestTime = new Date().getTime();
    MQ.mapConfig.ready(function() {
      MQ.util.doJSONP(MQ.mapConfig.getConfig("directionsAPI") + E, {}, function(A) {
        H._onResult(A, F, "drag")
      })
    })
  },
  routeMatrix: function(G) {
    var E = "routematrix?key=" + this.options.key;
    E += "&json=" + MQ.util.stringifyJSON(G);
    var H = this,
      F = this.routeShapeRequestTime = new Date();
    MQ.mapConfig.ready(function() {
      MQ.util.doJSONP(MQ.mapConfig.getConfig("directionsAPI") + E, {}, function(A) {
        H._onResult(A, F, "matrix")
      })
    })
  },
  _checkShapeFormat: function(B) {
    if (B.options && B.options.shapeFormat && B.options.shapeFormat != "") {
      this.shapeFormat = B.options.shapeFormat;
      return B
    }
    if (!B.options) {
      B.options = {}
    }
    if (!B.options.shapeFormat) {
      B.options.shapeFormat = "cmp6"
    }
    return B
  },
  _onResult: function(Q, O, M) {
    var N = null,
      J = Q.route.alternateRoutes,
      I, K = [],
      P;
    if (!Q || !Q.route || (Q.info && Q.info.messages && Q.info.messages.length > 0)) {
      if (Q && Q.info) {
        N = {
          code: Q.info.statuscode,
          response: Q
        };
        if (Q.info.messages && Q.info.messages.length > 0) {
          N.message = Q.info.messages[0]
        }
      }
      this.fire("error", N)
    } else {
      if (O === this.routeShapeRequestTime) {
        I = this.decompress(Q);
        this.fire("success", I);
        if (M) {
          this.fire("success:" + M, I)
        }
      }
      if (J) {
        for (P = 0; P < J.length; P++) {
          I = this.decompress(J[P]);
          K.push(I);
          this.fire("altsuccess", I);
          if (M) {
            this.fire("altsuccess:" + M, I)
          }
        }
        this.fire("success:altroutes", K)
      }
    }
  },
  _trimLocations: function(F) {
    if (!F || F.length < 1) {
      return []
    }
    var G, I = 0,
      H = [];
    for (; I < F.length; I++) {
      G = F[I];
      if (G && G.linkId) {
        var J = {
          linkId: G.linkId,
          latLng: {
            lat: G.latLng.lat,
            lng: G.latLng.lng
          },
          type: G.type
        };
        H.push(J)
      } else {
        H.push(G)
      }
    }
    return H
  },
  decompress: function(N) {
    if (N && N.route && N.route.shape && N.route.shape.shapePoints && N.route.options && (N.route.options.shapeFormat == "cmp" || N.route.options.shapeFormat == "cmp6")) {
      var O = N.route.shape.shapePoints;
      var W = O.length,
        M = 0,
        T = 0,
        S = 0,
        V = [];
      try {
        while (M < W) {
          var R, P = 0,
            Q = 0;
          do {
            R = O.charCodeAt(M++) - 63;
            Q |= (R & 31) << P;
            P += 5
          } while (R >= 32);
          T += ((Q & 1) ? ~(Q >> 1) : (Q >> 1));
          P = 0;
          Q = 0;
          do {
            R = O.charCodeAt(M++) - 63;
            Q |= (R & 31) << P;
            P += 5
          } while (R >= 32);
          S += ((Q & 1) ? ~(Q >> 1) : (Q >> 1));
          if (N.route.options.shapeFormat == "cmp") {
            V.push(new L.LatLng(T * 0.00001, S * 0.00001))
          } else {
            V.push(new L.LatLng(T * 0.000001, S * 0.000001))
          }
        }
      } catch (U) {}
      N.route.shape.shapePoints = V
    }
    return N
  }
});
MQ.routing = {};
MQ.routing.directions = function(B) {
  if (B == null) {
    B = {}
  }
  if (!B.key && MQKEY) {
    B.key = MQKEY
  }
  return new MQ.Routing.Directions(B)
};
MQ.util.loadCSS(".mq-ribbon-popup .leaflet-popup-tip-container{display: none;} .mq-ribbon-popup .leaflet-popup-content-wrapper{border-radius:6px;} .mq-ribbon-popup .leaflet-popup-content-wrapper .leaflet-popup-content{margin:3px 6px;font-size:11px;}");
MQ.Routing.Ribbon = L.LayerGroup.extend({
  includes: L.Mixin.Events,
  _state: "none",
  options: {
    draggable: true,
    dragMarker: {
      weight: 1,
      color: "#000000",
      fill: true,
      fillColor: "#ffffff",
      opacity: 0.9,
      fillOpacity: 0.9
    }
  },
  initialize: function(C) {
    L.setOptions(this, C);
    L.LayerGroup.prototype.initialize.call(this, C);
    this._polyline = new L.Polyline([], {
      smoothFactor: 0,
      noClip: true,
      clickable: C.clickable || C.draggable
    });
    this.addLayer(this._polyline);
    var D = {
      closeButton: false,
      zoomAnimation: false,
      autoPan: false,
      className: "mq-ribbon-popup",
      offset: new L.Point(0, -20, false)
    };
    this._dragPopup = L.popup(D);
    this._dragMarker = new L.CircleMarker(new L.LatLng(0, 0), this.options.dragMarker);
    this._dragMarker.bindPopup(this._dragPopup);
    this._infoPopup = L.popup(D);
    this._polyline.bindPopup(this._infoPopup)
  },
  onAdd: function(B) {
    L.LayerGroup.prototype.onAdd.call(this, B);
    this._polyline.on("mouseover", this._onPathMouseOver, this);
    this._polyline.on("mousemove", this._onPathMouseMove, this);
    this._polyline.on("mouseout", this._onPathMouseOut, this);
    if (this.options.draggable) {
      if (L.Browser.touch) {
        L.DomEvent.on(this._polyline._container, "touchstart", this._onDragStart, this);
        L.DomEvent.on(this._polyline._container, "touchmove", this._onTouchMove, this);
        L.DomEvent.on(this._polyline._container, "touchend", this._onDragEnd, this);
        L.DomEvent.on(this._polyline._container, "touchcancel", this._onDragEnd, this)
      }
      this._dragMarker.on("mouseover", this._onMarkerMouseOver, this);
      this._dragMarker.on("mouseout", this._onMarkerMouseOut, this);
      this._dragMarker.on("mousedown", this._onDragStart, this)
    }
  },
  onRemove: function(B) {
    L.LayerGroup.prototype.onRemove.call(this, B);
    this._polyline.off("mouseover", this._onPathMouseOver, this);
    this._polyline.off("mousemove", this._onPathMouseMove, this);
    this._polyline.off("mouseout", this._onPathMouseOut, this)
  },
  setLatLngs: function(B) {
    this._polyline.setLatLngs(B)
  },
  setPathStyle: function(B) {
    this._polyline.setStyle(B);
    this._dragMarker.setRadius(B.weight / 2)
  },
  setVisible: function(B) {
    if (B) {
      this.addLayer(this._polyline)
    } else {
      this.removeLayer(this._polyline)
    }
  },
  bringToFront: function() {
    this._polyline.bringToFront()
  },
  bringToBack: function() {
    this._polyline.bringToBack()
  },
  _clearCancelInterval: function() {
    if (this._cancelInterval) {
      window.clearInterval(this._cancelInterval);
      this._cancelInterval = null
    }
  },
  hideDragMarker: function() {
    this._clearCancelInterval();
    if (this._state == "drag") {
      if (this._map) {
        this._map.off("mousemove", this._onDrag, this);
        this._map.off("mouseup", this._onDragEnd, this)
      }
    }
    this._state = "none";
    if (this._map && this.hasLayer(this._dragMarker)) {
      this.removeLayer(this._dragMarker)
    }
  },
  closestLayerPoint: function(Q) {
    var U = Infinity,
      P = this._polyline._parts,
      S, T, W = null;
    for (var O = 0, R = P.length; O < R; O++) {
      var V = P[O];
      for (var N = 1, X = V.length; N < X; N++) {
        S = V[N - 1];
        T = V[N];
        var Y = L.LineUtil._sqClosestPointOnSegment(Q, S, T, true);
        if (Y < U) {
          U = Y;
          W = L.LineUtil._sqClosestPointOnSegment(Q, S, T);
          W.partIndex = N - 1
        }
      }
    }
    if (W) {
      W.distance = Math.sqrt(U)
    }
    return W
  },
  setHoverDisplay: function(B) {
    B = B || {};
    this.hoverDisplay = L.extend({}, B)
  },
  setHoverMessage: function(B) {
    this._dragPopup.setContent(B);
    this._infoPopup.setContent(B)
  },
  copyOrigRoute: function() {
    this.addLayer(L.polyline(this._polyline._latlngs, {
      color: "#4D4DF3"
    }))
  },
  getBounds: function() {
    if (this._polyline) {
      return this._polyline.getBounds()
    }
    return null
  },
  _onPathMouseOver: function(B) {
    if (this.options.draggable) {
      this._clearCancelInterval();
      if (this._state == "none") {
        this._state = "hover";
        this.addLayer(this._dragMarker);
        this._dragMarker.openPopup();
        this._onPathMouseMove(B)
      }
    } else {
      this.origOptions = L.extend({}, this._polyline.options);
      this._polyline.setStyle(this.hoverDisplay);
      this.bringToFront();
      this._polyline.openPopup()
    }
  },
  _onPathMouseOut: function(B) {
    if (this.options.draggable) {
      if (this._state == "hover") {
        this._clearCancelInterval();
        this._cancelInterval = window.setInterval(L.Util.bind(this.hideDragMarker, this), 333)
      }
    } else {
      this.bringToBack();
      this._polyline.setStyle(this.origOptions);
      this._polyline.closePopup()
    }
  },
  _onPathMouseMove: function(D) {
    var F = this.closestLayerPoint(D.layerPoint);
    var E = this._map.layerPointToLatLng(F);
    this._dragShapePointIndex = F.partIndex;
    this._dragMarker.setLatLng(E);
    this._dragPopup.setLatLng(E);
    this._infoPopup.setLatLng(E)
  },
  _onMarkerMouseOver: function(B) {
    this._clearCancelInterval()
  },
  _onMarkerMouseOut: function(B) {
    if (this._state == "hover") {
      this._cancelInterval = window.setInterval(L.Util.bind(this.hideDragMarker, this), 333)
    }
  },
  _onDragStart: function(C) {
    if (this._state != "drag") {
      this._state = "drag";
      L.DomEvent.stop(C);
      this.copyOrigRoute();
      if (L.Browser.touch) {
        var D = this.closestLayerPoint(this._map.mouseEventToLayerPoint(C));
        C.dragShapePointIndex = D.partIndex
      } else {
        C.dragShapePointIndex = this._dragShapePointIndex;
        this._map.on("mousemove", this._onDrag, this);
        this._map.on("mouseup", this._onDragEnd, this)
      }
      this.fire("dragstart", C)
    }
  },
  _onTouchMove: function(B) {
    if (B.touches && B.touches.length > 1) {
      return
    }
    L.DomEvent.preventDefault(B);
    B.latlng = this._map.mouseEventToLatLng(B);
    this._onDrag(B)
  },
  _onDrag: function(B) {
    if (this._state == "drag") {
      this._dragMarker.setLatLng(B.latlng);
      this._dragPopup.setLatLng(B.latlng);
      this.fire("drag", B)
    }
  },
  _onDragEnd: function(B) {
    if (this._state == "drag") {
      this.hideDragMarker();
      this.fire("dragend", B)
    }
  }
});
MQ.Routing.RouteLayer = L.LayerGroup.extend({
  includes: L.Mixin.Events,
  ribbonOverscanFactor: 5,
  dragIntervalMs: 333,
  _map: null,
  _altRibbons: [],
  altRouteData: [],
  customizeRibbon: function(D) {
    var C = {
      color: "#0000ee",
      opacity: 0.6,
      weight: 5
    };
    if (this.options.ribbonOptions && this.options.ribbonOptions.ribbonDisplay) {
      C = L.Util.extend(C, this.options.ribbonOptions.ribbonDisplay)
    }
    D.setPathStyle(C)
  },
  customizeRibbonAtZoom: function(E, F) {
    var D = this.options.ribbonOptions.widths[F - 2];
    if (D && D != E._polyline.options.weight) {
      E.setPathStyle({
        weight: D
      })
    }
  },
  createStopMarker: function(D, E) {
    var F = L.icon({
      iconUrl: MQ.mapConfig.getConfig("iconPath") + "/icons/stop.png?text=" + String.fromCharCode(E - 1 + 65),
      iconSize: [22, 28],
      iconAnchor: [11, 28],
      popupAnchor: [0, -28]
    });
    return L.marker(D.latLng, {
      icon: F,
      draggable: this.options.draggable
    }).addTo(this._map)
  },
  removeLocationAt: function(D) {
    var C = this.routeData.locations;
    if (D < 0) {
      return
    }
    if (D >= C.length) {
      return
    }
    if (C.length == 2) {
      return
    }
    C.splice(D, 1);
    this.recomputeChangedRoute(C)
  },
  createViaMarker: function(K, H) {
    var J = this,
      I = L.icon({
        iconUrl: MQ.mapConfig.getConfig("iconPath") + "/icons/via.png",
        iconSize: [11, 11],
        iconAnchor: [5, 5],
        popupAnchor: [0, -5]
      }),
      M = L.marker(K.latLng, {
        icon: I,
        draggable: this.options.draggable
      }),
      G = L.popup({
        minWidth: 0,
        closeButton: false,
        zoomAnimation: false,
        autoPan: false,
        className: "mq-ribbon-popup",
        offset: new L.Point(0, -5, false)
      }).setLatLng(K.latLng).openOn(J._map);
    M.viarollover = {
      a: document.createElement("a"),
      clickEvent: function() {
        J.removeLocationAt(this.id);
        G._close()
      }
    };
    M.viarollover.a.appendChild(document.createTextNode("delete"));
    M.viarollover.a.id = H;
    M.viarollover.a.href = "javascript:void(0)";
    G.setContent(M.viarollover.a);
    M.viarollover.a.addEventListener("click", M.viarollover.clickEvent);
    M.on("mouseover", function(A) {
      G.openOn(J._map)
    });
    return M.addTo(this._map)
  },
  customizeMarker: function(B) {},
  virtualMapState: function(B) {
    return {
      center: B.getCenter(),
      width: Math.round(this.ribbonOverscanFactor * B.getSize().x),
      height: Math.round(this.ribbonOverscanFactor * B.getSize().y),
      scale: MQ.mapConfig.getScale(B.getZoom())
    }
  },
  recomputeChangedRoute: function(E) {
    var D = {};
    this._clearDragInterval();
    if (this.routeData) {
      D = this.routeData.options;
      this.routeData = null
    }
    var F = {
      mapState: this.virtualMapState(this._map),
      locations: E,
      options: D
    };
    this.directions.route(F)
  },
  options: {
    key: null,
    draggable: true,
    fitBounds: false,
    routeOptions: {},
    ribbonOptions: {
      draggable: true,
      widths: [10, 10, 10, 10, 9, 8, 7, 7, 7, 6, 6, 6, 6, 7, 8, 9, 10]
    },
    altRibbonOptions: {
      show: true,
      ribbonDisplay: {
        color: "#F78181",
        opacity: 0.7
      },
      hoverDisplay: {
        color: "red",
        opacity: 0.6
      },
      draggable: false,
      clickable: true
    }
  },
  initialize: function(D) {
    var C = this;
    D = D || {};
    MQ.mapConfig.setAPIKey(this.options);
    D.ribbonOptions = L.extend({}, this.options.ribbonOptions, D.ribbonOptions);
    D.altRibbonOptions = L.extend({}, this.options.altRibbonOptions, D.altRibbonOptions);
    D.altRibbonOptions.draggable = false;
    L.setOptions(this, D);
    L.LayerGroup.prototype.initialize.call(this, D);
    this.directions = this.options.directions || new L.Routing.Directions();
    this.directions.on("success", this._onDirectionsSuccess, this);
    this.directions.on("success:altroutes", this._onAllAlternatesSuccess, this);
    this.directions.on("altsuccess", this._onAlternateSuccess, this);
    this.directions.on("error", this._onDirectionsError, this)
  },
  onAdd: function(B) {
    L.LayerGroup.prototype.onAdd.call(this, B);
    B.on("move", this._validateMap, this);
    B.on("moveend", this._validateMap, this);
    B.on("zoomend", this._validateMap, this);
    this.state = "none"
  },
  onRemove: function(B) {
    this._stopDragTimer();
    B.off("move", this._validateMap, this);
    B.off("moveend", this._validateMap, this);
    B.off("zoomend", this._validateMap, this);
    L.LayerGroup.prototype.onRemove.call(this, B)
  },
  _onDirectionsSuccess: function(D) {
    if (!this.routeData) {
      this.setRouteData(D.route);
      if (this.options.fitBounds && !this._fitBoundsFirstTime) {
        this._fitBoundsFirstTime = false;
        this.fitBounds(this.options.fitBounds)
      }
    } else {
      if (D && D.route && D.route.shape) {
        this._routeShapeCallback(D)
      }
    }
    if (this._lastDragRequest) {
      this._lastDragRequest = null;
      if (D && D.route && D.route.shape && D.route.shape.shapePoints) {
        this._lastDragLocations = D.route.locations;
        for (var E = 0; E < D.route.locations.length; E++) {
          var F = D.route.locations[E];
          if (F.dragPoint) {
            this._setHoverMessage(D.route, F)
          }
        }
      }
    }
    if (this._nextDragRequest) {
      this._dispatchDragRequest()
    }
  },
  _onAllAlternatesSuccess: function(B) {
    if (this.options.fitBounds && !this._fitBoundsFirstTime) {
      this._fitBoundsFirstTime = false;
      this.fitBounds(this.options.fitBounds)
    }
  },
  _onAlternateSuccess: function(B) {
    if (B && B.route && B.route.shape) {
      this._altRouteShapeCallback(B)
    }
  },
  _onDirectionsError: function(B) {},
  _setHoverMessage: function(R, Q, M) {
    M = M || this.ribbon;
    Q = Q || {
      street: ""
    };
    var K = R.time;
    var N = "";
    var O = R.distance.toFixed(2);
    var T = (R.options.unit.toUpperCase() == "M") ? "mi" : "km";
    var P = Math.floor(K / 86400).toFixed();
    var S = Math.floor((K / 3600) % 24).toFixed();
    var U = Math.floor((K / 60) % 60).toFixed();
    if (P != 0) {
      N += P + "d "
    }
    if (S != 0) {
      N += S + "h "
    }
    if (U != 0) {
      N += U + "m"
    }
    M.setHoverMessage(Q.street + " (" + O + T + ", " + N + ")")
  },
  setRouteData: function(C) {
    this._clear();
    this.routeData = C;
    try {
      if (C) {
        this._construct(C, C.mapState, C.shape)
      }
    } catch (D) {
      this._clear();
      throw D
    }
  },
  addAltRouteData: function(E, F) {
    var D = L.extend({
      _ribbon: F,
      setVisible: function(A) {
        this._ribbon.setVisible(A)
      }
    }, E);
    this.altRouteData.push(D)
  },
  getBounds: function() {
    var B = null;
    if (this.routeData && this.routeData.boundingBox && this.routeData.boundingBox.ul) {
      B = new L.LatLngBounds(new L.LatLng(this.routeData.boundingBox.lr.lat, this.routeData.boundingBox.ul.lng), new L.LatLng(this.routeData.boundingBox.ul.lat, this.routeData.boundingBox.lr.lng));
      if (this.altRouteData.length) {
        this.altRouteData.forEach(function(A) {
          if (A.boundingBox && A.boundingBox.ul) {
            B.extend([A.boundingBox.lr.lat, A.boundingBox.lr.lng]);
            B.extend([A.boundingBox.ul.lat, A.boundingBox.ul.lng])
          }
        })
      }
    }
    return B
  },
  fitBounds: function(D) {
    if (this._map && this.routeData) {
      var C = this.getBounds();
      if (C) {
        this._map.fitBounds(C, D)
      }
    }
  },
  _validateMap: function() {
    if (this._ribbonInfo) {
      var D = this._map.getPixelBounds();
      if (this._map.getZoom() != this._ribbonInfo.zoom || !this._ribbonInfo.bounds.contains(D)) {
        if (this.ribbon && this.ribbon.dragPoi) {
          this.ribbon.hideDragPoi()
        }
        this._schedRibbonUpdate()
      }
    }
    this._validateRibbonAttrs(this.ribbon);
    for (var C = 0; C < this._altRibbons.length; C++) {
      this._validateRibbonAttrs(this._altRibbons[C])
    }
  },
  _validateRibbonAttrs: function(D) {
    if (!D) {
      return
    }
    var C = this._map.getZoom();
    if (D._attrZoom != C) {
      this.customizeRibbonAtZoom(D, C);
      D._attrZoom = C
    }
  },
  _clear: function() {
    this.state = "none";
    this.clearLayers();
    if (this._ribbonInfo && this._ribbonInfo.completion) {
      this._ribbonInfo.completion()
    }
    this.ribbon = null
  },
  _construct: function(F, E, D) {
    this.routeData = F;
    this.ribbon = new MQ.Routing.Ribbon(this.options.ribbonOptions);
    if (this.ribbon.options.draggable) {
      this.ribbon.setHoverMessage("Click To Drag");
      this.ribbon.on("dragstart", this._onRibbonDragStart, this);
      this.ribbon.on("drag", this._onRibbonDrag, this);
      this.ribbon.on("dragend", this._onRibbonDragEnd, this)
    }
    this.addLayer(this.ribbon);
    this.customizeRibbon(this.ribbon);
    this._validateRibbonAttrs(this.ribbon);
    this.state = "show";
    if (E && D) {
      this._ribbonInfo = {
        loaded: true,
        shapeResponse: D
      };
      this._updateRibbonInfo();
      this.ribbon.setLatLngs(D.shapePoints);
      this.ribbon.shapeResponse = D;
      this.fire("routeRibbonUpdated", this.ribbon);
      this._validateMap()
    } else {
      this._schedRibbonUpdate()
    }
    if (F.locations) {
      this._constructLocations(F.locations)
    }
  },
  _constructLocations: function(F) {
    var I, J = 0,
      G, H;
    for (I = 0; I < F.length; I++) {
      G = F[I];
      switch ((G.type || "").toUpperCase()) {
        case "S":
          H = this.createStopMarker(G, ++J);
          H.stopNumber = J;
          break;
        case "V":
          H = this.createViaMarker(G, I);
          break;
        default:
      }
      if (!H) {
        continue
      }
      if (G.address && G.address.latLng) {
        G.latLng = G.address.latLng
      }
      H.location = G;
      H.locationIndex = I;
      if (this.options.draggable) {
        H.on("drag", this._onMarkerDrag, this);
        H.on("dragend", this._onMarkerDragEnd, this)
      }
      this.customizeMarker(H);
      this.addLayer(H)
    }
  },
  _routeShapeCallback: function(E) {
    if (!E || !E.route || !E.route.shape) {
      this._ribbonInfo = null;
      return
    }
    var D = E.route.shape,
      F = this._ribbonInfo;
    F.loaded = true;
    F.completion = null;
    F.shapeResponse = D;
    if (L.Util.isArray(D.shapePoints)) {
      this.ribbon.setLatLngs(D.shapePoints)
    }
    this.fire("routeRibbonUpdated", this.ribbon);
    this.ribbon.shapeResponse = D
  },
  _altRouteShapeCallback: function(E) {
    if (!E || !E.route || !E.route.shape) {
      this._ribbonInfo = null;
      return
    }
    var D = E.route.shape,
      F;
    if (L.Util.isArray(D.shapePoints)) {
      F = this._addAltRibbon(D.shapePoints);
      this._setHoverMessage(E.route, null, F)
    }
    this.addAltRouteData(E.route, F)
  },
  _addAltRibbon: function(D) {
    var C = new MQ.Routing.Ribbon(this.options.altRibbonOptions);
    C.setHoverDisplay(this.options.altRibbonOptions.hoverDisplay);
    C.setLatLngs(D);
    C.setPathStyle(this.options.altRibbonOptions.ribbonDisplay);
    C.setVisible(this.options.altRibbonOptions.show);
    this._validateRibbonAttrs(C);
    this._altRibbons.push(C);
    this.addLayer(C);
    this.ribbon.bringToFront();
    this.fire("altRibbonUpdated", C);
    return C
  },
  _removeAltRibbons: function() {
    var B;
    while (this._altRibbons.length) {
      B = this._altRibbons.pop();
      this.removeLayer(B)
    }
  },
  _schedRibbonUpdate: function() {
    if (this.state != "show") {
      return
    }
    var B = this.virtualMapState(this._map);
    this._ribbonInfo = {
      loaded: false
    };
    this._updateRibbonInfo();
    this._ribbonInfo.completion = this.directions.routeShape({
      sessionId: this.routeData.sessionId,
      mapState: B
    });
    return this._ribbonInfo
  },
  _updateRibbonInfo: function() {
    var J = this._map.getPixelBounds();
    var I = J.getSize().x / 2;
    var M = J.getSize().y / 2;
    var G = J.min;
    G.x += I;
    G.y += M;
    var K = I * this.ribbonOverscanFactor;
    var H = M * this.ribbonOverscanFactor;
    this._ribbonInfo.bounds = new L.Bounds(new L.Point(G.x - K, G.y - H, false), new L.Point(G.x + K, G.y + H, false));
    this._ribbonInfo.zoom = this._map.getZoom()
  },
  _onRibbonDragStart: function(D) {
    for (var C = 0; C < this.ribbon.shapeResponse.legIndexes.length; C++) {
      if (D.dragShapePointIndex <= this.ribbon.shapeResponse.legIndexes[C]) {
        break
      }
    }
    this._dragLocationIndex = C
  },
  _onRibbonDrag: function(G) {
    if (this.state != "show") {
      return
    }
    var E = this.routeData.locations.slice(),
      F;
    for (var H = 0; H < E.length; H++) {
      E[H].dragPoint = false
    }
    E.splice(this._dragLocationIndex, 0, {
      latLng: G.latlng,
      gefId: 0,
      dragPoint: true,
      type: "v"
    });
    F = {
      options: this.routeData.options,
      locations: E,
      mapState: {
        center: this._map.getCenter(),
        width: Math.round(this._map.getSize().x * 1.25),
        height: Math.round(this._map.getSize().y * 1.25),
        scale: MQ.mapConfig.getScale(this._map.getZoom())
      }
    };
    this._queueDragRequest(F)
  },
  _onRibbonDragEnd: function() {
    this.clearDragState();
    if (this._lastDragLocations) {
      this.recomputeChangedRoute(this._lastDragLocations)
    }
  },
  _onMarkerDrag: function(G) {
    var H, F;
    this._removeAltRibbons();
    if (!this._markerDragging) {
      this.ribbon.copyOrigRoute();
      this._markerDragging = true
    }
    if (this.state != "show") {
      return
    }
    var E = this.routeData.locations.slice();
    for (H = 0; H < this.routeData.locations.length; H++) {
      E[H].dragPoint = false
    }
    E[G.target.locationIndex] = {
      dragPoint: true,
      latLng: G.target.getLatLng(),
      gefId: 0,
      type: E[G.target.locationIndex].type
    };
    F = {
      options: this.routeData.options,
      locations: E,
      mapState: {
        center: this._map.getCenter(),
        width: Math.round(this._map.getSize().x * 1.25),
        height: Math.round(this._map.getSize().y * 1.25),
        scale: MQ.mapConfig.getScale(this._map.getZoom())
      }
    };
    this._queueDragRequest(F)
  },
  _onMarkerDragEnd: function() {
    this.clearDragState();
    this._markerDragging = false;
    if (this._lastDragLocations) {
      this.recomputeChangedRoute(this._lastDragLocations)
    }
  },
  clearDragState: function() {
    this._stopDragTimer();
    this.state = "show"
  },
  _stopDragTimer: function() {
    this._clearDragInterval();
    this._lastDragRequest = null;
    this._nextDragRequest = null
  },
  _clearDragInterval: function() {
    if (this._dragIntervalId) {
      window.clearInterval(this._dragIntervalId);
      this._dragIntervalId = null
    }
  },
  _queueDragRequest: function(B) {
    this._clearDragInterval();
    this._nextDragRequest = B;
    this._dragIntervalId = window.setInterval(L.Util.bind(this._dispatchDragRequest, this), this.options.dragIntervalMs)
  },
  _dispatchDragRequest: function() {
    if (!this._lastDragRequest && this._nextDragRequest) {
      this._clearDragInterval();
      this._lastDragRequest = this._nextDragRequest;
      this.directions.dragRoute(this._nextDragRequest);
      this._nextDragRequest = null
    }
  }
});
MQ.routing.routeLayer = function(B) {
  if (B == null) {
    B = {}
  }
  if (!B.key && MQKEY) {
    B.key = MQKEY
  }
  return new MQ.Routing.RouteLayer(B)
};