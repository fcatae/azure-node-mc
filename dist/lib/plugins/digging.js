"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var Vec3 = require("vec3").Vec3;

module.exports.player = function (player, serv) {
  var _this = this;

  function cancelDig(_ref) {
    var position = _ref.position;
    var block = _ref.block;

    player.sendBlock(position, block.type, block.metadata);
  }

  player._client.on("block_dig", function callee$1$0(_ref2) {
    var location = _ref2.location;
    var status = _ref2.status;
    var face = _ref2.face;
    var pos, directionVector, facedPos, facedBlock, block;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          pos = new Vec3(location.x, location.y, location.z);
          directionVector = directionToVector[face];
          facedPos = pos.plus(directionVector);
          context$2$0.prev = 3;
          context$2$0.next = 6;
          return _regeneratorRuntime.awrap(player.world.getBlock(facedPos));

        case 6:
          facedBlock = context$2$0.sent;
          block = undefined;

          if (!(facedBlock.name == "fire")) {
            context$2$0.next = 13;
            break;
          }

          block = facedBlock;
          pos = facedPos;
          context$2$0.next = 16;
          break;

        case 13:
          context$2$0.next = 15;
          return _regeneratorRuntime.awrap(player.world.getBlock(pos));

        case 15:
          block = context$2$0.sent;

        case 16:

          currentlyDugBlock = block;

          if (!(currentlyDugBlock.type == 0)) {
            context$2$0.next = 19;
            break;
          }

          return context$2$0.abrupt("return");

        case 19:
          if (!(status == 0 && player.gameMode != 1)) {
            context$2$0.next = 23;
            break;
          }

          player.behavior('dig', { // Start dig survival
            position: pos,
            block: block
          }, function (_ref3) {
            var position = _ref3.position;

            return startDigging(position);
          }, cancelDig);
          context$2$0.next = 33;
          break;

        case 23:
          if (!(status == 2)) {
            context$2$0.next = 27;
            break;
          }

          completeDigging(pos);
          context$2$0.next = 33;
          break;

        case 27:
          if (!(status == 1)) {
            context$2$0.next = 31;
            break;
          }

          player.behavior('cancelDig', { // Cancel dig survival
            position: pos,
            block: block
          }, function (_ref4) {
            var position = _ref4.position;

            return cancelDigging(position);
          });
          context$2$0.next = 33;
          break;

        case 31:
          if (!(status == 0 && player.gameMode == 1)) {
            context$2$0.next = 33;
            break;
          }

          return context$2$0.abrupt("return", creativeDigging(pos));

        case 33:
          context$2$0.next = 38;
          break;

        case 35:
          context$2$0.prev = 35;
          context$2$0.t0 = context$2$0["catch"](3);

          setTimeout(function () {
            throw context$2$0.t0;
          }, 0);

        case 38:
        case "end":
          return context$2$0.stop();
      }
    }, null, _this, [[3, 35]]);
  });

  function diggingTime() {
    // assume holding nothing and usual conditions
    return currentlyDugBlock.digTime();
  }

  var currentlyDugBlock = undefined;
  var startDiggingTime = undefined;
  var animationInterval = undefined;
  var expectedDiggingTime = undefined;
  var lastDestroyState = undefined;
  var currentAnimationId = undefined;
  function startDigging(location) {
    serv.entityMaxId++;
    currentAnimationId = serv.entityMaxId;
    expectedDiggingTime = diggingTime(location);
    lastDestroyState = 0;
    startDiggingTime = new Date();
    updateAnimation();
    animationInterval = setInterval(updateAnimation, 100);
    function updateAnimation() {
      var currentDiggingTime = new Date() - startDiggingTime;
      var newDestroyState = Math.floor(9 * currentDiggingTime / expectedDiggingTime);
      newDestroyState = newDestroyState > 9 ? 9 : newDestroyState;
      if (newDestroyState != lastDestroyState) {
        player.behavior('breakAnimation', {
          lastState: lastDestroyState,
          state: newDestroyState,
          start: startDigging,
          timePassed: currentDiggingTime,
          position: location
        }, function (_ref5) {
          var state = _ref5.state;

          lastDestroyState = state;
          player._writeOthersNearby("block_break_animation", {
            "entityId": currentAnimationId,
            "location": location,
            "destroyStage": state
          });
        });
      }
    }
  }

  function cancelDigging(location) {
    clearInterval(animationInterval);
    player._writeOthersNearby("block_break_animation", {
      "entityId": currentAnimationId,
      "location": location,
      "destroyStage": -1
    });
  }

  function completeDigging(location) {
    var diggingTime, stop;
    return _regeneratorRuntime.async(function completeDigging$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          clearInterval(animationInterval);
          diggingTime = new Date() - startDiggingTime;
          stop = false;

          if (expectedDiggingTime - diggingTime < 100) {
            stop = player.behavior('forceCancelDig', {
              stop: true,
              start: startDiggingTime,
              time: diggingTime
            }).stop;
          }
          if (!stop) {
            player.behavior('dug', {
              position: location,
              block: currentlyDugBlock,
              dropBlock: true,
              blockDropPosition: location.offset(0.5, 0.5, 0.5),
              blockDropWorld: player.world,
              blockDropVelocity: new Vec3(Math.random() * 4 - 2, Math.random() * 2 + 2, Math.random() * 4 - 2),
              blockDropId: currentlyDugBlock.type,
              blockDropDamage: currentlyDugBlock.metadata,
              blockDropPickup: 500,
              blockDropDeath: 60 * 5 * 1000
            }, function (data) {
              player.changeBlock(data.position, 0, 0);
              if (data.dropBlock) dropBlock(data);
            }, cancelDig);
          } else {
            player._client.write("block_change", {
              location: location,
              type: currentlyDugBlock.type << 4
            });
          }

        case 5:
        case "end":
          return context$2$0.stop();
      }
    }, null, this);
  }

  function dropBlock(_ref6) {
    var blockDropPosition = _ref6.blockDropPosition;
    var blockDropWorld = _ref6.blockDropWorld;
    var blockDropVelocity = _ref6.blockDropVelocity;
    var blockDropId = _ref6.blockDropId;
    var blockDropDamage = _ref6.blockDropDamage;
    var blockDropPickup = _ref6.blockDropPickup;
    var blockDropDeath = _ref6.blockDropDeath;

    serv.spawnObject(2, blockDropWorld, blockDropPosition, {
      velocity: blockDropVelocity,
      itemId: blockDropId,
      itemDamage: blockDropDamage,
      pickupTime: blockDropPickup,
      deathTime: blockDropDeath
    });
  }

  function creativeDigging(location) {
    player.behavior('dug', {
      position: location,
      block: currentlyDugBlock,
      dropBlock: false,
      blockDropPosition: location.offset(0.5, 0.5, 0.5),
      blockDropWorld: player.world,
      blockDropVelocity: new Vec3(Math.random() * 4 - 2, Math.random() * 2 + 2, Math.random() * 4 - 2),
      blockDropId: currentlyDugBlock.type,
      blockDropDamage: currentlyDugBlock.metadata,
      blockDropPickup: 500,
      blockDropDeath: 60 * 5 * 1000
    }, function (data) {
      player.changeBlock(data.position, 0, 0);
      if (data.dropBlock) dropBlock(data);
    }, cancelDig);
  }
};

var directionToVector = [new Vec3(0, -1, 0), new Vec3(0, 1, 0), new Vec3(0, 0, -1), new Vec3(0, 0, 1), new Vec3(-1, 0, 0), new Vec3(1, 0, 0)];
//# sourceMappingURL=../../maps/lib/plugins/digging.js.map
