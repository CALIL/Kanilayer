var Kanilayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Kanilayer = (function(superClass) {
  extend(Kanilayer, superClass);

  Kanilayer.prototype.floorId = false;

  Kanilayer.prototype.tileA = null;

  Kanilayer.prototype.tileB = null;

  Kanilayer.prototype.vector = null;

  Kanilayer.prototype.debug_ = false;

  Kanilayer.prototype.fadeAnimation = null;

  Kanilayer.prototype.targetShelves = [];

  Kanilayer.prototype.setTargetShelf = function(id) {
    this.targetShelves = [
      {
        'id': id
      }
    ];
    return this.vector.changed();
  };

  Kanilayer.prototype.setTargetShelves = function(ids) {
    this.targetShelves = ids;
    return this.vector.changed();
  };

  Kanilayer.prototype.getHaikaTileSource_ = function(id) {
    var xid;
    xid = ("0000000000" + parseInt(id)).slice(-10);
    return new ol.source.XYZ({
      url: "https://tiles.haika.io/" + xid + "/{z}/{x}/{y}.png",
      maxZoom: 24
    });
  };

  Kanilayer.prototype.getHaikaVectorSource_ = function(id) {
    return new ol.source.Vector({
      url: "https://app.haika.io/api/facility/2/" + id + ".geojson",
      format: new ol.format.GeoJSON()
    });
  };

  function Kanilayer(options) {
    var merge, options_, styleFunction;
    options_ = {
      minResolution: 0.0001,
      maxResolution: 100,
      kFloor: null,
      targetImageUrl: null,
      targetImageUrl2: null
    };
    merge = function(obj1, obj2) {
      var attr, results;
      if (!obj2) {
        obj2 = {};
      }
      results = [];
      for (attr in obj2) {
        if (obj2.hasOwnProperty(attr)) {
          results.push(obj1[attr] = obj2[attr]);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    merge(options_, options);
    if (options_.targetImageUrl != null) {
      this.targetImageUrl = options_.targetImageUrl;
    }
    if (options_.targetImageUrl2 != null) {
      this.targetImageUrl2 = options_.targetImageUrl2;
    }
    this.tileA = new ol.layer.Tile({
      source: null,
      opacity: 1,
      preload: 3
    });
    this.tileB = new ol.layer.Tile({
      source: null,
      opacity: 0,
      visible: false,
      preload: 3
    });
    styleFunction = (function(_this) {
      return function(feature, resolution) {
        var i, index, index_, len, message, ref, ref1, shelf, side, size, styles, text, url;
        styles = [];
        if (resolution < 1.0) {
          switch (feature.get('type')) {
            case 'shelf':
              if (resolution < 0.28) {
                text = (ref = feature.get('label')) != null ? ref : '';
              } else {
                text = '';
              }
              index = -1;
              index_ = 0;
              side = null;
              ref1 = _this.targetShelves;
              for (i = 0, len = ref1.length; i < len; i++) {
                shelf = ref1[i];
                if (shelf.id === parseInt(feature.get('id'))) {
                  if (shelf.side != null) {
                    if (side === null) {
                      side = shelf.side;
                    } else {
                      if (side === 'a' && shelf.side === 'b') {
                        side = null;
                        break;
                      }
                      if (side === 'b' && shelf.side === 'a') {
                        side = null;
                        break;
                      }
                    }
                  }
                  index = index_;
                }
                index_++;
              }
              if (index !== -1) {
                _this.targetPosition = feature;
                if (index >= 1) {
                  styles.push(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                      color: '#9E7E49',
                      width: 2
                    }),
                    fill: new ol.style.Fill({
                      color: '#FFBE4D'
                    }),
                    geometry: function(feature) {
                      var a, a_, b, b_, c, c_, d, d_, size;
                      a = feature.getGeometry().getCoordinates()[0][0];
                      b = feature.getGeometry().getCoordinates()[0][1];
                      c = feature.getGeometry().getCoordinates()[0][2];
                      d = feature.getGeometry().getCoordinates()[0][3];
                      size = (1 / resolution) * window.devicePixelRatio;
                      if (side === 'a' && size >= 30) {
                        c_ = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
                        d_ = [(a[0] + d[0]) / 2, (a[1] + d[1]) / 2];
                        return new ol.geom.Polygon([[a, b, c_, d_, a]]);
                      } else if (side === 'b' && size >= 30) {
                        b_ = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
                        a_ = [(a[0] + d[0]) / 2, (a[1] + d[1]) / 2];
                        return new ol.geom.Polygon([[a_, b_, c, d, a_]]);
                      } else {
                        return new ol.geom.Polygon([[a, b, c, d, a]]);
                      }
                    }
                  }));
                } else {
                  styles.push(new ol.style.Style({
                    zIndex: 9998,
                    stroke: new ol.style.Stroke({
                      color: '#9E7E49',
                      width: 2
                    }),
                    fill: new ol.style.Fill({
                      color: '#FFBE4D'
                    }),
                    geometry: function(feature) {
                      var a, a_, b, b_, c, c_, d, d_, size;
                      a = feature.getGeometry().getCoordinates()[0][0];
                      b = feature.getGeometry().getCoordinates()[0][1];
                      c = feature.getGeometry().getCoordinates()[0][2];
                      d = feature.getGeometry().getCoordinates()[0][3];
                      size = (1 / resolution) * window.devicePixelRatio;
                      console.log(size);
                      if (side === 'a' && size >= 30) {
                        c_ = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
                        d_ = [(a[0] + d[0]) / 2, (a[1] + d[1]) / 2];
                        return new ol.geom.Polygon([[a, b, c_, d_, a]]);
                      } else if (side === 'b' && size >= 30) {
                        b_ = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
                        a_ = [(a[0] + d[0]) / 2, (a[1] + d[1]) / 2];
                        return new ol.geom.Polygon([[a_, b_, c, d, a_]]);
                      } else {
                        return new ol.geom.Polygon([[a, b, c, d, a]]);
                      }
                    }
                  }));
                  size = (1 / resolution) * window.devicePixelRatio;
                  if (size >= 1) {
                    if (size > 30 * window.devicePixelRatio) {
                      url = _this.targetImageUrl;
                      message = 'ここ！';
                      size = Math.max(size, 60 * window.devicePixelRatio);
                    } else {
                      url = _this.targetImageUrl2;
                      message = '目的地';
                      size = Math.max(size, 40 * window.devicePixelRatio);
                    }
                    console.log(url, size);
                    styles.push(new ol.style.Style({
                      text: new ol.style.Text({
                        textAlign: 'left',
                        textBaseline: 'hanging',
                        font: 'Arial bold',
                        text: message,
                        fill: new ol.style.Fill({
                          color: '#D95C02'
                        }),
                        stroke: new ol.style.Stroke({
                          color: [255, 255, 255, 1],
                          width: 3
                        }),
                        scale: 2,
                        offsetX: 25,
                        offsetY: -40,
                        rotation: 0
                      }),
                      image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        scale: size / 233,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: 1,
                        src: url
                      }),
                      geometry: function(feature) {
                        var a, ab, abcd, b, c, cd, d, diff_ad;
                        a = feature.getGeometry().getCoordinates()[0][0];
                        b = feature.getGeometry().getCoordinates()[0][1];
                        c = feature.getGeometry().getCoordinates()[0][2];
                        d = feature.getGeometry().getCoordinates()[0][3];
                        size = (1 / resolution) * window.devicePixelRatio;
                        if (side === 'a' && size >= 30) {
                          diff_ad = [(d[0] - a[0]) / 2, (d[1] - a[1]) / 2];
                          ab = [(a[0] + b[0]) / 2 - diff_ad[0] * 2, (a[1] + b[1]) / 2 - diff_ad[1] * 2];
                          return new ol.geom.Point(ab);
                        } else if (side === 'b' && size >= 30) {
                          diff_ad = [(d[0] - a[0]) / 2, (d[1] - a[1]) / 2];
                          cd = [(c[0] + d[0]) / 2 + diff_ad[0] * 1.5, (c[1] + d[1]) / 2 + diff_ad[1] * 1.5];
                          return new ol.geom.Point(cd);
                        } else {
                          abcd = [(a[0] + b[0] + c[0] + d[0]) / 4, (a[1] + b[1] + c[1] + d[1]) / 4];
                          return new ol.geom.Point(abcd);
                        }
                      },
                      zIndex: 9999
                    }));
                  }
                }
              } else {
                styles.push(new ol.style.Style({
                  text: new ol.style.Text({
                    textAlign: 'center',
                    textBaseline: 'hanging',
                    font: 'Arial',
                    text: text,
                    fill: new ol.style.Fill({
                      color: [0, 0, 0, 1]
                    }),
                    stroke: new ol.style.Stroke({
                      color: [255, 255, 255, 1],
                      width: 1.5
                    }),
                    scale: 1.5,
                    offsetX: 0,
                    offsetY: 0,
                    rotation: 0
                  })
                }));
              }
              break;
            case 'beacon':
              if (_this.debug_ === true) {
                styles.push(new ol.style.Style({
                  image: new ol.style.Circle({
                    radius: 5,
                    fill: null,
                    stroke: new ol.style.Stroke({
                      color: '#000000'
                    })
                  }),
                  text: new ol.style.Text({
                    textAlign: 'left',
                    textBaseline: 'middle',
                    font: 'Arial 12px',
                    text: feature.get('minor') + ' (' + feature.get('lane') + ')',
                    fill: new ol.style.Fill({
                      color: [0, 0, 0, 1]
                    }),
                    stroke: new ol.style.Stroke({
                      color: [255, 255, 255, 1],
                      width: 1.5
                    }),
                    scale: 1,
                    offsetX: 8,
                    offsetY: 0,
                    rotation: 0
                  })
                }));
              }
          }
        }
        return styles;
      };
    })(this);
    this.vector = new ol.layer.Vector({
      source: null,
      style: styleFunction,
      opacity: 1
    });
    options_.layers = [this.tileB, this.tileA, this.vector];
    Kanilayer.__super__.constructor.call(this, options_);
    this.vector.on('postcompose', this.postcompose_, this);
    this.tileA.on('precompose', this.precompose_, this);
    if (options_.kFloor != null) {
      this.setFloorId(options_.kFloor, false);
    }
  }

  Kanilayer.prototype.setFloorId = function(newId, animation) {
    var newSource;
    if (animation == null) {
      animation = true;
    }
    if (this.floorId !== newId) {
      this.floorId = newId;
      if (animation) {
        this.tileB.setSource(this.tileA.getSource());
        this.tileB.setOpacity(1);
        this.tileB.setVisible(true);
        this.tileA.setOpacity(0);
        this.vector.setOpacity(0);
      } else {
        this.tileA.setOpacity(1);
        this.tileB.setVisible(false);
        this.tileB.setSource(null);
        this.vector.setOpacity(1);
      }
      if (newId != null) {
        newSource = this.getHaikaTileSource_(newId);
        this.tileA.setSource(newSource);
        this.vector.setSource(this.getHaikaVectorSource_(newId));
      } else {
        newSource = this.getHaikaTileSource_(0);
        this.tileA.setSource(newSource);
        this.vector.setSource(null);
      }
      if (animation) {
        this.fadeAnimation = {
          start: new Date(),
          phase: 0,
          tilesStarted: 0,
          tilesLoaded: 0
        };
        if (newId == null) {
          this.fadeAnimation.phase = 2;
        } else {
          newSource.on('tileloadstart', (function(_this) {
            return function() {
              if (_this.fadeAnimation != null) {
                return _this.fadeAnimation.tilesStarted++;
              }
            };
          })(this));
          newSource.on('tileloadend', (function(_this) {
            return function() {
              if (_this.fadeAnimation != null) {
                return _this.fadeAnimation.tilesLoaded++;
              }
            };
          })(this));
          newSource.on('tileloaderror', (function(_this) {
            return function() {
              if (_this.fadeAnimation != null) {
                return _this.fadeAnimation.tilesLoaded++;
              }
            };
          })(this));
        }
      }
      return this.changed();
    }
  };

  Kanilayer.prototype.showDebugInfomation = function(newValue) {
    this.debug_ = newValue;
    return this.changed();
  };

  Kanilayer.prototype.precompose_ = function(event) {
    var frameState, time;
    frameState = event.frameState;
    if (this.fadeAnimation != null) {
      frameState.animate = true;
      if (this.fadeAnimation.phase === 0) {
        if (frameState.time - this.fadeAnimation.start > 2000) {
          this.fadeAnimation.phase = 1;
          return this.fadeAnimation.start = new Date();
        } else if (this.fadeAnimation.tilesStarted > 0 && this.fadeAnimation.tilesLoaded > 0) {
          this.fadeAnimation.phase = 1;
          if (frameState.time - this.fadeAnimation.start > 50) {
            return this.fadeAnimation.start = new Date();
          }
        }
      } else if (this.fadeAnimation.phase === 1) {
        time = (frameState.time - this.fadeAnimation.start) / 200;
        if (time <= 1) {
          return this.tileA.setOpacity(time);
        } else {
          this.tileA.setOpacity(1);
          this.fadeAnimation.phase = 2;
          return this.fadeAnimation.start = new Date();
        }
      } else if (this.fadeAnimation.phase === 2) {
        time = (frameState.time - this.fadeAnimation.start) / 150;
        if (time <= 1) {
          this.tileB.setOpacity(1 - time);
          return this.vector.setOpacity(time);
        } else {
          this.vector.setOpacity(1);
          this.tileB.setVisible(false);
          this.tileB.setSource(null);
          return this.fadeAnimation = null;
        }
      }
    }
  };

  Kanilayer.prototype.postcompose_ = function(event) {
    var context, debugText;
    if (this.debug_) {
      context = event.context;
      debugText = "[Kanilayer]";
      if (this.fadeAnimation) {
        debugText += ' アニメーション中 フェーズ:';
        debugText += this.fadeAnimation.phase;
      }
      context.save();
      context.fillStyle = "rgba(255, 255, 255, 0.6)";
      context.fillRect(0, context.canvas.height - 20, context.canvas.width, 20);
      context.font = "10px";
      context.fillStyle = "black";
      context.fillText(debugText, 10, context.canvas.height - 7);
      return context.restore();
    }
  };

  Kanilayer.prototype.targetImageUrl = null;

  Kanilayer.prototype.targetPosition = null;

  return Kanilayer;

})(ol.layer.Group);
