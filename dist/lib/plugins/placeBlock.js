"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var blocks = require("minecraft-data")(require("flying-squid").version).blocks;
var Vec3 = require("vec3").Vec3;

var materialToSound = {
  undefined: 'stone',
  'rock': 'stone',
  'dirt': 'grass',
  'plant': 'grass',
  'wool': 'cloth',
  'web': 'cloth',
  'wood': 'wood'
};

module.exports.player = function (player, serv) {
  var _this = this;

  player._client.on("block_place", function () {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var direction = _ref.direction;
    var heldItem = _ref.heldItem;
    var location = _ref.location;

    if (direction == -1 || heldItem.blockId == -1 || !blocks[heldItem.blockId]) return;
    var referencePosition = new Vec3(location.x, location.y, location.z);
    var directionVector = directionToVector[direction];
    var placedPosition = referencePosition.plus(directionVector);
    player.behavior('placeBlock', {
      direction: directionVector,
      heldItem: heldItem,
      id: heldItem.blockId,
      damage: heldItem.itemDamage,
      position: placedPosition,
      reference: referencePosition,
      playSound: true,
      sound: 'dig.' + (materialToSound[blocks[heldItem.blockId].material] || 'stone')
    }, function (_ref2) {
      var direction = _ref2.direction;
      var heldItem = _ref2.heldItem;
      var position = _ref2.position;
      var playSound = _ref2.playSound;
      var sound = _ref2.sound;
      var id = _ref2.id;
      var damage = _ref2.damage;

      if (playSound) {
        serv.playSound(sound, player.world, placedPosition.clone().add(new Vec3(0.5, 0.5, 0.5)), {
          pitch: 0.8
        });
      }
      if (heldItem.blockId != 323) {
        player.changeBlock(position, id, damage);
      } else if (direction == 1) {
        player.setBlock(position, 63, 0);
        player._client.write('open_sign_entity', {
          location: position
        });
      } else {
        player.setBlock(position, 68, 0);
        player._client.write('open_sign_entity', {
          location: position
        });
      }
    }, function callee$2$0() {
      var id, damage;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(player.world.getBlockType(placedPosition));

          case 2:
            id = context$3$0.sent;
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(player.world.getBlockData(placedPosition));

          case 5:
            damage = context$3$0.sent;

            player.sendBlock(placedPosition, id, damage);

          case 7:
          case "end":
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });
};

var directionToVector = [new Vec3(0, -1, 0), new Vec3(0, 1, 0), new Vec3(0, 0, -1), new Vec3(0, 0, 1), new Vec3(-1, 0, 0), new Vec3(1, 0, 0)];
//# sourceMappingURL=../../maps/lib/plugins/placeBlock.js.map
