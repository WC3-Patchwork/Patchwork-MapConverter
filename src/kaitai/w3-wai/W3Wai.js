// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', './W3W3o', './W3id', './W3str'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./W3W3o'), require('./W3id'), require('./W3str'));
  } else {
    root.W3Wai = factory(root.KaitaiStream, root.W3W3o, root.W3id, root.W3str);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream, W3W3o, W3id, W3str) {
var W3Wai = (function() {
  W3Wai.ParameterType = Object.freeze({
    PRESET: 0,
    OPERATOR_FUNCTION: 1,
    FUNCTION: 2,
    STRING: 3,

    0: "PRESET",
    1: "OPERATOR_FUNCTION",
    2: "FUNCTION",
    3: "STRING",
  });

  W3Wai.BuildPriorityTechType = Object.freeze({
    UNIT: 0,
    UPGRADE: 1,
    EXPANSION_TOWN: 2,

    0: "UNIT",
    1: "UPGRADE",
    2: "EXPANSION_TOWN",
  });

  W3Wai.AiRace = Object.freeze({
    CUSTOM: 0,
    HUMAN: 1,
    ORC: 2,
    UNDEAD: 3,
    NIGHT_ELF: 4,

    0: "CUSTOM",
    1: "HUMAN",
    2: "ORC",
    3: "UNDEAD",
    4: "NIGHT_ELF",
  });

  W3Wai.BuildPriorityConditionIndex = Object.freeze({
    CUSTOM: 4294967294,
    NONE: 4294967295,

    4294967294: "CUSTOM",
    4294967295: "NONE",
  });

  W3Wai.PlayerRace = Object.freeze({
    HUMAN: 0,
    ORC: 2,
    NIGHT_ELF: 4,
    UNDEAD: 8,
    RANDOM: 20,

    0: "HUMAN",
    2: "ORC",
    4: "NIGHT_ELF",
    8: "UNDEAD",
    20: "RANDOM",
  });

  W3Wai.AiDifficulty = Object.freeze({
    EASY: 0,
    NORMAL: 1,
    INSANE: 2,

    0: "EASY",
    1: "NORMAL",
    2: "INSANE",
  });

  W3Wai.AllowFlyers = Object.freeze({
    FALSE: 0,
    TRUE: 1,

    0: "FALSE",
    1: "TRUE",
  });

  W3Wai.Ai = Object.freeze({
    STANDARD: 0,
    USER: 1,
    CUSTOM: 4,
    CURRENT: 12,

    0: "STANDARD",
    1: "USER",
    4: "CUSTOM",
    12: "CURRENT",
  });

  W3Wai.Target = Object.freeze({
    COMMON_ALLIANCE_TARGET: 0,
    NEW_EXPANSION_LOCATION: 1,
    ENEMY_MAJOR_ASSAULT: 2,
    ENEMY_EXPANSION: 3,
    ENEMY_ANY_TOWN: 4,
    CREEP_CAMP: 5,
    PURCHASE_GOBLIN_ZEPPELIN: 6,

    0: "COMMON_ALLIANCE_TARGET",
    1: "NEW_EXPANSION_LOCATION",
    2: "ENEMY_MAJOR_ASSAULT",
    3: "ENEMY_EXPANSION",
    4: "ENEMY_ANY_TOWN",
    5: "CREEP_CAMP",
    6: "PURCHASE_GOBLIN_ZEPPELIN",
  });

  W3Wai.HarvestType = Object.freeze({
    GOLD: 0,
    LUMBER: 1,

    0: "GOLD",
    1: "LUMBER",
  });

  W3Wai.BuildPriorityTarget = Object.freeze({
    MAIN: 0,
    EXPANSION_1: 1,
    EXPANSION_2: 2,
    EXPANSION_3: 3,
    EXPANSION_4: 4,
    EXPANSION_5: 5,
    EXPANSION_6: 6,
    EXPANSION_7: 7,
    EXPANSION_8: 8,
    EXPANSION_9: 9,
    MINE_9: 4294967285,
    MINE_8: 4294967286,
    MINE_7: 4294967287,
    MINE_6: 4294967288,
    MINE_5: 4294967289,
    MINE_4: 4294967290,
    MINE_3: 4294967291,
    MINE_2: 4294967292,
    MINE_1: 4294967293,
    ANY: 4294967295,

    0: "MAIN",
    1: "EXPANSION_1",
    2: "EXPANSION_2",
    3: "EXPANSION_3",
    4: "EXPANSION_4",
    5: "EXPANSION_5",
    6: "EXPANSION_6",
    7: "EXPANSION_7",
    8: "EXPANSION_8",
    9: "EXPANSION_9",
    4294967285: "MINE_9",
    4294967286: "MINE_8",
    4294967287: "MINE_7",
    4294967288: "MINE_6",
    4294967289: "MINE_5",
    4294967290: "MINE_4",
    4294967291: "MINE_3",
    4294967292: "MINE_2",
    4294967293: "MINE_1",
    4294967295: "ANY",
  });

  W3Wai.ConditionType = Object.freeze({
    NONE: 0,
    USED: 1,

    0: "NONE",
    1: "USED",
  });

  function W3Wai(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

  }
  W3Wai.prototype._read = function() {
    this.version = this._io.readU4le();
    this.name = new W3str(this._io, this, null);
    this.name._read();
    this.race = this._io.readU4le();
    this._raw_flags = this._io.readBytes(4);
    var _io__raw_flags = new KaitaiStream(this._raw_flags);
    this.flags = new Flags(_io__raw_flags, this, this._root);
    this.flags._read();
    this.numPeonsAndBuildings = this._io.readU4le();
    this.goldWorker = new W3id(this._io, this, null);
    this.goldWorker._read();
    this.lumberWorker = new W3id(this._io, this, null);
    this.lumberWorker._read();
    this.baseBuilding = new W3id(this._io, this, null);
    this.baseBuilding._read();
    this.mineBuilding = new W3id(this._io, this, null);
    this.mineBuilding._read();
    this.numCondition = this._io.readU4le();
    this.unknown = this._io.readU4le();
    this.condition = [];
    for (var i = 0; i < this.numCondition; i++) {
      var _t_condition = new Condition(this._io, this, this._root);
      _t_condition._read();
      this.condition.push(_t_condition);
    }
    this.firstHero = new W3id(this._io, this, null);
    this.firstHero._read();
    this.secondHero = new W3id(this._io, this, null);
    this.secondHero._read();
    this.thirdHero = new W3id(this._io, this, null);
    this.thirdHero._read();
    this.trainingChanceFirstSecondThird = this._io.readU4le();
    this.trainingChanceFirstThirdSecond = this._io.readU4le();
    this.trainingChanceSecondFirstThird = this._io.readU4le();
    this.trainingChanceSecondThirdFirst = this._io.readU4le();
    this.trainingChanceThirdFirstSecond = this._io.readU4le();
    this.trainingChanceThirdSecondFirst = this._io.readU4le();
    this.skillChunk = new SkillChunk(this._io, this, this._root);
    this.skillChunk._read();
    this.numBuildPriority = this._io.readU4le();
    this.buildPriority = [];
    for (var i = 0; i < this.numBuildPriority; i++) {
      var _t_buildPriority = new BuildPriority(this._io, this, this._root);
      _t_buildPriority._read();
      this.buildPriority.push(_t_buildPriority);
    }
    this.numHarvestPriority = this._io.readU4le();
    this.harvestPriority = [];
    for (var i = 0; i < this.numHarvestPriority; i++) {
      var _t_harvestPriority = new HarvestPriority(this._io, this, this._root);
      _t_harvestPriority._read();
      this.harvestPriority.push(_t_harvestPriority);
    }
    this.numTargetPriority = this._io.readU4le();
    this.targetPriority = [];
    for (var i = 0; i < this.numTargetPriority; i++) {
      var _t_targetPriority = new TargetPriority(this._io, this, this._root);
      _t_targetPriority._read();
      this.targetPriority.push(_t_targetPriority);
    }
    this.repeatWaves = this._io.readU4le();
    this.minimumForcesAttackGroupIndex = this._io.readU4le();
    this.initialDelay = this._io.readU4le();
    this.numAttackGroup = this._io.readU4le();
    this.attackGroup = [];
    for (var i = 0; i < this.numAttackGroup; i++) {
      var _t_attackGroup = new AttackGroup(this._io, this, this._root);
      _t_attackGroup._read();
      this.attackGroup.push(_t_attackGroup);
    }
    this.numAttackWave = this._io.readU4le();
    this.attackWave = [];
    for (var i = 0; i < this.numAttackWave; i++) {
      var _t_attackWave = new AttackWave(this._io, this, this._root);
      _t_attackWave._read();
      this.attackWave.push(_t_attackWave);
    }
    this.unknown2 = this._io.readU4le();
    this.gameOptions = new GameOptions(this._io, this, this._root);
    this.gameOptions._read();
    this.regularGameSpeed = this._io.readU4le();
    this.mapPath = new W3str(this._io, this, null);
    this.mapPath._read();
    this.numPlayer = this._io.readU4le();
    this.player = [];
    for (var i = 0; i < this.numPlayer; i++) {
      var _t_player = new Player(this._io, this, this._root);
      _t_player._read();
      this.player.push(_t_player);
    }
    this.useImportObj = this._io.readU4le();
    this.importObj = new ImportObj(this._io, this, this._root);
    this.importObj._read();
    this.w3o = new W3W3o(this._io, this, null);
    this.w3o._read();
  }

  var OperatorFunctionParameterExt = W3Wai.OperatorFunctionParameterExt = (function() {
    function OperatorFunctionParameterExt(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    OperatorFunctionParameterExt.prototype._read = function() {
      this.beginFunction = this._io.readU4le();
      this.parameterList = new ParameterList(this._io, this, this._root, 0);
      this.parameterList._read();
      this.endFunction = this._io.readU4le();
    }

    return OperatorFunctionParameterExt;
  })();

  var TargetPriority = W3Wai.TargetPriority = (function() {
    function TargetPriority(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    TargetPriority.prototype._read = function() {
      this.priorityType = this._io.readU4le();
      this.target = this._io.readU4le();
      this.creepMinStrength = this._io.readU4le();
      if (this.target == W3Wai.Target.CREEP_CAMP) {
        this.creepMaxStrength = this._io.readU4le();
      }
      if (this.target == W3Wai.Target.CREEP_CAMP) {
        this.allowFlyers = this._io.readU4le();
      }
      this.conditionIndex = this._io.readU4le();
      if (this.target == W3Wai.Target.CREEP_CAMP) {
        this.fill2 = [];
        for (var i = 0; i < 4; i++) {
          this.fill2.push(this._io.readU1());
        }
      }
      this.fill = [];
      for (var i = 0; i < 1; i++) {
        this.fill.push(this._io.readU1());
      }
    }

    return TargetPriority;
  })();

  var Parameter = W3Wai.Parameter = (function() {
    function Parameter(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Parameter.prototype._read = function() {
      this.type = this._io.readU4le();
      this.value = new W3str(this._io, this, null);
      this.value._read();
      this.beginFunction = this._io.readU4le();
      if ( ((this.type == W3Wai.ParameterType.FUNCTION) && (this.value.value == "")) ) {
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
      }
      if ( ((this.type == W3Wai.ParameterType.FUNCTION) && (this.value.value != "")) ) {
        this.functionParameterExt = new FunctionParameterExt(this._io, this, this._root);
        this.functionParameterExt._read();
      }
      if (this.type == W3Wai.ParameterType.OPERATOR_FUNCTION) {
        this.parameterListOp = new ParameterList(this._io, this, this._root, 3);
        this.parameterListOp._read();
      }
      this.endFunction = this._io.readU4le();
    }

    return Parameter;
  })();

  var Flags = W3Wai.Flags = (function() {
    function Flags(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Flags.prototype._read = function() {
      this.defendUsers = this._io.readBitsIntBe(1) != 0;
      this.randomPaths = this._io.readBitsIntBe(1) != 0;
      this.setPlayerName = this._io.readBitsIntBe(1) != 0;
      this.removeInjuries = this._io.readBitsIntBe(1) != 0;
      this.smartArtillery = this._io.readBitsIntBe(1) != 0;
      this.allowHomeChanges = this._io.readBitsIntBe(1) != 0;
      this.slowHarvesting = this._io.readBitsIntBe(1) != 0;
      this.takeItems = this._io.readBitsIntBe(1) != 0;
      this.ignoreInjuries = this._io.readBitsIntBe(1) != 0;
      this.haveNoMercy = this._io.readBitsIntBe(1) != 0;
      this.groupsFlee = this._io.readBitsIntBe(1) != 0;
      this.unitsFlee = this._io.readBitsIntBe(1) != 0;
      this.heroesFlee = this._io.readBitsIntBe(1) != 0;
      this.repairStructures = this._io.readBitsIntBe(1) != 0;
      this.targetHeroes = this._io.readBitsIntBe(1) != 0;
      this.melee = this._io.readBitsIntBe(1) != 0;
      this.rest = [];
      for (var i = 0; i < 15; i++) {
        this.rest.push(this._io.readBitsIntBe(1) != 0);
      }
      this.buyItems = this._io.readBitsIntBe(1) != 0;
    }

    return Flags;
  })();

  var GameOptions = W3Wai.GameOptions = (function() {
    function GameOptions(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    GameOptions.prototype._read = function() {
      this.rest = [];
      for (var i = 0; i < 6; i++) {
        this.rest.push(this._io.readBitsIntBe(1) != 0);
      }
      this.disableVictoryDefeatConditions = this._io.readBitsIntBe(1) != 0;
      this.disableFogOfWar = this._io.readBitsIntBe(1) != 0;
      this.rest2 = [];
      for (var i = 0; i < 24; i++) {
        this.rest2.push(this._io.readBitsIntBe(1) != 0);
      }
    }

    return GameOptions;
  })();

  var ConditionWithoutIndex = W3Wai.ConditionWithoutIndex = (function() {
    function ConditionWithoutIndex(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ConditionWithoutIndex.prototype._read = function() {
      this.name = KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "UTF-8");
      this.type = this._io.readU4le();
      if (this.type == W3Wai.ConditionType.USED) {
        this.operatorFunctionName = new W3str(this._io, this, null);
        this.operatorFunctionName._read();
      }
      this.beginFunction = this._io.readU4le();
      switch (this.operatorFunctionName.value) {
      case "OperatorCompareBoolean":
        this.parameterList = new ParameterList(this._io, this, this._root, 3);
        this.parameterList._read();
        break;
      case "OperatorCompareInteger":
        this.parameterList = new ParameterList(this._io, this, this._root, 3);
        this.parameterList._read();
        break;
      case "GetBooleanAnd":
        this.parameterList = new ParameterList(this._io, this, this._root, 2);
        this.parameterList._read();
        break;
      case "GetBooleanOr":
        this.parameterList = new ParameterList(this._io, this, this._root, 2);
        this.parameterList._read();
        break;
      }
      this.endFunction = this._io.readU4le();
    }

    return ConditionWithoutIndex;
  })();

  var BuildPriority = W3Wai.BuildPriority = (function() {
    function BuildPriority(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    BuildPriority.prototype._read = function() {
      this.priorityType = this._io.readU4le();
      this.techType = this._io.readU4le();
      this.tech = new W3id(this._io, this, null);
      this.tech._read();
      this.target = this._io.readU4le();
      this.conditionIndex = this._io.readU4le();
      this.fill = [];
      for (var i = 0; i < 5; i++) {
        this.fill.push(this._io.readU1());
      }
    }

    return BuildPriority;
  })();

  var HarvestPriority = W3Wai.HarvestPriority = (function() {
    function HarvestPriority(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    HarvestPriority.prototype._read = function() {
      this.harvestPriorityType = this._io.readU4le();
      this.harvestType = this._io.readU4le();
      this.target = this._io.readU4le();
      this.workers = this._io.readU4le();
      this.conditionIndex = this._io.readU4le();
      this.fill = [];
      for (var i = 0; i < 5; i++) {
        this.fill.push(this._io.readU1());
      }
    }

    return HarvestPriority;
  })();

  var AttackWave = W3Wai.AttackWave = (function() {
    function AttackWave(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    AttackWave.prototype._read = function() {
      this.attackGroupIndex = this._io.readU4le();
      this.delay = this._io.readU4le();
    }

    return AttackWave;
  })();

  var SkillChunk = W3Wai.SkillChunk = (function() {
    function SkillChunk(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    SkillChunk.prototype._read = function() {
      this.firstAsFirst = [];
      for (var i = 0; i < 10; i++) {
        var _t_firstAsFirst = new W3id(this._io, this, null);
        _t_firstAsFirst._read();
        this.firstAsFirst.push(_t_firstAsFirst);
      }
      this.firstAsSecond = [];
      for (var i = 0; i < 10; i++) {
        var _t_firstAsSecond = new W3id(this._io, this, null);
        _t_firstAsSecond._read();
        this.firstAsSecond.push(_t_firstAsSecond);
      }
      this.firstAsThird = [];
      for (var i = 0; i < 10; i++) {
        var _t_firstAsThird = new W3id(this._io, this, null);
        _t_firstAsThird._read();
        this.firstAsThird.push(_t_firstAsThird);
      }
      this.secondAsFirst = [];
      for (var i = 0; i < 10; i++) {
        var _t_secondAsFirst = new W3id(this._io, this, null);
        _t_secondAsFirst._read();
        this.secondAsFirst.push(_t_secondAsFirst);
      }
      this.secondAsSecond = [];
      for (var i = 0; i < 10; i++) {
        var _t_secondAsSecond = new W3id(this._io, this, null);
        _t_secondAsSecond._read();
        this.secondAsSecond.push(_t_secondAsSecond);
      }
      this.secondAsThird = [];
      for (var i = 0; i < 10; i++) {
        var _t_secondAsThird = new W3id(this._io, this, null);
        _t_secondAsThird._read();
        this.secondAsThird.push(_t_secondAsThird);
      }
      this.thirdAsFirst = [];
      for (var i = 0; i < 10; i++) {
        var _t_thirdAsFirst = new W3id(this._io, this, null);
        _t_thirdAsFirst._read();
        this.thirdAsFirst.push(_t_thirdAsFirst);
      }
      this.thirdAsSecond = [];
      for (var i = 0; i < 10; i++) {
        var _t_thirdAsSecond = new W3id(this._io, this, null);
        _t_thirdAsSecond._read();
        this.thirdAsSecond.push(_t_thirdAsSecond);
      }
      this.thirdAsThird = [];
      for (var i = 0; i < 10; i++) {
        var _t_thirdAsThird = new W3id(this._io, this, null);
        _t_thirdAsThird._read();
        this.thirdAsThird.push(_t_thirdAsThird);
      }
    }

    return SkillChunk;
  })();

  var Condition = W3Wai.Condition = (function() {
    function Condition(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Condition.prototype._read = function() {
      this.index = this._io.readU4le();
      this.rest = new ConditionWithoutIndex(this._io, this, this._root);
      this.rest._read();
    }

    return Condition;
  })();

  var Player = W3Wai.Player = (function() {
    function Player(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    Player.prototype._read = function() {
      this.index = this._io.readU4le();
      this.teamNumber = this._io.readU4le();
      this.race = this._io.readU4le();
      this.color = this._io.readU4le();
      this.handicap = this._io.readU4le();
      this.ai = this._io.readU4le();
      this.aiDifficulty = this._io.readU4le();
      this.aiScriptPath = new W3str(this._io, this, null);
      this.aiScriptPath._read();
    }

    return Player;
  })();

  var ImportObj = W3Wai.ImportObj = (function() {
    function ImportObj(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    ImportObj.prototype._read = function() {
      this.path = new W3str(this._io, this, null);
      this.path._read();
      this.importTime = new W3str(this._io, this, null);
      this.importTime._read();
    }

    return ImportObj;
  })();

  var AttackGroup = W3Wai.AttackGroup = (function() {
    function AttackGroup(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    AttackGroup.prototype._read = function() {
      this.index = this._io.readU4le();
      this.name = new W3str(this._io, this, null);
      this.name._read();
      this.numCurrentGroup = this._io.readU4le();
      this.currentGroup = [];
      for (var i = 0; i < this.numCurrentGroup; i++) {
        var _t_currentGroup = new CurrentGroup(this._io, this, this._root);
        _t_currentGroup._read();
        this.currentGroup.push(_t_currentGroup);
      }
    }

    return AttackGroup;
  })();

  var FunctionParameterExt = W3Wai.FunctionParameterExt = (function() {
    function FunctionParameterExt(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    FunctionParameterExt.prototype._read = function() {
      this.type = this._io.readU4le();
      this.value = new W3str(this._io, this, null);
      this.value._read();
      this.beginFunction = this._io.readU4le();
      switch (this._parent.value.value) {
      case "CaptainRetreating":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "TownWithMine":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "FoodUsed":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetGold":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "CaptainInCombat":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "MeleeDifficulty":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetUpgradeWoodCost":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "CheckLastCommand":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "TownThreatened":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetGoldOwned":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetMinesOwned":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetUpgradeGoldCost":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "GetTownUnitCount":
        this.parameterList = new ParameterList(this._io, this, this._root, 3);
        this.parameterList._read();
        break;
      case "CurrentAttackWave":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetUnitGoldCost":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "GetUnitBuildTime":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "CaptainReadinessHP":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "ExpansionNeeded":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "CaptainIsFull":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetUpgradeLevel":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "TotalFoodProduced":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "CheckLastCommandData":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "TownHasMine":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "CreepsOnMap":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "CaptainGroupSize":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "CommandsWaiting":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "CaptainAtGoal":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetWood":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetFoodMade":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "CaptainReadinessMa":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetUnitWoodCost":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "OperatorInt":
        this.parameterList = new ParameterList(this._io, this, this._root, 3);
        this.parameterList._read();
        break;
      case "GetUnitCount":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "CaptainIsEmpty":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "CaptainIsHome":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "TownHasHall":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      case "GetNextExpansion":
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      case "GetUnitCountDone":
        this.parameterList = new ParameterList(this._io, this, this._root, 1);
        this.parameterList._read();
        break;
      default:
        this.parameterList = new ParameterList(this._io, this, this._root, 0);
        this.parameterList._read();
        break;
      }
      this.endFunction = this._io.readU4le();
    }

    return FunctionParameterExt;
  })();

  var CurrentGroup = W3Wai.CurrentGroup = (function() {
    function CurrentGroup(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

    }
    CurrentGroup.prototype._read = function() {
      this.unit = new W3id(this._io, this, null);
      this.unit._read();
      this.quantity = this._io.readU4le();
      this.maxQuantity = this._io.readU4le();
      this.conditionIndex = this._io.readU4le();
      this.fill = [];
      for (var i = 0; i < 5; i++) {
        this.fill.push(this._io.readU1());
      }
    }

    return CurrentGroup;
  })();

  var ParameterList = W3Wai.ParameterList = (function() {
    function ParameterList(_io, _parent, _root, numParameter) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.numParameter = numParameter;

    }
    ParameterList.prototype._read = function() {
      this.parameter = [];
      for (var i = 0; i < this.numParameter; i++) {
        var _t_parameter = new Parameter(this._io, this, this._root);
        _t_parameter._read();
        this.parameter.push(_t_parameter);
      }
    }

    return ParameterList;
  })();

  return W3Wai;
})();
return W3Wai;
}));
