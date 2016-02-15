"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _Math$sign = require("babel-runtime/core-js/math/sign")["default"];

var blocks = require("minecraft-data")(require("flying-squid").version).blocks;
var Vec3 = require("vec3").Vec3;

module.exports.entity = function (entity) {
  var _this = this;

  entity.calculatePhysics = function callee$1$0(delta) {
    var vSign, sizeSigned, xVec, yVec, zVec, xBlock, yBlock, zBlock, newPos;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (entity.gravity) {
            addGravity(entity, 'x', delta);
            addGravity(entity, 'y', delta);
            addGravity(entity, 'z', delta);
          }

          vSign = getSign(entity.velocity);
          sizeSigned = new Vec3(vSign.x * entity.size.x, vSign.y * entity.size.y, vSign.z * entity.size.z);
          xVec = entity.position.offset(entity.velocity.x * delta + sizeSigned.x / 2, 0, 0).scaled(1 / 32).floored();
          yVec = entity.position.offset(0, entity.velocity.y * delta + sizeSigned.y / 2, 0).scaled(1 / 32).floored();
          zVec = entity.position.offset(0, 0, entity.velocity.z * delta + sizeSigned.z / 2).scaled(1 / 32).floored();
          context$2$0.next = 8;
          return _regeneratorRuntime.awrap(entity.world.getBlockType(xVec));

        case 8:
          context$2$0.t0 = context$2$0.sent;
          context$2$0.t1 = blocks[context$2$0.t0].boundingBox;
          xBlock = context$2$0.t1 == 'block';

          if (!yVec.equals(xVec)) {
            context$2$0.next = 15;
            break;
          }

          context$2$0.t2 = xBlock;
          context$2$0.next = 20;
          break;

        case 15:
          context$2$0.next = 17;
          return _regeneratorRuntime.awrap(entity.world.getBlockType(yVec));

        case 17:
          context$2$0.t3 = context$2$0.sent;
          context$2$0.t4 = blocks[context$2$0.t3].boundingBox;
          context$2$0.t2 = context$2$0.t4 == 'block';

        case 20:
          yBlock = context$2$0.t2;

          if (!zVec.equals(yVec)) {
            context$2$0.next = 25;
            break;
          }

          context$2$0.t5 = yBlock;
          context$2$0.next = 35;
          break;

        case 25:
          if (!zVec.equals(xVec)) {
            context$2$0.next = 29;
            break;
          }

          context$2$0.t6 = xBlock;
          context$2$0.next = 34;
          break;

        case 29:
          context$2$0.next = 31;
          return _regeneratorRuntime.awrap(entity.world.getBlockType(zVec));

        case 31:
          context$2$0.t7 = context$2$0.sent;
          context$2$0.t8 = blocks[context$2$0.t7].boundingBox;
          context$2$0.t6 = context$2$0.t8 == 'block';

        case 34:
          context$2$0.t5 = context$2$0.t6;

        case 35:
          zBlock = context$2$0.t5;

          if (xBlock || yBlock || zBlock) {
            entity.velocity.x = getFriction(entity.velocity.x, entity.friction.x, delta);
            entity.velocity.z = getFriction(entity.velocity.z, entity.friction.z, delta);
          }

          newPos = entity.position.clone();

          newPos.x += getMoveAmount('x', xBlock, entity, delta, sizeSigned.x);
          newPos.y += getMoveAmount('y', yBlock, entity, delta, sizeSigned.y);
          newPos.z += getMoveAmount('z', zBlock, entity, delta, sizeSigned.z);

          //serv.emitParticle(30, serv.overworld, entity.position.scaled(1/32), { size: new Vec3(0, 0, 0) });
          return context$2$0.abrupt("return", { position: newPos, onGround: yBlock });

        case 42:
        case "end":
          return context$2$0.stop();
      }
    }, null, _this);
  };

  entity.sendVelocity = function (vel, maxVel) {
    var velocity = vel.scaled(32).floored(); // Make fixed point
    var maxVelocity = maxVel.scaled(32).floored();
    var scaledVelocity = velocity.scaled(8000 / 32 / 20).floored(); // from fixed-position/second to unit => 1/8000 blocks per tick
    entity._writeNearby('entity_velocity', {
      entityId: entity.id,
      velocityX: scaledVelocity.x,
      velocityY: scaledVelocity.y,
      velocityZ: scaledVelocity.z
    });
    if (entity.type != 'player') {
      if (maxVelocity) entity.velocity = addVelocityWithMax(entity.velocity, velocity, maxVelocity);else entity.velocity.add(velocity);
    }
  };

  function getMoveAmount(dir, block, entity, delta, sizeSigned) {
    if (block) {
      entity.velocity[dir] = 0;
      return Math.floor(-1 * (entity.position[dir] + sizeSigned / 2 - floorInDirection(entity.position[dir], -sizeSigned)));
    } else {
      return Math.floor(entity.velocity[dir] * delta);
    }
  }

  function getSign(vec) {
    return new Vec3(_Math$sign(vec.x), _Math$sign(vec.y), _Math$sign(vec.z));
  }

  function floorInDirection(a, b) {
    return b < 0 ? Math.floor(a) : Math.ceil(a);
  }

  function addGravity(entity, dir, delta) {
    if (entity.velocity[dir] < entity.terminalvelocity[dir] && entity.velocity[dir] > -entity.terminalvelocity[dir]) {
      entity.velocity[dir] = clamp(-entity.terminalvelocity[dir], entity.velocity[dir] + entity.gravity[dir] * delta, entity.terminalvelocity[dir]);
    }
  }

  function getFriction(vel, fric, delta) {
    return vel > 0 ? Math.max(0, vel - fric * delta) : Math.min(0, vel + fric * delta);
  }

  function clamp(a, b, c) {
    return Math.max(a, Math.min(b, c));
  }

  function addVelocityWithMax(current, newVel, max) {
    var x = undefined,
        y = undefined,
        z = undefined;
    if (current.x > max.x || current.x < -max.x) x = current.x;else x = Math.max(-max.x, Math.min(max.x, current.x + newVel.x));
    if (current.y > max.y || current.y < -max.y) y = current.y;else y = Math.max(-max.y, Math.min(max.y, current.y + newVel.y));
    if (current.z > max.z || current.z < -max.z) z = current.z;else z = Math.max(-max.z, Math.min(max.z, current.z + newVel.z));
    return new Vec3(x, y, z);
  }
};

module.exports.player = function (player, serv) {
  player.commands.add({
    base: 'velocity',
    info: 'Push velocity on player(s)',
    usage: '/velocity <player> <x> <y> <z>',
    op: true,
    parse: function parse(str) {
      return str.match(/(.+?) (\d+) (\d+) (\d+)/) || false;
    },
    action: function action(params) {
      var selector = player.selectorString(params[1]);
      var vec = new Vec3(parseInt(params[2]), parseInt(params[3]), parseInt(params[4]));
      selector.forEach(function (e) {
        return e.sendVelocity(vec, vec.scaled(5));
      });
    }
  });
};

// Get block for each (x/y/z)Vec, check to avoid duplicate getBlockTypes
//# sourceMappingURL=../../maps/lib/plugins/physics.js.map
