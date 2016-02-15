'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var Vec3 = require("vec3").Vec3;

var path = require('path');
var requireIndex = require('requireindex');
var plugins = requireIndex(path.join(__dirname, '..', 'plugins'));
var Command = require('flying-squid').Command;

module.exports.server = function (serv, options) {
  var _this2 = this;

  serv._server.on('connection', function (client) {
    return client.on('error', function (error) {
      return serv.emit('clientError', client, error);
    });
  });

  serv._server.on('login', function callee$1$0(client) {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      var _this = this;

      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!(client.socket.listeners('end').length == 0)) {
            context$2$0.next = 2;
            break;
          }

          return context$2$0.abrupt('return');

        case 2:
          context$2$0.prev = 2;
          context$2$0.next = 5;
          return _regeneratorRuntime.awrap((function callee$2$0() {
            var player;
            return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
              while (1) switch (context$3$0.prev = context$3$0.next) {
                case 0:
                  player = serv.initEntity('player', null, serv.overworld, new Vec3(0, 0, 0));

                  player._client = client;

                  player.profileProperties = player._client.profile ? player._client.profile.properties : [];
                  player.commands = new Command({});
                  _Object$keys(plugins).filter(function (pluginName) {
                    return plugins[pluginName].player != undefined;
                  }).forEach(function (pluginName) {
                    return plugins[pluginName].player(player, serv, options);
                  });

                  serv.emit("newPlayer", player);
                  player.emit('asap');
                  context$3$0.next = 9;
                  return _regeneratorRuntime.awrap(player.login());

                case 9:
                case 'end':
                  return context$3$0.stop();
              }
            }, null, _this);
          })());

        case 5:
          context$2$0.next = 10;
          break;

        case 7:
          context$2$0.prev = 7;
          context$2$0.t0 = context$2$0['catch'](2);

          setTimeout(function () {
            throw context$2$0.t0;
          }, 0);

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this2, [[2, 7]]);
  });
};

module.exports.player = function (player, serv, settings) {
  var _this3 = this;

  function addPlayer() {
    player.type = 'player';
    player.health = 20;
    player.food = 20;
    player.crouching = false; // Needs added in prismarine-entity later
    player.op = settings["everybody-op"]; // REMOVE THIS WHEN OUT OF TESTING
    player.username = player._client.username;
    serv.players.push(player);
    serv.uuidToPlayer[player._client.uuid] = player;
    player.heldItemSlot = 36;
    player.loadedChunks = {};
  }

  function sendLogin() {
    // send init data so client will start rendering world
    player._client.write('login', {
      entityId: player.id,
      levelType: 'default',
      gameMode: player.gameMode,
      dimension: 0,
      difficulty: 0,
      reducedDebugInfo: false,
      maxPlayers: serv._server.maxPlayers
    });
    player.position = player.spawnPoint.toFixedPosition();
  }

  function sendChunkWhenMove() {
    player.on("move", function () {
      if (!player.sendingChunks && player.position.distanceTo(player.lastPositionChunkUpdated) > 16 * 32) player.sendRestMap();
    });
  }

  function updateTime() {
    player._client.write('update_time', {
      age: [0, 0],
      time: [0, serv.time]
    });
  }

  player.setGameMode = function (gameMode) {
    player.gameMode = gameMode;
    player._client.write('game_state_change', {
      reason: 3,
      gameMode: player.gameMode
    });
    serv._writeAll('player_info', {
      action: 1,
      data: [{
        UUID: player._client.uuid,
        gamemode: player.gameMode
      }]
    });
    player.sendAbilities();
  };

  function fillTabList() {
    player._writeOthers('player_info', {
      action: 0,
      data: [{
        UUID: player._client.uuid,
        name: player.username,
        properties: player.profileProperties,
        gamemode: player.gameMode,
        ping: player._client.latency
      }]
    });

    player._client.write('player_info', {
      action: 0,
      data: serv.players.map(function (otherPlayer) {
        return {
          UUID: otherPlayer._client.uuid,
          name: otherPlayer.username,
          properties: otherPlayer.profileProperties,
          gamemode: otherPlayer.gameMode,
          ping: otherPlayer._client.latency
        };
      })
    });
    setInterval(function () {
      return player._client.write('player_info', {
        action: 2,
        data: serv.players.map(function (otherPlayer) {
          return {
            UUID: otherPlayer._client.uuid,
            ping: otherPlayer._client.latency
          };
        })
      });
    }, 5000);
  }

  function announceJoin() {
    serv.broadcast(serv.color.yellow + player.username + ' joined the game.');
    player.emit("connected");
  }

  player.waitPlayerLogin = function () {
    var events = ["flying", "look"];
    return new _Promise(function (resolve) {

      var listener = function listener() {
        events.map(function (event) {
          return player._client.removeListener(event, listener);
        });
        resolve();
      };
      events.map(function (event) {
        return player._client.on(event, listener);
      });
    });
  };

  player.login = function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!serv.uuidToPlayer[player._client.uuid]) {
            context$2$0.next = 3;
            break;
          }

          player.kick("You are already connected");
          return context$2$0.abrupt('return');

        case 3:
          if (!serv.bannedPlayers[player._client.uuid]) {
            context$2$0.next = 6;
            break;
          }

          player.kick(serv.bannedPlayers[player._client.uuid].reason);
          return context$2$0.abrupt('return');

        case 6:
          if (!serv.bannedIPs[player._client.socket.remoteAddress]) {
            context$2$0.next = 9;
            break;
          }

          player.kick(serv.bannedIPs[player._client.socket.remoteAddress].reason);
          return context$2$0.abrupt('return');

        case 9:

          addPlayer();
          context$2$0.next = 12;
          return _regeneratorRuntime.awrap(player.findSpawnPoint());

        case 12:
          sendLogin();
          context$2$0.next = 15;
          return _regeneratorRuntime.awrap(player.sendMap());

        case 15:
          player.sendSpawnPosition();
          player.sendSelfPosition();
          player.updateHealth(player.health);
          player.sendAbilities();

          updateTime();
          fillTabList();
          player.updateAndSpawn();

          announceJoin();
          player.emit("spawned");

          context$2$0.next = 26;
          return _regeneratorRuntime.awrap(player.waitPlayerLogin());

        case 26:
          player.sendRestMap();
          sendChunkWhenMove();

        case 28:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this3);
  };
};
// TODO: should be fixed properly in nmp instead
//# sourceMappingURL=../../maps/lib/plugins/login.js.map
