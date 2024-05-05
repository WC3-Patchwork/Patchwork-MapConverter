// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3str'));
  } else {
    root.W3W3c = factory(root.KaitaiStream, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3str) {
var W3W3c = (function() {
  function W3W3c(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3c.prototype._read = function() {
    this.version = this._io.readU4le();
    this.numCamera = this._io.readU4le();
    this.camera = [];
    for (var i = 0; i < this.numCamera; i++) {
      var _t_camera = new Camera(this._io, this, this._root);
      _t_camera._read();
      this.camera.push(_t_camera);
    }
  }

  var Camera = W3W3c.Camera = (function() {
    function Camera(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Camera.prototype._read = function() {
      this.targetX = this._io.readF4le();
      this.targetY = this._io.readF4le();
      this.targetZ = this._io.readF4le();
      this.angle = this._io.readF4le();
      this.angleOfAttack = this._io.readF4le();
      this.distance = this._io.readF4le();
      this.roll = this._io.readF4le();
      this.fieldOfView = this._io.readF4le();
      this.farClipping = this._io.readF4le();
      this.unknown = this._io.readF4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
    }

    return Camera;
  })();

  return W3W3c;
})();
return W3W3c;
}));
