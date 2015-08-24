// Generated by CoffeeScript 1.9.3
var Kanilayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Kanilayer = (function(superClass) {
  extend(Kanilayer, superClass);

  Kanilayer.prototype.tileA = null;

  Kanilayer.prototype.tileB = null;

  Kanilayer.prototype.vector = null;

  Kanilayer.prototype.floorId = false;

  Kanilayer.prototype.debug_ = false;

  Kanilayer.prototype.getHaikaTileSource_ = function(id) {
    var xid;
    xid = ("0000000000" + parseInt(id)).slice(-10);
    return new ol.source.XYZ({
      url: "https://tiles.haika.io/" + xid + "/{z}/{x}/{y}.png",
      maxZoom: 24
    });
  };

  function Kanilayer(options) {
    var merge, options_;
    options_ = {
      minResolution: 0.0001,
      maxResolution: 100,
      kFloor: null
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
    this.tileA = new ol.layer.Tile({
      source: this.getHaikaTileSource_(options_.kFloor),
      opacity: 1,
      preload: 3
    });
    options_.layers = [this.tileA];
    Kanilayer.__super__.constructor.call(this, options_);
    this.tileA.on('postcompose', this.postcompose_, this);
  }

  Kanilayer.prototype.setFloorId = function(newId, animation) {
    if (animation == null) {
      animation = true;
    }
    this.tileA.setSource(this.getHaikaTileSource_(newId));
    return this.changed();
  };

  Kanilayer.prototype.showDebugInfomation = function(newValue) {
    this.debug_ = newValue;
    return this.changed();
  };

  Kanilayer.prototype.postcompose_ = function(event) {
    var context, debugText;
    if (this.debug_) {
      context = event.context;
      debugText = "[Kanilayer]";
      context.save();
      context.fillStyle = "rgba(255, 255, 255, 0.6)";
      context.fillRect(0, context.canvas.height - 20, context.canvas.width, 20);
      context.font = "10px";
      context.fillStyle = "black";
      context.fillText(debugText, 10, context.canvas.height - 7);
      return context.restore();
    }
  };

  return Kanilayer;

})(ol.layer.Group);

//# sourceMappingURL=kanilayer.js.map
