'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _nodePromiseEs6 = require('node-promise-es6');

var _prismarineProviderAnvil = require('prismarine-provider-anvil');

var spiralloop = require('spiralloop');

var World = require('prismarine-world');
var WorldSync = require("prismarine-world-sync");

var generations = require("flying-squid").generations;

module.exports.server = function callee$0$0(serv) {
  var _ref,
      worldFolder,
      _ref$generation,
      generation,
      newSeed,
      seed,
      regionFolder,
      stats,
      levelData,
      args$1$0 = arguments;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _ref = args$1$0.length <= 1 || args$1$0[1] === undefined ? {} : args$1$0[1];
        worldFolder = _ref.worldFolder;
        _ref$generation = _ref.generation;
        generation = _ref$generation === undefined ? { "name": "diamond_square", "options": { "worldHeight": 80 } } : _ref$generation;
        newSeed = generation.options.seed || Math.floor(Math.random() * Math.pow(2, 31));
        seed = undefined;
        regionFolder = undefined;

        if (!worldFolder) {
          context$1$0.next = 33;
          break;
        }

        regionFolder = worldFolder + "/region";
        context$1$0.prev = 9;
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(_nodePromiseEs6.fs.stat(regionFolder));

      case 12:
        stats = context$1$0.sent;
        context$1$0.next = 19;
        break;

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0['catch'](9);
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(_nodePromiseEs6.fs.mkdir(regionFolder));

      case 19:
        context$1$0.prev = 19;
        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(_prismarineProviderAnvil.level.readLevel(worldFolder + "/level.dat"));

      case 22:
        levelData = context$1$0.sent;

        seed = levelData["RandomSeed"][0];
        context$1$0.next = 31;
        break;

      case 26:
        context$1$0.prev = 26;
        context$1$0.t1 = context$1$0['catch'](19);

        seed = newSeed;
        context$1$0.next = 31;
        return _regeneratorRuntime.awrap(_prismarineProviderAnvil.level.writeLevel(worldFolder + "/level.dat", { "RandomSeed": [seed, 0] }));

      case 31:
        context$1$0.next = 34;
        break;

      case 33:
        seed = newSeed;

      case 34:
        generation.options.seed = seed;
        serv.emit("seed", generation.options.seed);
        serv.overworld = new World(generations[generation.name](generation.options), regionFolder);
        serv.netherworld = new World(generations["nether"]({}));
        //serv.endworld = new World(generations["end"]({}));

        serv._worldSync = new WorldSync(serv.overworld);

        // WILL BE REMOVED WHEN ACTUALLY IMPLEMENTED
        serv.overworld.blockEntityData = {};
        serv.netherworld.blockEntityData = {};
        serv.overworld.portals = [];
        serv.netherworld.portals = [];
        //////////////

        serv.pregenWorld = function (world) {
          var size = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

          var promises = [];
          for (var x = -size; x < size; x++) {
            for (var z = -size; z < size; z++) {
              promises.push(world.getColumn(x, z));
            }
          }
          return _Promise.all(promises);
        };

        serv.setBlock = function callee$1$0(world, position, blockType, blockData) {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                serv.players.filter(function (p) {
                  return p.world == world;
                }).forEach(function (player) {
                  return player.sendBlock(position, blockType, blockData);
                });

                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(world.setBlockType(position, blockType));

              case 3:
                context$2$0.next = 5;
                return _regeneratorRuntime.awrap(world.setBlockData(position, blockData));

              case 5:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        };

        //serv.pregenWorld(serv.overworld).then(() => serv.log('Pre-Generated Overworld'));
        //serv.pregenWorld(serv.netherworld).then(() => serv.log('Pre-Generated Nether'));

      case 45:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[9, 15], [19, 26]]);
};

module.exports.player = function (player, serv, settings) {
  var _this2 = this;

  player.unloadChunk = function (chunkX, chunkZ) {
    delete player.loadedChunks[chunkX + "," + chunkZ];
    player._client.write('map_chunk', {
      x: chunkX,
      z: chunkZ,
      groundUp: true,
      bitMap: 0x0000,
      chunkData: new Buffer(0)
    });
  };

  player.sendChunk = function (chunkX, chunkZ, column) {
    return player.behavior('sendChunk', {
      x: chunkX,
      z: chunkZ,
      chunk: column
    }, function (_ref2) {
      var x = _ref2.x;
      var z = _ref2.z;
      var chunk = _ref2.chunk;

      player._client.write('map_chunk', {
        x: x,
        z: z,
        groundUp: true,
        bitMap: 0xffff,
        chunkData: chunk.dump()
      });
      return _Promise.resolve();
    });
  };

  function spiral(arr) {
    var t = [];
    spiralloop(arr, function (x, z) {
      t.push([x, z]);
    });
    return t;
  }

  player.sendNearbyChunks = function (view, group) {
    player.lastPositionChunkUpdated = player.position;
    var playerChunkX = Math.floor(player.position.x / 16 / 32);
    var playerChunkZ = Math.floor(player.position.z / 16 / 32);

    _Object$keys(player.loadedChunks).map(function (key) {
      return key.split(",").map(function (a) {
        return parseInt(a);
      });
    }).filter(function (_ref3) {
      var _ref32 = _slicedToArray(_ref3, 2);

      var x = _ref32[0];
      var z = _ref32[1];
      return Math.abs(x - playerChunkX) > view || Math.abs(z - playerChunkZ) > view;
    }).forEach(function (_ref4) {
      var _ref42 = _slicedToArray(_ref4, 2);

      var x = _ref42[0];
      var z = _ref42[1];
      return player.unloadChunk(x, z);
    });

    return spiral([view * 2, view * 2]).map(function (t) {
      return {
        chunkX: playerChunkX + t[0] - view,
        chunkZ: playerChunkZ + t[1] - view
      };
    }).filter(function (_ref5) {
      var chunkX = _ref5.chunkX;
      var chunkZ = _ref5.chunkZ;

      var key = chunkX + "," + chunkZ;
      var loaded = player.loadedChunks[key];
      if (!loaded) player.loadedChunks[key] = 1;
      return !loaded;
    }).reduce(function (acc, _ref6) {
      var chunkX = _ref6.chunkX;
      var chunkZ = _ref6.chunkZ;

      var p = acc.then(function () {
        return player.world.getColumn(chunkX, chunkZ);
      }).then(function (column) {
        return player.sendChunk(chunkX, chunkZ, column);
      });
      return group ? p.then(function () {
        return sleep(5);
      }) : p;
    }, _Promise.resolve());
  };

  function sleep() {
    var ms = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    return new _Promise(function (r) {
      return setTimeout(r, ms);
    });
  }

  player.sendMap = function () {
    return player.sendNearbyChunks(Math.min(3, settings["view-distance"]))['catch'](function (err) {
      return setTimeout(function () {
        throw err;
      });
    }, 0);
  };

  player.sendRestMap = function () {
    player.sendingChunks = true;
    player.sendNearbyChunks(Math.min(player.view, settings["view-distance"]), true).then(function () {
      return player.sendingChunks = false;
    })['catch'](function (err) {
      return setTimeout(function () {
        throw err;
      }, 0);
    });
  };

  player.sendSpawnPosition = function () {
    player._client.write('spawn_position', {
      "location": player.spawnPoint
    });
  };

  player.changeWorld = function callee$1$0(world, opt) {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!(player.world == world)) {
            context$2$0.next = 2;
            break;
          }

          return context$2$0.abrupt('return', _Promise.resolve());

        case 2:
          opt = opt || {};
          player.world = world;
          player.loadedChunks = {};
          if (typeof opt.gamemode != 'undefined') player.gameMode = opt.gamemode;
          player._client.write("respawn", {
            dimension: opt.dimension || 0,
            difficulty: opt.difficulty || 0,
            gamemode: opt.gamemode || player.gameMode,
            levelType: 'default'
          });
          context$2$0.next = 9;
          return _regeneratorRuntime.awrap(player.findSpawnPoint());

        case 9:
          player.position = player.spawnPoint.toFixedPosition();
          player.sendSpawnPosition();
          player.updateAndSpawn();

          context$2$0.next = 14;
          return _regeneratorRuntime.awrap(player.sendMap());

        case 14:

          player.sendSelfPosition();
          player.emit('change_world');

          context$2$0.next = 18;
          return _regeneratorRuntime.awrap(player.waitPlayerLogin());

        case 18:
          player.sendRestMap();

        case 19:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this2);
  };

  player.commands.add({
    base: 'changeworld',
    info: 'to change world',
    usage: '/changeworld overworld|nether',
    op: true,
    action: function action(world) {
      if (world == "nether") player.changeWorld(serv.netherworld, { dimension: -1 });
      if (world == "overworld") player.changeWorld(serv.overworld, { dimension: 0 });
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/world.js.map
