'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

module.exports.server = function (serv) {
  serv._writeAll = function (packetName, packetFields) {
    return serv.players.forEach(function (player) {
      return player._client.write(packetName, packetFields);
    });
  };

  serv._writeArray = function (packetName, packetFields, players) {
    return players.forEach(function (player) {
      return player._client.write(packetName, packetFields);
    });
  };

  serv._writeNearby = function (packetName, packetFields, loc) {
    return serv._writeArray(packetName, packetFields, serv.getNearby(loc));
  };

  serv.getNearby = function (_ref) {
    var world = _ref.world;
    var position = _ref.position;
    var _ref$radius = _ref.radius;
    var radius = _ref$radius === undefined ? 8 * 16 * 32 : _ref$radius;
    return serv.players.filter(function (player) {
      return player.world == world && player.position.distanceTo(position) <= radius;
    });
  };

  serv.getNearbyEntities = function (_ref2) {
    var world = _ref2.world;
    var position = _ref2.position;
    var _ref2$radius = _ref2.radius;
    var radius = _ref2$radius === undefined ? 8 * 16 * 32 : _ref2$radius;
    return _Object$keys(serv.entities).map(function (eId) {
      return serv.entities[eId];
    }).filter(function (entity) {
      return entity.world == world && entity.position.distanceTo(position) <= radius;
    });
  };
};

module.exports.entity = function (entity, serv) {

  entity.getNearby = function () {
    return serv.getNearbyEntities({
      world: entity.world,
      position: entity.position,
      radius: entity.viewDistance * 32
    }).filter(function (e) {
      return e != entity;
    });
  };

  entity.getOtherPlayers = function () {
    return serv.players.filter(function (p) {
      return p != entity;
    });
  };

  entity.getOthers = function () {
    return serv.entities.filter(function (e) {
      return e != entity;
    });
  };

  entity.getNearbyPlayers = function () {
    var radius = arguments.length <= 0 || arguments[0] === undefined ? entity.viewDistance * 32 : arguments[0];
    return entity.getNearby().filter(function (e) {
      return e.type == 'player';
    });
  };

  entity.nearbyPlayers = function () {
    var radius = arguments.length <= 0 || arguments[0] === undefined ? entity.viewDistance * 32 : arguments[0];
    return entity.nearbyEntities.filter(function (e) {
      return e.type == 'player';
    });
  };

  entity._writeOthers = function (packetName, packetFields) {
    return serv._writeArray(packetName, packetFields, entity.getOtherPlayers());
  };

  entity._writeOthersNearby = function (packetName, packetFields) {
    return serv._writeArray(packetName, packetFields, entity.getNearbyPlayers());
  };

  entity._writeNearby = function (packetName, packetFields) {
    return serv._writeArray(packetName, packetFields, entity.getNearbyPlayers().concat(entity.type == 'player' ? [entity] : []));
  };
};
//# sourceMappingURL=../../maps/lib/plugins/communication.js.map
