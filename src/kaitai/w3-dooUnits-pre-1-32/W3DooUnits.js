// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'));
  } else {
    root.W3DooUnits = factory(root.KaitaiStream, root.W3id);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id) {
var W3DooUnits = (function() {
  W3DooUnits.AutocastActive = Object.freeze({
    INACTIVE: 0,
    ACTIVE: 1,

    0: "INACTIVE",
    1: "ACTIVE",
  });

  function W3DooUnits(_io, _parent, _root, useSkin) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;
    this.useSkin = useSkin;

  }
  W3DooUnits.prototype._read = function() {
    this.fileId = new W3id(this._io, this, null);
    this.fileId._read();
    this.version = this._io.readU4le();
    this.subVersion = this._io.readU4le();
    this.numUnit = this._io.readU4le();
    this.unit = [];
    for (var i = 0; i < this.numUnit; i++) {
      var _t_unit = new Unit(this._io, this, this._root);
      _t_unit._read();
      this.unit.push(_t_unit);
    }
  }

  var RandomBuildingItem = W3DooUnits.RandomBuildingItem = (function() {
    function RandomBuildingItem(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RandomBuildingItem.prototype._read = function() {
      this.level = this._io.readU1();
      this.unknown1 = this._io.readU1();
      this.unknown2 = this._io.readU1();
      this.itemClass = this._io.readU1();
    }

    return RandomBuildingItem;
  })();

  var Random = W3DooUnits.Random = (function() {
    function Random(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Random.prototype._read = function() {
      this.randomType = this._io.readU2le();
      this.randomTypeRest = this._io.readU2le();
      switch (this.randomType) {
      case 0:
        this.value = new RandomBuildingItem(this._io, this, this._root);
        this.value._read();
        break;
      case 1:
        this.value = new W3iGroup(this._io, this, this._root);
        this.value._read();
        break;
      case 2:
        this.value = new CustomGroup(this._io, this, this._root);
        this.value._read();
        break;
      }
    }

    return Random;
  })();

  var W3iGroup = W3DooUnits.W3iGroup = (function() {
    function W3iGroup(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    W3iGroup.prototype._read = function() {
      this.index = this._io.readU4le();
      this.columnIndex = this._io.readU4le();
    }

    return W3iGroup;
  })();

  var AbilityMod = W3DooUnits.AbilityMod = (function() {
    function AbilityMod(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    AbilityMod.prototype._read = function() {
      this.id = new W3id(this._io, this, null);
      this.id._read();
      this.autocastActive = this._io.readU4le();
      this.level = this._io.readU4le();
    }

    return AbilityMod;
  })();

  var ItemSet = W3DooUnits.ItemSet = (function() {
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

  var CustomGroup = W3DooUnits.CustomGroup = (function() {
    function CustomGroup(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    CustomGroup.prototype._read = function() {
      this.numGroupUnit = this._io.readU4le();
      this.groupUnit = [];
      for (var i = 0; i < this.numGroupUnit; i++) {
        var _t_groupUnit = new GroupUnit(this._io, this, this._root);
        _t_groupUnit._read();
        this.groupUnit.push(_t_groupUnit);
      }
    }

    return CustomGroup;
  })();

  var GroupUnit = W3DooUnits.GroupUnit = (function() {
    function GroupUnit(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    GroupUnit.prototype._read = function() {
      this.id = new W3id(this._io, this, null);
      this.id._read();
      this.chance = this._io.readU4le();
    }

    return GroupUnit;
  })();

  var Unit = W3DooUnits.Unit = (function() {
    function Unit(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Unit.prototype._read = function() {
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
      this.ownerIndex = this._io.readU4le();
      this.unknown1 = this._io.readU1();
      this.unknown2 = this._io.readU1();
      this.life = this._io.readU4le();
      this.mana = this._io.readU4le();
      if (this._root.subVersion == 11) {
        this.droppedItemSetPtr = this._io.readU4le();
      }
      this.numDroppedItemSet = this._io.readU4le();
      this.droppedItemSet = [];
      for (var i = 0; i < this.numDroppedItemSet; i++) {
        var _t_droppedItemSet = new ItemSet(this._io, this, this._root);
        _t_droppedItemSet._read();
        this.droppedItemSet.push(_t_droppedItemSet);
      }
      this.resourcesAmount = this._io.readU4le();
      this.targetAquisition = this._io.readF4le();
      this.heroLevel = this._io.readU4le();
      if (this._root.subVersion == 11) {
        this.heroStrength = this._io.readU4le();
      }
      if (this._root.subVersion == 11) {
        this.heroAgility = this._io.readU4le();
      }
      if (this._root.subVersion == 11) {
        this.heroIntelligence = this._io.readU4le();
      }
      this.numInventoryItem = this._io.readU4le();
      this.inventoryItem = [];
      for (var i = 0; i < this.numInventoryItem; i++) {
        var _t_inventoryItem = new InventoryItem(this._io, this, this._root);
        _t_inventoryItem._read();
        this.inventoryItem.push(_t_inventoryItem);
      }
      this.numAbilityMod = this._io.readU4le();
      this.abilityMod = [];
      for (var i = 0; i < this.numAbilityMod; i++) {
        var _t_abilityMod = new AbilityMod(this._io, this, this._root);
        _t_abilityMod._read();
        this.abilityMod.push(_t_abilityMod);
      }
      this.random = new Random(this._io, this, this._root);
      this.random._read();
      this.color = this._io.readU4le();
      this.waygate = this._io.readU4le();
      this.unitId = this._io.readU4le();
    }

    return Unit;
  })();

  var InventoryItem = W3DooUnits.InventoryItem = (function() {
    function InventoryItem(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    InventoryItem.prototype._read = function() {
      this.slot = this._io.readU4le();
      this.id = new W3id(this._io, this, null);
      this.id._read();
    }

    return InventoryItem;
  })();

  var Item = W3DooUnits.Item = (function() {
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

  return W3DooUnits;
})();
return W3DooUnits;
}));
