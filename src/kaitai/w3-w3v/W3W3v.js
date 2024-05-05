// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'), require('./W3str'));
  } else {
    root.W3W3v = factory(root.KaitaiStream, root.W3id, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id, W3str) {
var W3W3v = (function() {
  function W3W3v(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3v.prototype._read = function() {
    this.version = this._io.readU4le();
    this.numGameCache = this._io.readU4le();
    this.gameCache = [];
    for (var i = 0; i < this.numGameCache; i++) {
      var _t_gameCache = new GameCache(this._io, this, this._root);
      _t_gameCache._read();
      this.gameCache.push(_t_gameCache);
    }
  }

  var BooleanEntry = W3W3v.BooleanEntry = (function() {
    function BooleanEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    BooleanEntry.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.value = this._io.readU4le();
    }

    return BooleanEntry;
  })();

  var RealEntry = W3W3v.RealEntry = (function() {
    function RealEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RealEntry.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.value = this._io.readF4le();
    }

    return RealEntry;
  })();

  var ItemFlags2 = W3W3v.ItemFlags2 = (function() {
    function ItemFlags2(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ItemFlags2.prototype._read = function() {
      this.flag7 = this._io.readBitsIntBe(1) != 0;
      this.flag6 = this._io.readBitsIntBe(1) != 0;
      this.pawnable = this._io.readBitsIntBe(1) != 0;
      this.flag4 = this._io.readBitsIntBe(1) != 0;
      this.useAutomaticallyWhenAcquired = this._io.readBitsIntBe(1) != 0;
      this.droppable = this._io.readBitsIntBe(1) != 0;
      this.activelyUsed = this._io.readBitsIntBe(1) != 0;
      this.flag0 = this._io.readBitsIntBe(1) != 0;
    }

    return ItemFlags2;
  })();

  var UnitEntry = W3W3v.UnitEntry = (function() {
    function UnitEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    UnitEntry.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.unitId = new W3id(this._io, this, null);
      this.unitId._read();
      this.numInventorySlot = this._io.readU4le();
      this.inventorySlot = [];
      for (var i = 0; i < this.numInventorySlot; i++) {
        var _t_inventorySlot = new InventorySlot(this._io, this, this._root);
        _t_inventorySlot._read();
        this.inventorySlot.push(_t_inventorySlot);
      }
      this.experience = this._io.readU4le();
      this.levelMinusOne = this._io.readU4le();
      this.unusedSkillPoints = this._io.readU4le();
      this.heroProperNameIndex = this._io.readU2le();
      this.unknownHeroProperNameIndex2 = this._io.readU2le();
      this.str = this._io.readU4le();
      this.strPlus = this._io.readF4le();
      this.agi = this._io.readU4le();
      this.moveSpeedIncrementFromAgi = this._io.readF4le();
      this.attackSpeedIncrementFromAgi = this._io.readF4le();
      this.agiPlus = this._io.readF4le();
      this.intelligence = this._io.readU4le();
      this.intPlus = this._io.readF4le();
      this.numHeroSkill = this._io.readU4le();
      this.heroSkill = [];
      for (var i = 0; i < this.numHeroSkill; i++) {
        var _t_heroSkill = new HeroSkill(this._io, this, this._root);
        _t_heroSkill._read();
        this.heroSkill.push(_t_heroSkill);
      }
      if (false) {
        this.unknown4 = [];
        for (var i = 0; i < 5; i++) {
          this.unknown4.push(this._io.readU4le());
        }
      }
      this.lifeIncrement = this._io.readF4le();
      this.manaIncrement = this._io.readF4le();
      this.sightRangeDay = this._io.readF4le();
      this.unknown7 = [];
      for (var i = 0; i < 4; i++) {
        this.unknown7.push(this._io.readU1());
      }
      this.atkIncrement1 = this._io.readU4le();
      this.atkIncrement2 = this._io.readU4le();
      this.armorIncrement = this._io.readF4le();
      this.unknown8 = [];
      for (var i = 0; i < 2; i++) {
        this.unknown8.push(this._io.readU1());
      }
    }

    return UnitEntry;
  })();

  var HeroSkill = W3W3v.HeroSkill = (function() {
    function HeroSkill(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    HeroSkill.prototype._read = function() {
      this.abilityId = new W3id(this._io, this, null);
      this.abilityId._read();
      this.currentLevel = this._io.readU4le();
    }

    return HeroSkill;
  })();

  var StringEntry = W3W3v.StringEntry = (function() {
    function StringEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    StringEntry.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.value = new W3str(this._io, this, null);
      this.value._read();
    }

    return StringEntry;
  })();

  var InventorySlot = W3W3v.InventorySlot = (function() {
    function InventorySlot(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    InventorySlot.prototype._read = function() {
      this.itemId = new W3id(this._io, this, null);
      this.itemId._read();
      this.charges = this._io.readU4le();
      this._raw_flags = this._io.readBytes(1);
      var _io__raw_flags = new KaitaiStream(this._raw_flags);
      this.flags = new ItemFlags(_io__raw_flags, this, this._root);
      this.flags._read();
      this._raw_flags2 = this._io.readBytes(1);
      var _io__raw_flags2 = new KaitaiStream(this._raw_flags2);
      this.flags2 = new ItemFlags2(_io__raw_flags2, this, this._root);
      this.flags2._read();
      this.flags3 = this._io.readU1();
      this.flags4 = this._io.readU1();
    }

    return InventorySlot;
  })();

  var Category = W3W3v.Category = (function() {
    function Category(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Category.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.reservedVarTypes = [];
      for (var i = 0; i < 5; i++) {
        this.reservedVarTypes.push(this._io.readU1());
      }
      this.filler = [];
      for (var i = 0; i < 15; i++) {
        this.filler.push(this._io.readU1());
      }
      this.numIntEntry = this._io.readU4le();
      this.intEntry = [];
      for (var i = 0; i < this.numIntEntry; i++) {
        var _t_intEntry = new IntEntry(this._io, this, this._root);
        _t_intEntry._read();
        this.intEntry.push(_t_intEntry);
      }
      this.numRealEntry = this._io.readU4le();
      this.realEntry = [];
      for (var i = 0; i < this.numRealEntry; i++) {
        var _t_realEntry = new RealEntry(this._io, this, this._root);
        _t_realEntry._read();
        this.realEntry.push(_t_realEntry);
      }
      this.numBooleanEntry = this._io.readU4le();
      this.booleanEntry = [];
      for (var i = 0; i < this.numBooleanEntry; i++) {
        var _t_booleanEntry = new BooleanEntry(this._io, this, this._root);
        _t_booleanEntry._read();
        this.booleanEntry.push(_t_booleanEntry);
      }
      this.numUnitEntry = this._io.readU4le();
      this.unitEntry = [];
      for (var i = 0; i < this.numUnitEntry; i++) {
        var _t_unitEntry = new UnitEntry(this._io, this, this._root);
        _t_unitEntry._read();
        this.unitEntry.push(_t_unitEntry);
      }
      this.numStringEntry = this._io.readU4le();
      this.stringEntry = [];
      for (var i = 0; i < this.numStringEntry; i++) {
        var _t_stringEntry = new StringEntry(this._io, this, this._root);
        _t_stringEntry._read();
        this.stringEntry.push(_t_stringEntry);
      }
    }

    return Category;
  })();

  var IntEntry = W3W3v.IntEntry = (function() {
    function IntEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    IntEntry.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.value = this._io.readU4le();
    }

    return IntEntry;
  })();

  var ItemFlags = W3W3v.ItemFlags = (function() {
    function ItemFlags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ItemFlags.prototype._read = function() {
      this.dropUponDeath = this._io.readBitsIntBe(1) != 0;
      this.perishable = this._io.readBitsIntBe(1) != 0;
      this.flag5 = this._io.readBitsIntBe(1) != 0;
      this.flag4 = this._io.readBitsIntBe(1) != 0;
      this.invulnerable = this._io.readBitsIntBe(1) != 0;
      this.flag2 = this._io.readBitsIntBe(1) != 0;
      this.flag1 = this._io.readBitsIntBe(1) != 0;
      this.flag0 = this._io.readBitsIntBe(1) != 0;
    }

    return ItemFlags;
  })();

  var GameCache = W3W3v.GameCache = (function() {
    function GameCache(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    GameCache.prototype._read = function() {
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.reserved = this._io.readU4le();
      this.numCategory = this._io.readU4le();
      this.category = [];
      for (var i = 0; i < this.numCategory; i++) {
        var _t_category = new Category(this._io, this, this._root);
        _t_category._read();
        this.category.push(_t_category);
      }
    }

    return GameCache;
  })();

  return W3W3v;
})();
return W3W3v;
}));
