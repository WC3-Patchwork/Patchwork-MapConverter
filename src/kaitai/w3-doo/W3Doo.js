// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'));
  } else {
    root.W3Doo = factory(root.KaitaiStream, root.W3id);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id) {
var W3Doo = (function() {
  function W3Doo(_io, _parent, _root, useSkin) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;
    this.useSkin = useSkin;

  }
  W3Doo.prototype._read = function() {
    this.fileId = new W3id(this._io, this, null);
    this.fileId._read();
    this.version = this._io.readU4le();
    this.subVersion = this._io.readU4le();
    this.numDoodad = this._io.readU4le();
    this.doodad = [];
    for (var i = 0; i < this.numDoodad; i++) {
      var _t_doodad = new Doodad(this._io, this, this._root);
      _t_doodad._read();
      this.doodad.push(_t_doodad);
    }
    this.specialDoodadVersion = this._io.readU4le();
    this.numSpecialDoodad = this._io.readU4le();
    this.specialDoodad = [];
    for (var i = 0; i < this.numSpecialDoodad; i++) {
      var _t_specialDoodad = new SpecialDoodad(this._io, this, this._root);
      _t_specialDoodad._read();
      this.specialDoodad.push(_t_specialDoodad);
    }
  }

  var Doodad = W3Doo.Doodad = (function() {
    function Doodad(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Doodad.prototype._read = function() {
      this.id = new W3id(this._io, this, null);
      this.id._read();
      this.variation = this._io.readU4le();
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
      this.z = this._io.readF4le();
      this.angle = this._io.readF4le();
      this.scaleX = this._io.readF4le();
      this.scaleY = this._io.readF4le();
      this.scaleZ = this._io.readF4le();
      if (this._root.useSkin != 0) {
        this.skinId = new W3id(this._io, this, null);
        this.skinId._read();
      }
      this.flags = this._io.readU1();
      this.life = this._io.readU1();
      if (this._root.version == 8) {
        this.randomItemSetPtr = this._io.readU4le();
      }
      if (this._root.version == 8) {
        this.numItemSet = this._io.readU4le();
      }
      if (this._root.version == 8) {
        this.itemSet = [];
        for (var i = 0; i < this.numItemSet; i++) {
          var _t_itemSet = new ItemSet(this._io, this, this._root);
          _t_itemSet._read();
          this.itemSet.push(_t_itemSet);
        }
      }
      this.editorId = this._io.readU4le();
    }

    return Doodad;
  })();

  var ItemSet = W3Doo.ItemSet = (function() {
    function ItemSet(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ItemSet.prototype._read = function() {
      this.numItem = this._io.readU4le();
      this.item = [];
      for (var i = 0; i < this.numItem; i++) {
        var _t_item = new Item(this._io, this, this._root);
        _t_item._read();
        this.item.push(_t_item);
      }
    }

    return ItemSet;
  })();

  var Item = W3Doo.Item = (function() {
    function Item(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Item.prototype._read = function() {
      this.id = new W3id(this._io, this, null);
      this.id._read();
      this.chance = this._io.readU4le();
    }

    return Item;
  })();

  var SpecialDoodad = W3Doo.SpecialDoodad = (function() {
    function SpecialDoodad(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    SpecialDoodad.prototype._read = function() {
      this.id = new W3id(this._io, this, null);
      this.id._read();
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
      this.z = this._io.readF4le();
    }

    return SpecialDoodad;
  })();

  return W3Doo;
})();
return W3Doo;
}));
