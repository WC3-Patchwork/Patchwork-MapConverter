// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3id', './W3str', './W3char'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3id'), require('./W3str'), require('./W3char'));
  } else {
    root.W3W3i = factory(root.KaitaiStream, root.W3id, root.W3str, root.W3char);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3id, W3str, W3char) {
var W3W3i = (function() {
  W3W3i.GameDataVersion = Object.freeze({
    ROC: 0,
    TFT: 1,

    0: "ROC",
    1: "TFT",
  });

  W3W3i.Tileset = Object.freeze({
    ASHENVALE: 65,
    BARRENS: 66,
    FELWOOD: 67,
    DUNGEON: 68,
    LORDAERON_FALL: 70,
    UNDERGROUND: 71,
    ICECROWN: 73,
    DALARAN_RUINS: 74,
    BLACK_CITADEL: 75,
    LORDAERON_SUMMER: 76,
    NORTHREND: 78,
    OUTLAND: 79,
    VILLAGE_FALL: 81,
    VILLAGE: 86,
    LORDAERON_WINTER: 87,
    DALARAN: 88,
    CITYSCAPE: 89,
    SUNKEN_RUINS: 90,

    65: "ASHENVALE",
    66: "BARRENS",
    67: "FELWOOD",
    68: "DUNGEON",
    70: "LORDAERON_FALL",
    71: "UNDERGROUND",
    73: "ICECROWN",
    74: "DALARAN_RUINS",
    75: "BLACK_CITADEL",
    76: "LORDAERON_SUMMER",
    78: "NORTHREND",
    79: "OUTLAND",
    81: "VILLAGE_FALL",
    86: "VILLAGE",
    87: "LORDAERON_WINTER",
    88: "DALARAN",
    89: "CITYSCAPE",
    90: "SUNKEN_RUINS",
  });

  W3W3i.ScriptLanguage = Object.freeze({
    JASS: 0,
    LUA: 1,

    0: "JASS",
    1: "LUA",
  });

  W3W3i.PlayerController = Object.freeze({
    NONE: 0,
    HUMAN: 1,
    CPU: 2,
    NEUTRAL: 3,
    RESCUABLE: 4,

    0: "NONE",
    1: "HUMAN",
    2: "CPU",
    3: "NEUTRAL",
    4: "RESCUABLE",
  });

  W3W3i.RandomUnitTableColumnType = Object.freeze({
    UNIT_TABLE: 0,
    BUILDING_TABLE: 1,
    ITEM_TABLE: 2,

    0: "UNIT_TABLE",
    1: "BUILDING_TABLE",
    2: "ITEM_TABLE",
  });

  W3W3i.FogType = Object.freeze({
    LINEAR: 0,
    EXP: 1,
    EXP2: 2,

    0: "LINEAR",
    1: "EXP",
    2: "EXP2",
  });

  W3W3i.GameDataSet = Object.freeze({
    DEFAULT: 0,
    CUSTOM: 1,
    MELEE: 2,

    0: "DEFAULT",
    1: "CUSTOM",
    2: "MELEE",
  });

  W3W3i.PlayerRace = Object.freeze({
    SELECTABLE: 0,
    HUMAN: 1,
    ORC: 2,
    UNDEAD: 3,
    NIGHT_ELF: 4,

    0: "SELECTABLE",
    1: "HUMAN",
    2: "ORC",
    3: "UNDEAD",
    4: "NIGHT_ELF",
  });

  function W3W3i(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3W3i.prototype._read = function() {
    this.version = this._io.readU4le();
    if (this.version >= 16) {
      this.saves = this._io.readU4le();
    }
    if (this.version >= 16) {
      this.editorVersion = this._io.readU4le();
    }
    if (this.version >= 27) {
      this.gameVersion = new GameVersion(this._io, this, this._root);
      this.gameVersion._read();
    }
    this.mapNameRaw = new W3str(this._io, this, null);
    this.mapNameRaw._read();
    this.author = new W3str(this._io, this, null);
    this.author._read();
    this.description = new W3str(this._io, this, null);
    this.description._read();
    if (this.version >= 8) {
      this.recommendedPlayers = new W3str(this._io, this, null);
      this.recommendedPlayers._read();
    }
    if (this.version <= 3) {
      this.unknownV0ToV3 = new UnknownV0ToV3(this._io, this, this._root);
      this.unknownV0ToV3._read();
    }
    if ( ((this.version > 3) && (this.version <= 8)) ) {
      this.unknownV4ToV8 = new UnknownV4ToV8(this._io, this, this._root);
      this.unknownV4ToV8._read();
    }
    this.cameraBounds = new CameraBounds(this._io, this, this._root);
    this.cameraBounds._read();
    if (this.version >= 14) {
      this.margins = new Margins(this._io, this, this._root);
      this.margins._read();
    }
    if (this.version >= 1) {
      this.mapWidth = this._io.readU4le();
    }
    if (this.version >= 1) {
      this.mapHeight = this._io.readU4le();
    }
    if ( ((this.version >= 2) && (this.version <= 8)) ) {
      this.unknownV3Int1 = this._io.readU4le();
    }
    if (this.version >= 2) {
      this.flags = new Flags(this._io, this, this._root);
      this.flags._read();
    }
    if (this.version >= 8) {
      this.tileset = this._io.readU1();
    }
    this.loadingScreen = new LoadingScreen(this._io, this, this._root);
    this.loadingScreen._read();
    if (this.version >= 17) {
      this.gameDataSet = this._io.readU4le();
    }
    if (this.version <= 17) {
      this.unknownPath = new W3str(this._io, this, null);
      this.unknownPath._read();
    }
    if (this.version >= 13) {
      this.prologueScreen = new PrologueScreen(this._io, this, this._root);
      this.prologueScreen._read();
    }
    if (this.version >= 19) {
      this.fog = new Fog(this._io, this, this._root);
      this.fog._read();
    }
    if (this.version >= 21) {
      this.globalWeatherId = new W3id(this._io, this, null);
      this.globalWeatherId._read();
    }
    if (this.version >= 22) {
      this.soundEnvironment = new W3str(this._io, this, null);
      this.soundEnvironment._read();
    }
    if (this.version >= 23) {
      this.lightEnvironment = new W3char(this._io, this, null);
      this.lightEnvironment._read();
    }
    if (this.version >= 25) {
      this.waterColor = new WaterColor(this._io, this, this._root);
      this.waterColor._read();
    }
    if (this.version >= 28) {
      this.scriptLanguage = this._io.readU4le();
    }
    if (this.version >= 29) {
      this._raw_supportedGraphicsModes = this._io.readBytes(4);
      var _io__raw_supportedGraphicsModes = new KaitaiStream(this._raw_supportedGraphicsModes);
      this.supportedGraphicsModes = new GraphicsModes(_io__raw_supportedGraphicsModes, this, this._root);
      this.supportedGraphicsModes._read();
    }
    if (this.version >= 30) {
      this.gameDataVersion = this._io.readU4le();
    }
    this.playersChunk = new PlayersChunk(this._io, this, this._root);
    this.playersChunk._read();
    this.forcesChunk = new ForcesChunk(this._io, this, this._root);
    this.forcesChunk._read();
    if (this.version >= 6) {
      this.upgradesChunk = new UpgradesChunk(this._io, this, this._root);
      this.upgradesChunk._read();
    }
    if (this.version >= 7) {
      this.techsChunk = new TechsChunk(this._io, this, this._root);
      this.techsChunk._read();
    }
    if (this.version >= 12) {
      this.randomUnitTablesChunk = new RandomUnitTablesChunk(this._io, this, this._root);
      this.randomUnitTablesChunk._read();
    }
    if (this.version >= 24) {
      this.randomItemTablesChunk = new RandomItemTablesChunk(this._io, this, this._root);
      this.randomItemTablesChunk._read();
    }
    if ( ((this.version == 26) || (this.version == 27)) ) {
      this.scriptLanguage2 = this._io.readU4le();
    }
  }

  var WaterColor = W3W3i.WaterColor = (function() {
    function WaterColor(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    WaterColor.prototype._read = function() {
      this.red = this._io.readU1();
      this.green = this._io.readU1();
      this.blue = this._io.readU1();
      this.alpha = this._io.readU1();
    }

    /**
     * red value 0-255
     */

    /**
     * green value 0-255
     */

    /**
     * blue value 0-255
     */

    /**
     * alpha value 0-255
     */

    return WaterColor;
  })();

  var PlayerBitmap = W3W3i.PlayerBitmap = (function() {
    function PlayerBitmap(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PlayerBitmap.prototype._read = function() {
      this._raw_bits = this._io.readBytes(4);
      var _io__raw_bits = new KaitaiStream(this._raw_bits);
      this.bits = new PlayerBitmapBits(_io__raw_bits, this, this._root);
      this.bits._read();
    }

    return PlayerBitmap;
  })();

  var CameraBounds = W3W3i.CameraBounds = (function() {
    function CameraBounds(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    CameraBounds.prototype._read = function() {
      this.cameraBoundBottomLeft = new Point2d(this._io, this, this._root);
      this.cameraBoundBottomLeft._read();
      this.cameraBoundTopRight = new Point2d(this._io, this, this._root);
      this.cameraBoundTopRight._read();
      this.cameraBoundTopLeft = new Point2d(this._io, this, this._root);
      this.cameraBoundTopLeft._read();
      this.cameraBoundBottomRight = new Point2d(this._io, this, this._root);
      this.cameraBoundBottomRight._read();
    }

    return CameraBounds;
  })();

  var Force = W3W3i.Force = (function() {
    function Force(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Force.prototype._read = function() {
      this.flags = new ForceFlags(this._io, this, this._root);
      this.flags._read();
      this.players = new PlayerBitmap(this._io, this, this._root);
      this.players._read();
      this.name = new W3str(this._io, this, null);
      this.name._read();
    }

    return Force;
  })();

  var GraphicsModes = W3W3i.GraphicsModes = (function() {
    function GraphicsModes(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    GraphicsModes.prototype._read = function() {
      this.rest = [];
      for (var i = 0; i < 6; i++) {
        this.rest.push(this._io.readBitsIntBe(1) != 0);
      }
      this.sd = this._io.readBitsIntBe(1) != 0;
      this.hd = this._io.readBitsIntBe(1) != 0;
    }

    return GraphicsModes;
  })();

  var UnknownV0ToV3 = W3W3i.UnknownV0ToV3 = (function() {
    function UnknownV0ToV3(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    UnknownV0ToV3.prototype._read = function() {
      this.unknownV0Int1 = this._io.readU4le();
      this.unknownV0Int2 = this._io.readU4le();
    }

    return UnknownV0ToV3;
  })();

  var UnknownV4ToV8 = W3W3i.UnknownV4ToV8 = (function() {
    function UnknownV4ToV8(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    UnknownV4ToV8.prototype._read = function() {
      this.unknownV4Int1 = this._io.readU4le();
      this.unknownV4Int2 = this._io.readU4le();
      this.unknownV4Int3 = this._io.readU4le();
      this.unknownV4Float1 = this._io.readF4le();
      this.unknownV4Float2 = this._io.readF4le();
      this.unknownV4Float3 = this._io.readF4le();
    }

    return UnknownV4ToV8;
  })();

  var ForcesChunk = W3W3i.ForcesChunk = (function() {
    function ForcesChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ForcesChunk.prototype._read = function() {
      this.numForce = this._io.readU4le();
      this.force = [];
      for (var i = 0; i < this.numForce; i++) {
        var _t_force = new Force(this._io, this, this._root);
        _t_force._read();
        this.force.push(_t_force);
      }
    }

    return ForcesChunk;
  })();

  var Flags = W3W3i.Flags = (function() {
    function Flags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Flags.prototype._read = function() {
      this.useCustomTechs = this._io.readBitsIntBe(1) != 0;
      this.useCustomTeams = this._io.readBitsIntBe(1) != 0;
      this.fixedPlayerParametersForCustomTeams = this._io.readBitsIntBe(1) != 0;
      this.unexploredAreasPartiallyVisible = this._io.readBitsIntBe(1) != 0;
      this.nonDefaultTilesetMapSizeLargeNeverBeenReducedToMedium = this._io.readBitsIntBe(1) != 0;
      this.melee = this._io.readBitsIntBe(1) != 0;
      this.changeAllyPriorities = this._io.readBitsIntBe(1) != 0;
      this.hideMinimapOnPreviewScreens = this._io.readBitsIntBe(1) != 0;
      this.useItemClassificationSystem = this._io.readBitsIntBe(1) != 0;
      this.tftRequired = this._io.readBitsIntBe(1) != 0;
      this.useTerrainFog = this._io.readBitsIntBe(1) != 0;
      this.showWaterWavesOnRollingShores = this._io.readBitsIntBe(1) != 0;
      this.showWaterWavesOnCliffShores = this._io.readBitsIntBe(1) != 0;
      this.mapPropertiesMenuOpenedAtLeastOnce = this._io.readBitsIntBe(1) != 0;
      this.useCustomUpgrades = this._io.readBitsIntBe(1) != 0;
      this.useCustomAbilities = this._io.readBitsIntBe(1) != 0;
      this.customWaterTintColor = this._io.readBitsIntBe(1) != 0;
      this.flag17 = this._io.readBitsIntBe(1) != 0;
      this.flag18 = this._io.readBitsIntBe(1) != 0;
      this.flag19 = this._io.readBitsIntBe(1) != 0;
      this.flag20 = this._io.readBitsIntBe(1) != 0;
      this.useCustomAbilitySkin = this._io.readBitsIntBe(1) != 0;
      this.useAccurateProbabilitiesForCalculation = this._io.readBitsIntBe(1) != 0;
      this.rest = [];
      for (var i = 0; i < 8; i++) {
        this.rest.push(this._io.readBitsIntBe(1) != 0);
      }
    }

    return Flags;
  })();

  var PlayersChunk = W3W3i.PlayersChunk = (function() {
    function PlayersChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PlayersChunk.prototype._read = function() {
      this.numPlayer = this._io.readU4le();
      this.player = [];
      for (var i = 0; i < this.numPlayer; i++) {
        var _t_player = new Player(this._io, this, this._root);
        _t_player._read();
        this.player.push(_t_player);
      }
    }

    return PlayersChunk;
  })();

  var UpgradesChunk = W3W3i.UpgradesChunk = (function() {
    function UpgradesChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    UpgradesChunk.prototype._read = function() {
      this.numUpgrade = this._io.readU4le();
      this.upgrade = [];
      for (var i = 0; i < this.numUpgrade; i++) {
        var _t_upgrade = new Upgrade(this._io, this, this._root);
        _t_upgrade._read();
        this.upgrade.push(_t_upgrade);
      }
    }

    return UpgradesChunk;
  })();

  var Margins = W3W3i.Margins = (function() {
    function Margins(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Margins.prototype._read = function() {
      this.left = this._io.readS4le();
      this.right = this._io.readS4le();
      this.bottom = this._io.readS4le();
      this.top = this._io.readS4le();
    }

    return Margins;
  })();

  var Fog = W3W3i.Fog = (function() {
    function Fog(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Fog.prototype._read = function() {
      this.fogType = this._io.readU4le();
      this.fogZStart = this._io.readF4le();
      this.fogZEnd = this._io.readF4le();
      this.fogDensity = this._io.readF4le();
      this.fogColorRed = this._io.readU1();
      this.fogColorGreen = this._io.readU1();
      this.fogColorBlue = this._io.readU1();
      this.fogColorAlpha = this._io.readU1();
    }

    return Fog;
  })();

  var RandomUnitTable = W3W3i.RandomUnitTable = (function() {
    function RandomUnitTable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RandomUnitTable.prototype._read = function() {
      this.index = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.numColumnType = this._io.readU4le();
      this.columnType = [];
      for (var i = 0; i < this.numColumnType; i++) {
        this.columnType.push(this._io.readU4le());
      }
      this.numRow = this._io.readU4le();
      this.row = [];
      for (var i = 0; i < this.numRow; i++) {
        var _t_row = new RandomUnitTableRow(this._io, this, this._root);
        _t_row._read();
        this.row.push(_t_row);
      }
    }

    return RandomUnitTable;
  })();

  var ForceFlagsBits = W3W3i.ForceFlagsBits = (function() {
    function ForceFlagsBits(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ForceFlagsBits.prototype._read = function() {
      this.flag7 = this._io.readBitsIntBe(1) != 0;
      this.flag6 = this._io.readBitsIntBe(1) != 0;
      this.flag5 = this._io.readBitsIntBe(1) != 0;
      this.shareAdvancedUnitControl = this._io.readBitsIntBe(1) != 0;
      this.shareUnitControl = this._io.readBitsIntBe(1) != 0;
      this.shareVision = this._io.readBitsIntBe(1) != 0;
      this.alliedVictory = this._io.readBitsIntBe(1) != 0;
      this.allied = this._io.readBitsIntBe(1) != 0;
      this._io.alignToByte();
      this.rest = [];
      for (var i = 0; i < 3; i++) {
        this.rest.push(this._io.readU1());
      }
    }

    return ForceFlagsBits;
  })();

  var Point2d = W3W3i.Point2d = (function() {
    function Point2d(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Point2d.prototype._read = function() {
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
    }

    return Point2d;
  })();

  var TechsChunk = W3W3i.TechsChunk = (function() {
    function TechsChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    TechsChunk.prototype._read = function() {
      this.numTech = this._io.readU4le();
      this.tech = [];
      for (var i = 0; i < this.numTech; i++) {
        var _t_tech = new Tech(this._io, this, this._root);
        _t_tech._read();
        this.tech.push(_t_tech);
      }
    }

    return TechsChunk;
  })();

  var ItemSet = W3W3i.ItemSet = (function() {
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

  var Player = W3W3i.Player = (function() {
    function Player(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Player.prototype._read = function() {
      this.num = this._io.readU4le();
      this.controller = this._io.readU4le();
      this.race = this._io.readU4le();
      this.fixedPosition = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.position = new Point2d(this._io, this, this._root);
      this.position._read();
      if (this._root.version >= 5) {
        this.allyLowPriority = new PlayerBitmap(this._io, this, this._root);
        this.allyLowPriority._read();
      }
      if (this._root.version >= 5) {
        this.allyHighPriority = new PlayerBitmap(this._io, this, this._root);
        this.allyHighPriority._read();
      }
      if (this._root.version >= 31) {
        this.enemyLowPriority = new PlayerBitmap(this._io, this, this._root);
        this.enemyLowPriority._read();
      }
      if (this._root.version >= 31) {
        this.enemyHighPriority = new PlayerBitmap(this._io, this, this._root);
        this.enemyHighPriority._read();
      }
    }

    return Player;
  })();

  var RandomItemTable = W3W3i.RandomItemTable = (function() {
    function RandomItemTable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RandomItemTable.prototype._read = function() {
      this.num = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.numSet = this._io.readU4le();
      this.set = [];
      for (var i = 0; i < this.numSet; i++) {
        var _t_set = new ItemSet(this._io, this, this._root);
        _t_set._read();
        this.set.push(_t_set);
      }
    }

    return RandomItemTable;
  })();

  var Tech = W3W3i.Tech = (function() {
    function Tech(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Tech.prototype._read = function() {
      this.players = this._io.readU4le();
      this.id = new W3id(this._io, this, null);
      this.id._read();
    }

    return Tech;
  })();

  var RandomUnitTableRow = W3W3i.RandomUnitTableRow = (function() {
    function RandomUnitTableRow(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RandomUnitTableRow.prototype._read = function() {
      this.chance = this._io.readU4le();
      this.id = [];
      for (var i = 0; i < this._parent.numColumnType; i++) {
        var _t_id = new W3id(this._io, this, null);
        _t_id._read();
        this.id.push(_t_id);
      }
    }

    return RandomUnitTableRow;
  })();

  var RandomItemTablesChunk = W3W3i.RandomItemTablesChunk = (function() {
    function RandomItemTablesChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RandomItemTablesChunk.prototype._read = function() {
      this.numTable = this._io.readU4le();
      this.table = [];
      for (var i = 0; i < this.numTable; i++) {
        var _t_table = new RandomItemTable(this._io, this, this._root);
        _t_table._read();
        this.table.push(_t_table);
      }
    }

    return RandomItemTablesChunk;
  })();

  var PrologueScreen = W3W3i.PrologueScreen = (function() {
    function PrologueScreen(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PrologueScreen.prototype._read = function() {
      if ( ((this._root.version != 18) && (this._root.version != 19)) ) {
        this.prologueScreenPath = new W3str(this._io, this, null);
        this.prologueScreenPath._read();
      }
      this.prologueScreenText = new W3str(this._io, this, null);
      this.prologueScreenText._read();
      this.prologueScreenTitle = new W3str(this._io, this, null);
      this.prologueScreenTitle._read();
      this.prologueScreenSubtitle = new W3str(this._io, this, null);
      this.prologueScreenSubtitle._read();
    }

    return PrologueScreen;
  })();

  var Upgrade = W3W3i.Upgrade = (function() {
    function Upgrade(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Upgrade.prototype._read = function() {
      this.players = this._io.readU4le();
      this.id = new W3id(this._io, this, null);
      this.id._read();
      this.level = this._io.readU4le();
      this.availability = this._io.readU4le();
    }

    return Upgrade;
  })();

  var ForceFlags = W3W3i.ForceFlags = (function() {
    function ForceFlags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ForceFlags.prototype._read = function() {
      this._raw_bits = this._io.readBytes(4);
      var _io__raw_bits = new KaitaiStream(this._raw_bits);
      this.bits = new ForceFlagsBits(_io__raw_bits, this, this._root);
      this.bits._read();
    }

    return ForceFlags;
  })();

  var GameVersion = W3W3i.GameVersion = (function() {
    function GameVersion(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    GameVersion.prototype._read = function() {
      this.major = this._io.readU4le();
      this.minor = this._io.readU4le();
      this.revision = this._io.readU4le();
      this.build = this._io.readU4le();
    }

    return GameVersion;
  })();

  var LoadingScreen = W3W3i.LoadingScreen = (function() {
    function LoadingScreen(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    LoadingScreen.prototype._read = function() {
      if (this._root.version >= 17) {
        this.loadingScreenIndex = this._io.readS4le();
      }
      if ( ((this._root.version >= 10) && (this._root.version != 18) && (this._root.version != 19)) ) {
        this.customLoadingScreenPath = new W3str(this._io, this, null);
        this.customLoadingScreenPath._read();
      }
      if (this._root.version >= 10) {
        this.loadingScreenText = new W3str(this._io, this, null);
        this.loadingScreenText._read();
      }
      if (this._root.version >= 11) {
        this.loadingScreenTitle = new W3str(this._io, this, null);
        this.loadingScreenTitle._read();
      }
      if (this._root.version >= 11) {
        this.loadingScreenSubtitle = new W3str(this._io, this, null);
        this.loadingScreenSubtitle._read();
      }
    }

    return LoadingScreen;
  })();

  var RandomUnitTablesChunk = W3W3i.RandomUnitTablesChunk = (function() {
    function RandomUnitTablesChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    RandomUnitTablesChunk.prototype._read = function() {
      this.numTable = this._io.readU4le();
      this.table = [];
      for (var i = 0; i < this.numTable; i++) {
        var _t_table = new RandomUnitTable(this._io, this, this._root);
        _t_table._read();
        this.table.push(_t_table);
      }
    }

    return RandomUnitTablesChunk;
  })();

  var PlayerBitmapBits = W3W3i.PlayerBitmapBits = (function() {
    function PlayerBitmapBits(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    PlayerBitmapBits.prototype._read = function() {
      this.isMember = [];
      for (var i = 0; i < 32; i++) {
        this.isMember.push(this._io.readBitsIntBe(1) != 0);
      }
    }

    return PlayerBitmapBits;
  })();

  var Item = W3W3i.Item = (function() {
    function Item(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Item.prototype._read = function() {
      this.chance = this._io.readU4le();
      this.id = new W3id(this._io, this, null);
      this.id._read();
    }

    /**
     * Chance this item will be rolled.
     */

    /**
     * FourCC of the item, can be iRND for random item.
     */

    return Item;
  })();

  /**
   * Name of the map.
   */
  Object.defineProperty(W3W3i.prototype, 'mapName', {
    get: function() {
      if (this._m_mapName !== undefined)
        return this._m_mapName;
      this._m_mapName = this.mapNameRaw.value;
      return this._m_mapName;
    }
  });

  /**
   * The version of the format.
   */

  /**
   * How many times the map was saved in the editor.
   */

  /**
   * What version of the editor was used to make this file.
   */

  /**
   * For what version of the game this file was made.
   */

  return W3W3i;
})();
return W3W3i;
}));
