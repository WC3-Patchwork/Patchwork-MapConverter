// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'), require('./W3str'));
  } else {
    root.W3W3z = factory(root.KaitaiStream, root.W3id, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id, W3str) {
var W3W3z = (function() {
  function W3W3z(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3z.prototype._read = function() {
    this.mapPath = new W3str(this._io, this, null);
    this.mapPath._read();
    this.fill = KaitaiStream.bytesToStr(this._io.readBytes(267694), "ASCII");
    this.unitsAmount = this._io.readU4le();
    this.unit = [];
    for (var i = 0; i < 2; i++) {
      var _t_unit = new Unit(this._io, this, this._root);
      _t_unit._read();
      this.unit.push(_t_unit);
    }
  }

  var Unit = W3W3z.Unit = (function() {
    function Unit(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Unit.prototype._read = function() {
      this.firstId = new W3id(this._io, this, null);
      this.firstId._read();
      this.moreInt11 = this._io.readU4le();
      this.moreInt12 = this._io.readU4le();
      this.moreInt13 = this._io.readU4le();
      this.moreFloat4 = this._io.readF4le();
      this.moreInt14 = this._io.readU4le();
      this.moreInt15 = this._io.readU4le();
      this.moreFloat5 = this._io.readF4le();
      this.moreInt16 = this._io.readU4le();
      this.moreInt17 = this._io.readU4le();
      this.moreInt18 = this._io.readU4le();
      this.id = new W3id(this._io, this, null);
      this.id._read();
      this.primInt = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.description = new W3str(this._io, this, null);
      this.description._read();
      this.soundSet = new W3str(this._io, this, null);
      this.soundSet._read();
      this.modelPath = new W3str(this._io, this, null);
      this.modelPath._read();
      this.portraitModelPath = new W3str(this._io, this, null);
      this.portraitModelPath._read();
      this.unitType = this._io.readU4le();
      if (this.unitType > 0) {
        this.weaponPath = new W3str(this._io, this, null);
        this.weaponPath._read();
      }
      if (this.unitType > 0) {
        this.weapon2Path = new W3str(this._io, this, null);
        this.weapon2Path._read();
      }
      if (this.unitType > 1) {
        this.dunno = new W3str(this._io, this, null);
        this.dunno._read();
      }
      if (this.unitType == 0) {
        this.groundTexture = new W3str(this._io, this, null);
        this.groundTexture._read();
      }
      this.shadow = new W3str(this._io, this, null);
      this.shadow._read();
      this.shadowBuilding = new W3str(this._io, this, null);
      this.shadowBuilding._read();
      this.selectionScale1 = this._io.readF4le();
      this.selectionScale2NotConfirmed = this._io.readF4le();
      this.selectionCircleHeight = this._io.readF4le();
      this.blargh = this._io.readU4le();
      if (this.blargh > 0) {
        this.blargh2 = this._io.readF4le();
      }
      if (this.blargh2 > 0) {
        this.projectile2Arc = this._io.readF4le();
      }
      this.shadowCenterX = this._io.readF4le();
      this.shadowCenterY = this._io.readF4le();
      this.shadowCenterWidth = this._io.readF4le();
      this.shadowCenterHeight = this._io.readF4le();
      this.lessInt2 = this._io.readU4le();
      this.lessInt3 = this._io.readU4le();
      this.lessFloat5 = this._io.readF4le();
      this.lessFloat6 = this._io.readF4le();
      this.elevationPts = this._io.readU4le();
      this.elevationRadius = this._io.readF4le();
      this.lessInt5 = this._io.readU4le();
      this.red = this._io.readU1();
      this.green = this._io.readU1();
      this.blue = this._io.readU1();
      this.alpha = this._io.readU1();
      this.replaceFloat0 = this._io.readF4le();
      this.replaceFloat1 = this._io.readF4le();
      this.replaceFloat2 = this._io.readF4le();
      this.animWalkSpeed = this._io.readF4le();
      this.animRunSpeed = this._io.readF4le();
      this.someInt2 = this._io.readU4le();
      this.blendTime = this._io.readF4le();
      this.someFloat2 = this._io.readF4le();
      this.someInt3 = this._io.readU4le();
      this.someFloat3 = this._io.readF4le();
      this.someInt4 = this._io.readU4le();
      this.someFlags = this._io.readU4le();
      this.someFloat6 = this._io.readU4le();
      this.someFloat7 = this._io.readU4le();
      this.someInt5 = this._io.readU4le();
      this.someFloat8 = this._io.readU4le();
      this.spec = this._io.readU4le();
      this.head = this._io.readU4le();
      this.scoreScreenIconPath = new W3str(this._io, this, null);
      this.scoreScreenIconPath._read();
      this.soundMovement = new W3str(this._io, this, null);
      this.soundMovement._read();
      this.soundConstruction = new W3str(this._io, this, null);
      this.soundConstruction._read();
      this.soundFadeInRate = this._io.readU4le();
      this.soundFadeOutRate = this._io.readU4le();
      this.soundRandom = new W3str(this._io, this, null);
      this.soundRandom._read();
      if (this.unitType > 0) {
        this.hasCasterUpgradeArt = this._io.readU4le();
      }
      if (this.unitType > 0) {
        this.casterUpgradeArt = new W3str(this._io, this, null);
        this.casterUpgradeArt._read();
      }
      if (this.unitType > 0) {
        this.casterUpgradeNamesAmount = this._io.readU4le();
      }
      if (this.unitType > 0) {
        this.casterUpgradeName = [];
        for (var i = 0; i < this.casterUpgradeNamesAmount; i++) {
          var _t_casterUpgradeName = new W3str(this._io, this, null);
          _t_casterUpgradeName._read();
          this.casterUpgradeName.push(_t_casterUpgradeName);
        }
      }
      if (this.unitType > 0) {
        this.casterUpgradesAmount = this._io.readU4le();
      }
      if (this.unitType > 0) {
        this.casterUpgrade = [];
        for (var i = 0; i < this.casterUpgradesAmount; i++) {
          var _t_casterUpgrade = new W3str(this._io, this, null);
          _t_casterUpgrade._read();
          this.casterUpgrade.push(_t_casterUpgrade);
        }
      }
      this.hasSpecialArt = this._io.readU4le();
      if (this.hasSpecialArt == 1) {
        this.specialArt = new W3str(this._io, this, null);
        this.specialArt._read();
      }
      this.hasIcon = this._io.readU4le();
      if (this.hasIcon == 1) {
        this.iconPath = new W3str(this._io, this, null);
        this.iconPath._read();
      }
      this.fill5 = this._io.readU4le();
      this.tooltip = new W3str(this._io, this, null);
      this.tooltip._read();
      this.fill6 = this._io.readU4le();
      this.extendedTooltip = new W3str(this._io, this, null);
      this.extendedTooltip._read();
      this.moreInt = this._io.readU4le();
      this.projectileLaunchZ = this._io.readF4le();
      this.projectileLaunchZSwim = this._io.readF4le();
      this.projectileImpactZ = this._io.readF4le();
      this.projectileImpactZSwim = this._io.readF4le();
      this.moreInt4 = this._io.readU4le();
      this.moreInt5 = this._io.readU4le();
      this.moreInt6 = this._io.readU4le();
      this.moreInt7 = this._io.readU4le();
      this.weaponSound = new W3str(this._io, this, null);
      this.weaponSound._read();
      this.weaponSound2 = new W3str(this._io, this, null);
      this.weaponSound2._read();
      this.hasTargetArt = this._io.readU4le();
      if (this.hasTargetArt == 1) {
        this.targetArt = new W3str(this._io, this, null);
        this.targetArt._read();
      }
      this.moreRestInt = [];
      for (var i = 0; i < 62; i++) {
        this.moreRestInt.push(this._io.readU4le());
      }
      this.rest = [];
      for (var i = 0; i < 1; i++) {
        this.rest.push(this._io.readU1());
      }
    }

    return Unit;
  })();

  return W3W3z;
})();
return W3W3z;
}));
