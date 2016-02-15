'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var once = require('event-promise');

module.exports.server = function (serv) {
  var _this = this;

  serv.quit = function callee$1$0() {
    var reason = arguments.length <= 0 || arguments[0] === undefined ? "Going down" : arguments[0];
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(_Promise.all(serv.players.map(function (player) {
            player.kick(reason);
            return once(player, 'disconnected');
          })));

        case 2:
          serv._server.close();
          context$2$0.next = 5;
          return _regeneratorRuntime.awrap(once(serv._server, "close"));

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  };
};

module.exports.player = function (player, serv) {
  player.despawnEntities = function (entities) {
    return player._client.write('entity_destroy', {
      'entityIds': entities.map(function (e) {
        return e.id;
      })
    });
  };

  player._client.on('end', function () {
    if (player) {
      serv.broadcast(serv.color.yellow + player.username + ' quit the game.');
      player._writeOthers('player_info', {
        action: 4,
        data: [{
          UUID: player._client.uuid
        }]
      });
      player.nearbyPlayers().forEach(function (otherPlayer) {
        return otherPlayer.despawnEntities([player]);
      });
      delete serv.entities[player.id];
      player.emit('disconnected');
      var index = serv.players.indexOf(player);
      if (index > -1) {
        serv.players.splice(index, 1);
      }
      delete serv.uuidToPlayer[player._client.uuid];
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/logout.js.map
