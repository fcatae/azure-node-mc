'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var Vec3 = require("vec3").Vec3;

Vec3.prototype.toFixedPosition = function () {
  return this.scaled(32).floored();
};

module.exports.player = function (player) {
  var _this = this;

  player._client.on('look', function () {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var yaw = _ref.yaw;
    var pitch = _ref.pitch;
    var onGround = _ref.onGround;
    return sendLook(yaw, pitch, onGround);
  });

  // float (degrees) --> byte (1/256 "degrees")
  function conv(f) {
    var b = Math.floor(f % 360 * 256 / 360);
    if (b < -128) b += 256;else if (b > 127) b -= 256;
    return b;
  }
  function sendLook(yaw, pitch, onGround) {
    player.behavior('look', {
      yaw: yaw,
      pitch: pitch,
      onGround: onGround
    }, function () {
      var convYaw = conv(yaw);
      var convPitch = conv(pitch);
      if (convYaw == player.yaw && convPitch == player.pitch) return;
      player._writeOthersNearby("entity_look", {
        entityId: player.id,
        yaw: convYaw,
        pitch: convPitch,
        onGround: onGround
      });
      player.yaw = convYaw;
      player.pitch = convPitch;
      player.onGround = onGround;
      player._writeOthersNearby("entity_head_rotation", {
        entityId: player.id,
        headYaw: convYaw
      });
    }, function () {
      player.sendSelfPosition();
    });
  }

  player._client.on('position', function () {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var x = _ref2.x;
    var y = _ref2.y;
    var z = _ref2.z;
    var onGround = _ref2.onGround;

    player.sendPosition(new Vec3(x, y, z).toFixedPosition(), onGround);
  });

  player._client.on('position_look', function () {
    var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var x = _ref3.x;
    var y = _ref3.y;
    var z = _ref3.z;
    var onGround = _ref3.onGround;
    var yaw = _ref3.yaw;
    var pitch = _ref3.pitch;

    player.sendPosition(new Vec3(x, y, z).toFixedPosition(), onGround);
    sendLook(yaw, pitch, onGround);
  });

  player.sendSelfPosition = function () {
    player._client.write('position', {
      x: player.position.x / 32,
      y: player.position.y / 32,
      z: player.position.z / 32,
      yaw: player.yaw,
      pitch: player.pitch,
      flags: 0x00
    });
  };

  player.teleport = function callee$1$0(position) {
    var notCancelled;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(player.sendPosition(position.scaled(32).floored(), false, true));

        case 2:
          notCancelled = context$2$0.sent;

          if (notCancelled) player.sendSelfPosition();

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  };

  player.sendAbilities = function () {
    // TODO: Fix all of this...
    var godmode = player.gameMode == 1 || player.gameMode == 3;
    var canFly = player.gameMode == 1 || player.gameMode == 3;
    var isFlying = !player.onGround && canFly;
    var creativeMode = player.gameMode == 1;
    var f = +godmode * 8 + +canFly * 4 + +isFlying * 2 + +creativeMode;
    var walkingSpeed = 0.2 * (1 + (player.effects[1] != null ? player.effects[1].amplifier + 1 : 0) * 0.2);
    var flyingSpeed = 0.1;
    /*console.log(walkingSpeed, flyingSpeed);
    player._client.write('abilities', { // FIIIIXXXXXXX
      flags: f,
      walkingSpeed: walkingSpeed,
      flyingSpeed: flyingSpeed
    });*/
  };
};

module.exports.entity = function (entity) {
  entity.sendPosition = function (position, onGround) {
    var teleport = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (typeof position == 'undefined') throw new Error('undef');
    if (entity.position.equals(position) && entity.onGround == onGround) return _Promise.resolve();
    return entity.behavior('move', {
      position: position,
      onGround: onGround,
      teleport: teleport
    }, function (_ref4) {
      var position = _ref4.position;
      var onGround = _ref4.onGround;

      var diff = position.minus(entity.position);
      if (diff.abs().x > 127 || diff.abs().y > 127 || diff.abs().z > 127) entity._writeOthersNearby('entity_teleport', {
        entityId: entity.id,
        x: position.x,
        y: position.y,
        z: position.z,
        yaw: entity.yaw,
        pitch: entity.pitch,
        onGround: onGround
      });else if (diff.distanceTo(new Vec3(0, 0, 0)) != 0) entity._writeOthersNearby('rel_entity_move', {
        entityId: entity.id,
        dX: diff.x,
        dY: diff.y,
        dZ: diff.z,
        onGround: onGround
      });

      entity.position = position;
      entity.onGround = onGround;
    }, function () {
      if (entity.type == 'player') player.sendSelfPosition();
    });
  };

  entity.teleport = function (pos) {
    // Overwritten in players inject above
    entity.sendPosition(pos.scaled(32), false, true);
  };
};
//# sourceMappingURL=../../maps/lib/plugins/updatePositions.js.map
