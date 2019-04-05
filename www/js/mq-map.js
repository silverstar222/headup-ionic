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
var MQ = {};
MQ.Control = {};
MQ.control = {};
MQ.Util = {};
MQ.TileLayer = L.TileLayer.extend({
  _config: {},
  options: {
    key: null,
    mapType: "map",
    ext: "png",
    attribution: "&copy;&nbsp;Mapquest"
  },
  initialize: function(C) {
    L.setOptions(this, C);
    MQ.mapConfig.setAPIKey(this.options);
    var D = this;
    MQ.mapConfig.ready(function() {
      var A = D.options.mapType;
      D.options.mapType = null;
      D.setMapType(A)
    })
  },
  setMapType: function(D) {
    if (D != this.options.mapType) {
      this.options.mapType = D;
      var C = MQ.mapConfig.getConfig(D);
      if (C) {
        this._url = C.url;
        L.setOptions(this, C);
        this.redraw()
      }
      this.fire("maptypechange", {
        layer: this
      })
    }
  },
  setUrl: function(C, D) {},
  onAdd: function(B) {
    L.TileLayer.prototype.onAdd.call(this, B);
    if (!B.mapquest) {
      B.mapquest = {};
      B.mapquest.layers = [this];
      if (B.attributionControl) {
        B.mapquest.logo = (new MQ.Control.Logo()).addTo(B);
        B.mapquest.oldAttribution = B.attributionControl;
        B.attributionControl.removeFrom(B)
      }
      this._resetStats(true);
      this._resetStats(false);
      B.mapquest.lastScale = MQ.mapConfig.getScale(this._map.getZoom());
      B.mapquest.attributionControl = B.attributionControl = MQ.control.attribution().addTo(B)
    } else {
      B.mapquest.layers.push(this)
    }
    this._setBaseLayer(B)
  },
  onRemove: function(D) {
    if (D.mapquest.layers.length == 1) {
      D.mapquest.logo.removeFrom(D);
      D.mapquest.attributionControl.removeFrom(D);
      if (D.mapquest.oldAttribution) {
        D.attributionControl = D.mapquest.oldAttribution.addTo(D)
      }
      D.mapquest.layers = [];
      this._setBaseLayer(D);
      delete D.mapquest
    } else {
      for (var C = 0; C < D.mapquest.layers.length; C++) {
        if (D.mapquest.layers[C] == this) {
          D.mapquest.layers.splice(C, 1);
          break
        }
      }
      this._setBaseLayer(D)
    }
    L.TileLayer.prototype.onRemove.call(this, D)
  },
  _setBaseLayer: function(F) {
    if (F.mapquest) {
      var E = null;
      var G = F.mapquest.layers;
      for (var H = 0; H < G.length; H++) {
        E = G[H];
        if (G[H].options.mapType == "hyb") {
          break
        }
      }
      if (F.mapquest.baseLayer != E) {
        if (F.mapquest.baseLayer) {
          F.off("viewreset", F.mapquest.baseLayer._onViewReset, F.mapquest.baseLayer);
          F.off("movestart", F.mapquest.baseLayer._onMoveStart, F.mapquest.baseLayer);
          F.off("moveend", F.mapquest.baseLayer._onMoveEnd, F.mapquest.baseLayer);
          L.DomEvent.off(window, "unload", F.mapquest.baseLayer._onMapDestroy, F.mapquest.baseLayer);
          F.mapquest.baseLayer._sendTransactions()
        }
        if (E) {
          F.on("viewreset", E._onViewReset, E);
          F.on("movestart", E._onMoveStart, E);
          F.on("moveend", E._onMoveEnd, E);
          L.DomEvent.on(window, "unload", E._onMapDestroy, E)
        }
        F.mapquest.baseLayer = E;
        if (E && F.mapquest.attributionControl) {
          F.mapquest.attributionControl.mapTypeChanged();
          E._resetTransactionPosition()
        }
        F.fire("mqbaselayerchange")
      }
    }
  },
  _onMapDestroy: function() {
    if (this._sendTransactions()) {
      var B = new Date().getTime() + 250;
      while (new Date().getTime() < B) {}
    }
  },
  getTileUrl: function(B) {
    if (this._url) {
      this._adjustTilePoint(B);
      return L.Util.template(this._url, L.extend({
        s: this._getSubdomain(B),
        z: this._getZoomForUrl(),
        x: B.x,
        y: B.y
      }, this.options))
    } else {
      return MQ.mapConfig.getConfig("imagePath") + "loading-tile-gears.jpg"
    }
  },
  _sendTransactions: function() {
    var C = false;
    if (!this._map || !this._map.mapquest) {
      return C
    }
    var D = this._map.mapquest;
    if ((D.mapaccum1 > 0) || (D.mapaccum2 > 0)) {
      this._loadTransactionImage(this._map, "m", D.mapaccum1, D.mapaccum2, D.lastScale);
      C = true
    }
    if ((D.sataccum1 > 0) || (D.sataccum2 > 0)) {
      this._loadTransactionImage(this._map, "a", D.sataccum1, D.sataccum2, D.lastScale);
      C = true
    }
    if ((D.hybaccum1 > 0) || (D.hybaccum2 > 0)) {
      this._loadTransactionImage(this._map, "h", D.hybaccum1, D.hybaccum2, D.lastScale);
      C = true
    }
    this._resetStats(true);
    return C
  },
  _loadTransactionImage: function(N, S, Q, R, K) {
    Q = parseInt(Q * 1000000) / 1000000;
    R = parseInt(R * 1000000) / 1000000;
    var M = this._map.getCenter();
    var P = this._map.getSize();
    var T = "L_" + L.version + "_" + MQ.mapConfig.getConfig("version") + "_" + (MQ.mapConfig.getConfig("configNumber") == "4" ? "OSM" : "MQ");
    var O = "?transaction=log&t=" + S + "&c=" + Q + "&c2=" + R + "&s=" + K + "&lat=" + M.lat + "&lng=" + M.lng + "&key=" + this.options.key + "&width=" + P.x + "&height=" + P.y + "&rand=" + Math.floor(Math.random() * 99991) + "&v=" + T + "&r=";
    var U = new Image();
    U.onload = U.onerror = function() {
      delete U
    };
    MQ.mapConfig.ready(function() {
      U.src = MQ.mapConfig.getConfig("logServer") + O
    })
  },
  _resetStats: function(E) {
    var D = this._getFlags();
    var F = this._map.mapquest;
    if (E) {
      F.mapaccum1 = 0;
      F.sataccum1 = 0;
      F.hybaccum1 = 0;
      F.mapaccum2 = 0;
      F.sataccum2 = 0;
      F.hybaccum2 = 0
    } else {
      if (D.map) {
        F.mapaccum1 += 1;
        F.mapaccum2 += 1
      }
      if (D.sat) {
        F.sataccum1 += 1;
        F.sataccum2 += 1
      }
      if (D.hyb) {
        F.hybaccum1 += 1;
        F.hybaccum2 += 1
      }
    }
    F.diffaccum = 0;
    F.tileOffsetX = 0;
    F.tileOffsetY = 0
  },
  _getFlags: function() {
    var C = {
      map: false,
      sat: false,
      hyb: false
    };
    if (this._map && this._map.mapquest) {
      for (var D = 0; D < this._map.mapquest.layers.length; D++) {
        C[this._map.mapquest.layers[D].options.mapType] = true
      }
    }
    return C
  },
  _resetTransactionPosition: function() {
    if (!this._map || !this._map.mapquest) {
      return
    }
    this._sendTransactions();
    var B = this._map.mapquest;
    B.tileOffsetX = 0;
    B.tileOffsetY = 0;
    B.lastTileCoords = null;
    B.lastScale = MQ.mapConfig.getScale(this._map.getZoom());
    B.mapaccum1 = 0;
    B.sataccum1 = 0;
    B.hybaccum1 = 0;
    B.mapaccum2 = 0;
    B.sataccum2 = 0;
    B.hybaccum2 = 0;
    B.diffaccum = 0
  },
  _onViewReset: function(O) {
    if (!this._map) {
      return
    }
    var Q = this._map.mapquest;
    var S = this._calculateTileCoords();
    var K, N, U, T, M, R;
    var P = 0;
    if (Q.lastTileCoords) {
      N = Q.lastTileCoords.nw.x - S.nw.x;
      U = this._positiveOrZero(S.se.x - Q.lastTileCoords.se.x);
      T = S.nw.y - Q.lastTileCoords.nw.y;
      M = this._positiveOrZero(Q.lastTileCoords.se.y - S.se.y);
      Q.tileOffsetX += N;
      Q.tileOffsetY += T;
      N = this._positiveOrZero(N);
      T = this._positiveOrZero(T);
      P += (N + U) * S.rowcount;
      P += (T + M) * S.colcount;
      if (P > 0) {
        R = P / (S.rowcount * S.colcount * 9);
        K = this._getFlags(this._map);
        if (K.map) {
          Q.mapaccum1 += R
        }
        if (K.sat) {
          Q.sataccum1 += R
        }
        if (K.hyb) {
          Q.hybaccum1 += R
        }
        if (Math.abs(Q.tileOffsetX) > 4 || Math.abs(Q.tileOffsetY) > 4) {
          this._sendTransactions()
        }
      }
    }
    Q.lastTileCoords = S
  },
  _onMoveStart: function(D) {
    if (!this._map) {
      return
    }
    var C = this._map.mapquest;
    if (C) {
      C.moveStart = this._map.getPixelBounds().min
    }
  },
  _onMoveEnd: function(P) {
    if (!this._map) {
      return
    }
    var T = this._map.mapquest;
    if (!T || !T.moveStart) {
      return
    }
    var X, Q, U, Y, W, V, N;
    startx = T.moveStart.x;
    Q = T.moveStart.y;
    var S = this._map.getPixelBounds().min;
    U = Math.abs(S.x - startx);
    Y = Math.abs(S.y - Q);
    var O = this._map.getSize().x;
    var R = this._map.getSize().y;
    T.diffaccum += ((U * Y) + ((O - U) * Y) + ((R - Y) * U));
    if (T.diffaccum < 0) {
      T.diffaccum = 0;
      return
    }
    W = T.diffaccum / (O * R);
    V = W >= 0.4;
    if (V) {
      N = this._getFlags();
      if (N.map) {
        T.mapaccum2 += 1
      }
      if (N.sat) {
        T.sataccum2 += 1
      }
      if (N.hyb) {
        T.hybaccum2 += 1
      }
      T.diffaccum = 0;
      this._sendTransactions()
    }
    T.moveStart = null
  },
  _calculateTileCoords: function() {
    var E = this.options.tileSize;
    var F = this._map.getPixelBounds();
    var D = F.getSize();
    return {
      nw: new L.Point(Math.floor(F.min.x / E), Math.floor(F.min.y / E)),
      se: new L.Point(Math.floor(F.max.x / E), Math.floor(F.max.y / E)),
      colcount: Math.floor(D.x / E) + 1,
      rowcount: Math.floor(D.y / E) + 1
    }
  },
  _positiveOrZero: function(B) {
    return B < 0 ? 0 : B
  }
});
MQ.tileLayer = function(B) {
  if (B == null) {
    B = {}
  }
  if (!B.key && MQKEY) {
    B.key = MQKEY
  }
  return new MQ.TileLayer(B)
};
MQ.mapLayer = function(B) {
  if (B == null) {
    B = {}
  }
  if (!B.key && MQKEY) {
    B.key = MQKEY
  }
  B.mapType = "map";
  return new MQ.TileLayer(B)
};
MQ.satelliteLayer = function(B) {
  if (B == null) {
    B = {}
  }
  if (!B.key && MQKEY) {
    B.key = MQKEY
  }
  B.mapType = "sat";
  return new MQ.TileLayer(B)
};
MQ.hybridLayer = function(E) {
  if (E == null) {
    E = {}
  }
  if (!E.key && MQKEY) {
    E.key = MQKEY
  }
  E.mapType = "sat";
  var H = new MQ.TileLayer(E);
  var F = {
    mapType: "hyb"
  };
  L.Util.setOptions(F, E);
  var G = new MQ.TileLayer(F);
  return L.layerGroup([H, G])
};
MQ.Util = L.Class.extend({
  indexOf: function(I, H, G) {
    if (!Array.prototype.indexOf) {
      for (var J = (G || 0), F = I.length; J < F; J++) {
        if (I[J] === H) {
          return J
        }
      }
      return -1
    }
    return I.indexOf(H)
  },
  escapable: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
  gap: null,
  indent: null,
  meta: {
    "\b": "\\b",
    "\t": "\\t",
    "\n": "\\n",
    "\f": "\\f",
    "\r": "\\r",
    '"': '\\"',
    "\\": "\\\\"
  },
  quote: function(B) {
    this.escapable.lastIndex = 0;
    return this.escapable.test(B) ? '"' + B.replace(this.escapable, function(D) {
      var A = this.meta[D];
      return typeof A === "string" ? A : "\\u" + ("0000" + D.charCodeAt(0).toString(16)).slice(-4)
    }) + '"' : '"' + B + '"'
  },
  str: function(P, S) {
    var K, M, O, N, R = this.gap,
      J, Q = S[P];
    switch (typeof Q) {
      case "string":
        return this.quote(Q);
      case "number":
        return isFinite(Q) ? String(Q) : "null";
      case "boolean":
      case "null":
        return String(Q);
      case "object":
        if (!Q) {
          return "null"
        }
        this.gap += this.indent;
        J = [];
        if ((Object.prototype.toString.apply(Q) === "[object Array]") || (typeof(Q) == "object" && typeof(Q.length) == "number" && (Q.length === 0 || typeof((Q[0])) != "undefined"))) {
          N = Q.length;
          for (K = 0; K < N; K += 1) {
            J[K] = this.str(K, Q) || "null"
          }
          O = J.length === 0 ? "[]" : this.gap ? "[\n" + this.gap + J.join(",\n" + this.gap) + "\n" + R + "]" : "[" + J.join(",") + "]";
          this.gap = R;
          return O
        }
        for (M in Q) {
          if (Object.hasOwnProperty.call(Q, M)) {
            O = this.str(M, Q);
            if (O) {
              J.push(this.quote(M) + (this.gap ? ": " : ":") + O)
            }
          }
        }
        O = J.length === 0 ? "{}" : this.gap ? "{\n" + this.gap + J.join(",\n" + this.gap) + "\n" + R + "}" : "{" + J.join(",") + "}";
        this.gap = R;
        return O
    }
  },
  stringifyJSON: function(B) {
    if (window.JSON && window.JSON.stringify) {
      return window.JSON.stringify(B)
    }
    return this.str("", {
      "": B
    })
  },
  toQueryString: function(F) {
    var H = [],
      G = {},
      E;
    for (E in F) {
      if (!G[E]) {
        H.push(encodeURIComponent(E) + "=" + encodeURIComponent(String(F[E])))
      }
    }
    return H.join("&")
  },
  xhr: function() {
    function C(B) {
      try {
        return new ActiveXObject(B)
      } catch (A) {
        return undefined
      }
    }
    if (window.XMLHttpRequest) {
      return new window.XMLHttpRequest()
    }
    if (window.ActiveXObject) {
      var D = C("Msxml2.XMLHTTP.6.0") || C("Msxml2.XMLHTTP.3.0") || C("Msxml2.XMLHTTP") || C("Microsoft.XMLHTTP");
      if (D) {
        return D
      }
    }
    throw new Error("Current browser configuration does not support XMLHttpRequest")
  },
  parseJSON: function(C) {
    try {
      if (window.JSON && window.JSON.parse) {
        return window.JSON.parse(C)
      }
      return MQA._jsEval("(" + C + ")")
    } catch (D) {
      return undefined
    }
  },
  doXhr: function(N, M, R) {
    if (!M) {
      M = {}
    }
    var O = this.xhr(),
      Q, P, K = M.verb || "GET",
      J = (typeof M.async != "undefined") ? M.async : true;
    setup = M.setup;
    O.open(K, N, J);
    if (setup) {
      setup(O)
    }
    if ((K == "GET") && (L.Browser.ie)) {
      O.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT")
    }
    var S = function() {
      O.onreadystatechange = function() {};
      var B, C;
      try {
        B = O.status
      } catch (D) {}
      C = O;
      O = null;
      if (P) {
        clearTimeout(P)
      }
      if (B >= 200 && B <= 299) {
        R(C, false)
      } else {
        var E;
        try {
          E = C.responseText
        } catch (A) {}
        R(C, {
          reason: "HTTP error",
          statusCode: B,
          responseText: E
        })
      }
    };
    O.onreadystatechange = function() {
      if (Q) {
        return
      }
      if (O.readyState == 4) {
        S()
      }
    };
    if (M.timeout) {
      P = setTimeout(function() {
        if (Q) {
          return
        }
        Q = true;
        O.onreadystatechange = function() {};
        O.abort();
        R(O, {
          reason: "Request timed out"
        });
        O = null
      }, M.timeout)
    }
    if (M.formUrlEncoded) {
      O.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      O.setRequestHeader("Content-length", M.postData.length);
      O.setRequestHeader("Connection", "close")
    }
    O.send(M.postData || null);
    if (!J && (MQA.browser.name == "firefox") && O) {
      S()
    }
    return function() {
      if (O) {
        Q = true;
        O.onreadystatechange = function() {};
        O.abort();
        O = null;
        if (P) {
          clearTimeout(P)
        }
      }
    }
  },
  doGetJSON: function(D, F, E) {
    return this.doXhr(D, F, function(B, A) {
      if (A) {
        E(false, A)
      } else {
        var C = MQ.util.parseJSON(B.responseText);
        if (!C) {
          E(false, {
            reason: "Parse Error",
            responseText: B.responseText
          })
        } else {
          E(C, null, B.responseText)
        }
      }
    })
  },
  doPostJSON: function(E, F, H, G) {
    H = L.Util.extend(H, {
      verb: "POST",
      setup$After: function(A) {
        A.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
      },
      postData: this.stringifyJSON(F)
    });
    return MQ.util.doGetJSON(E, H, G)
  },
  _jsonpCounter: 0,
  _jsonpHead: null,
  doJSONP: function(N, K, O) {
    var S = (N || "").indexOf("?") === -1 ? "?" : "&",
      P;
    var R = (K.callback || "callback");
    var Q = R + "_json" + (++this._jsonpCounter);
    N += "&" + R + "=" + encodeURIComponent(Q);
    window[Q] = function(B) {
      O(B);
      try {
        delete window[Q]
      } catch (A) {}
      window[Q] = null
    };
    var M = document.createElement("script");
    M.src = N;
    M.type = "text/javascript";
    M.async = true;
    M.onerror = function(A) {
      O(false, {
        url: N,
        event: A
      })
    };
    var J = false;
    M.onload = M.onreadystatechange = function() {
      if (!J && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        J = true;
        M.onload = M.onreadystatechange = null;
        if (M && M.parentNode) {
          M.parentNode.removeChild(M)
        }
      }
    };
    if (!this._jsonpHead) {
      this._jsonpHead = document.getElementsByTagName("head")[0]
    }
    this._jsonpHead.appendChild(M)
  },
  doJSONV: function(E, H, F) {
    var G = document.createElement("script");
    G.src = E;
    G.type = "text/javascript";
    if (MQA.browser.name == "msie") {
      G.onreadystatechange = function() {
        F()
      }
    } else {
      G.onload = function() {
        F()
      }
    }
    document.body.appendChild(G);
    return function() {}
  },
  __IOCacheBustValue: 0,
  cacheBust: function() {
    return (new Date().getTime() + "," + (++this.__IOCacheBustValue))
  },
  loadCSS: function(F) {
    var G = document.createElement("style"),
      H = document.getElementsByTagName("head")[0];
    if (!H) {
      return
    }
    if (L.Browser.ie && !(window.XDomainRequest && window.msPerformance)) {
      G.setAttribute("type", "text/css");
      if (G.styleSheet) {
        G.styleSheet.cssText = F
      }
    } else {
      try {
        G.appendChild(document.createTextNode(F))
      } catch (E) {
        G.setAttribute("type", "text/css");
        if (G.styleSheet) {
          G.styleSheet.cssText = F
        }
      }
    }
    if (H.firstChild) {
      H.insertBefore(G, H.firstChild)
    } else {
      H.appendChild(G)
    }
  }
});
MQ.util = new MQ.Util();
MQ.MapConfig = L.Class.extend({
  includes: L.Mixin.Events,
  _hasLoaded: 0,
  sslMode: false,
  _config: {
    smallMap: 400,
    version: "1.0"
  },
  initialize: function(B) {
    L.setOptions(this, B);
    this.sslMode = ("https:" == document.location.protocol)
  },
  load: function() {
    this._hasLoaded = 1;
    this._parseHardCoded()
  },
  ready: function(B) {
    if (this._hasLoaded == 2) {
      B.call(null, this)
    } else {
      this.on("load", B);
      if (!this._hasLoaded) {
        this.load()
      }
    }
  },
  _parseHardCoded: function() {
    this._config.configNumber = MQCONFIGNUMBER;
    this._config.logServer = MQLOGURL + "/transaction";
    this._config.copyrightServer = MQCOPYRIGHT + "/coverage";
    this._config.geocodeAPI = MQGEOCODEURL + "v1/";
    this._config.trafficAPI = MQTRAFFSERVER + "v2/";
    this._config.directionsAPI = MQROUTEURL + "v2/";
    this._config.cdn = MQCDN;
    this._config.trafficImagePath = MQCDNCOMMON + "mqtraffic/";
    this._config.imagePath = MQIMAGEPATH + "images/";
    this._config.iconPath = MQICONSERVER;
    this._config.map = {
      url: this._leafletURL(MQTILEMAP),
      ext: MQTILEMAPEXT,
      subdomains: this._leafletSubdomains(MQTILEMAPLO, MQTILEMAPHI)
    };
    this._config.hyb = {
      url: this._leafletURL(MQTILEHYB),
      ext: MQTILEHYBEXT,
      subdomains: this._leafletSubdomains(MQTILEHYBLO, MQTILEHYBHI)
    };
    this._config.sat = {
      url: this._leafletURL(MQTILESAT),
      ext: MQTILESATEXT,
      subdomains: this._leafletSubdomains(MQTILESATLO, MQTILESATHI)
    };
    this._hasLoaded = 2;
    this.fire("load", this)
  },
  _leafletURL: function(B) {
    if (B) {
      B = B.replace(/\{\$/g, "{");
      B = B.replace("{hostrange}", "{s}")
    }
    return B
  },
  _leafletSubdomains: function(G, H) {
    var E = [];
    for (var F = G; F <= H; F++) {
      E.push(F)
    }
    return E
  },
  getConfig: function(B) {
    return this._config[B]
  },
  setConfig: function(C, D) {
    this._config[C] = D
  },
  setAPIKey: function(B) {
    if (B.key) {
      this.setConfig("key", B.key)
    } else {
      B.key = this.getConfig("key")
    }
  },
  getScale: function(D) {
    if (this._resolutions == null) {
      var C = 156543.0339;
      this._resolutions = [];
      while (C > 0.1) {
        this._resolutions.push(C);
        C *= 0.5
      }
    }
    return Math.floor(this._resolutions[D] * 39.3700787 * 72)
  }
});
MQ.mapConfig = new MQ.MapConfig();
MQ.util.loadCSS(".mq-attribution-control{font-family:sans-serif;font-size:9px;white-space:nowrap;margin-bottom: 2px !important;} .mq-attribution-control-light{color:white;font-weight:bold;} .mq-attribution-control-dark{color:black;font-weight:bold;} .mq-attribution-control .mqacopyswitch{display:none;} .mq-attribution-control-light .mqacopyswitchlight{display:inline;} .mq-attribution-control-dark .mqacopyswitchdark{display:inline;}");
MQ.Control.Attribution = L.Control.extend({
  map: null,
  _currentMapType: "map",
  _currentZoom: 0,
  _currentBounds: null,
  _lastQuery: null,
  _entityMap: {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
  },
  options: {
    position: "bottomright"
  },
  initialize: function(B) {
    L.setOptions(this, B)
  },
  onAdd: function(B) {
    this.map = B;
    this._container = L.DomUtil.create("div", "mq-attribution-control");
    this.list = [];
    this.invalidateAttribution();
    B.on("zoomend", this.invalidateCoverage, this);
    B.on("moveend", this.invalidateCoverage, this);
    this._updateAttributionStyle();
    return this._container
  },
  onRemove: function(B) {
    B.off("zoomend", this.invalidateCoverage, this);
    B.off("moveend", this.invalidateCoverage, this)
  },
  escapeHtml: function(B) {
    return String(B).replace(/[&<>"'\/]/g, function(A) {
      return _entityMap[A]
    })
  },
  replaceHtml: function(D) {
    var C = MQ.mapConfig.getConfig("imagePath");
    return D.replace(/\%TK\%/g, C)
  },
  getPreamble: function() {
    return "&nbsp;&nbsp;-&nbsp;&nbsp;Some data&nbsp;&copy;" + (new Date().getFullYear()) + "&nbsp;"
  },
  set: function(H, M) {
    var G, I = this.list,
      K, J = false;
    if (!M) {
      for (G = 0; G < I.length; G++) {
        K = I[G];
        if (K && K[0] == H) {
          I[G] = null;
          this.invalidateAttribution();
          return
        }
      }
    } else {
      I.push([H, M]);
      this.invalidateAttribution()
    }
  },
  invalidateAttribution: function() {
    if (this._refreshAttributionKey) {
      return
    }
    var B = this;
    this._refreshAttributionKey = setTimeout(function() {
      B.refreshAttribution()
    }, 0)
  },
  refreshAttribution: function() {
    this._refreshAttributionKey = null;
    var P, N = [],
      V, S = this.list,
      Q, O = ["&copy;" + (new Date().getFullYear()) + "&nbsp;MapQuest"],
      T = null,
      R, U, W = {},
      M = window.location.hostname.match(/.ca$/) ? "http://info.mapquest.com/mapquest-terms-of-use-ca-en/" : "http://www.mapquest.com/terms-of-use";
    for (V = 0; V < S.length; V++) {
      Q = S[V];
      if (Q) {
        N.push(Q)
      }
    }
    N.sort(COPYRIGHT_SORT);
    this.list = N;
    for (V = 0; V < N.length; V++) {
      P = N[V][0];
      Q = N[V][1];
      if (Q != undefined && (Q.text != "" || Q.html != "") && V == 0) {
        O.push(this.getPreamble())
      }
      if (!Q || W[P]) {
        continue
      }
      W[P] = true;
      if (V > 0) {
        O.push(",&nbsp;")
      }
      if (Q.html) {
        O.push(this.replaceHtml(Q.html))
      } else {
        if (Q.text) {
          O.push(this.escapeHtml(Q.text))
        }
      }
    }
    termsHTML = '<a id="terms" class="termsLink" target="_blank" href="' + M + '">Terms</a>';
    if (this.map && this.map.getSize().x > MQ.mapConfig.getConfig("smallMap")) {
      O.push(" | " + termsHTML)
    } else {
      O = [termsHTML]
    }
    U = O.join("");
    if (U != this._curHtml) {
      this._container.innerHTML = U;
      this._curHtml = U
    }
  },
  _updateAttributionStyle: function() {
    if (this._currentMapType == "hyb" || this._currentMapType == "sat") {
      L.DomUtil.removeClass(this._container, "mq-attribution-control-dark");
      L.DomUtil.addClass(this._container, "mq-attribution-control-light")
    } else {
      L.DomUtil.removeClass(this._container, "mq-attribution-control-light");
      L.DomUtil.addClass(this._container, "mq-attribution-control-dark")
    }
  },
  mapTypeChanged: function() {
    if (this.map.mapquest && this.map.mapquest.baseLayer) {
      this._currentMapType = this.map.mapquest.baseLayer.options.mapType
    }
    this.invalidateCoverage();
    this._updateAttributionStyle()
  },
  invalidateCoverage: function() {
    if (this._refreshCoverageKey != null) {
      window.clearTimeout(this._refreshCoverageKey)
    }
    var B = this;
    this._refreshCoverageKey = setTimeout(function() {
      B.refreshCoverage()
    }, 0)
  },
  refreshCoverage: function() {
    this._refreshCoverageKey = null;
    this._currentBounds = this.map.getBounds();
    this._currentZoom = this.map.getZoom();
    if (this.map.mapquest && this.map.mapquest.baseLayer) {
      this._currentMapType = this.map.mapquest.baseLayer.options.mapType
    }
    var C = "format=json&loc=" + this._getTrimmedBounds() + "&zoom=" + this._currentZoom + "&projection=sm&cat=" + this._currentMapType;
    if (this._lastQuery == C) {
      return
    }
    this._lastQuery = C;
    var D = this;
    MQ.mapConfig.ready(function() {
      MQ.util.doJSONP(MQ.mapConfig.getConfig("copyrightServer") + "?" + C, {
        callback: "jsonp"
      }, L.Util.bind(D._handleCoverageData, D))
    })
  },
  _getTrimmedBounds: function() {
    if (this._currentBounds) {
      var D = this._currentBounds.getNorthEast();
      var C = this._currentBounds.getSouthWest();
      if (C.lng > 0 && D.lng < 0) {
        if ((C.lng + D.lng) > 0) {
          C.lng -= 360
        } else {
          D.lng += 360
        }
      }
      return C.lng.toFixed(2) + "," + C.lat.toFixed(2) + "," + D.lng.toFixed(2) + "," + D.lat.toFixed(2)
    } else {
      return ""
    }
  },
  _handleCoverageData: function(E) {
    if (E && E[this._currentMapType]) {
      var F = E[this._currentMapType];
      this.list = [];
      for (var G = 0; G < F.length; G++) {
        if (!F[G].opt) {
          for (var H = 0; H < F[G].copyrights.length; H++) {
            this.set(F[G].copyrights[H].id, F[G].copyrights[H])
          }
        }
      }
    }
  }
});
var GROUP_SORT = {
  "": 1,
  "Map Data": 2,
  Imagery: 3
};

function COPYRIGHT_SORT(P, I) {
  var M = P[1],
    N = I[1],
    J = M.group,
    K = N.group,
    O = String(M.html || M.text || ""),
    Q = String(N.html || N.text || "");
  J = String(GROUP_SORT[J] || J);
  K = String(GROUP_SORT[K] || K);
  if (J == K) {
    if (O == Q) {
      return 0
    } else {
      if (O < Q) {
        return -1
      } else {
        return 1
      }
    }
  } else {
    if (J < K) {
      return -1
    } else {
      return 1
    }
  }
}
MQ.control.attribution = function(B) {
  return new MQ.Control.Attribution(B)
};
MQ.util.loadCSS(".mq-logo-control{margin-left: 2px !important;margin-bottom: 2px !important;}.mq-logo-control img{ position: relative; top:4px;}");
MQ.Control.Logo = L.Control.extend({
  options: {
    position: "bottomleft"
  },
  initialize: function(B) {
    L.setOptions(this, B)
  },
  onAdd: function(B) {
    this._container = L.DomUtil.create("div", "mq-logo-control");
    L.DomEvent.disableClickPropagation(this._container);
    this._container.innerHTML = '<img src="' + MQ.mapConfig.getConfig("imagePath") + 'questy_sm.png" width="97" height="15"/>';
    return this._container
  }
});
MQ.control.logo = function(B) {
  return new MQ.Control.Logo(B)
};