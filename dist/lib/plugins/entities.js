'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

module.exports.server = function (serv) {
  var ticking = false;
  serv.on('tick', function (delta) {
    var _this = this;

    if (ticking || delta > 1) return;
    ticking = true;
    _Promise.all(_Object$keys(serv.entities).map(function callee$2$0(id) {
      var entity, players, posAndOnGround;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            entity = serv.entities[id];

            if (!(entity.deathTime && Date.now() - entity.bornTime >= entity.deathTime)) {
              context$3$0.next = 6;
              break;
            }

            entity.destroy();
            return context$3$0.abrupt('return');

          case 6:
            if (entity.pickupTime && Date.now() - entity.bornTime >= entity.pickupTime) {
              players = serv.getNearby({
                world: entity.world,
                position: entity.position,
                radius: 1.5 * 32 // Seems good for now
              });

              if (players.length) {
                players[0].collect(entity);
              }
            }

          case 7:
            if (!(!entity.velocity || !entity.size)) {
              context$3$0.next = 9;
              break;
            }

            return context$3$0.abrupt('return');

          case 9:
            context$3$0.next = 11;
            return _regeneratorRuntime.awrap(entity.calculatePhysics(delta));

          case 11:
            posAndOnGround = context$3$0.sent;

            if (entity.type == 'mob') entity.sendPosition(posAndOnGround.position, posAndOnGround.onGround);

          case 13:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    })).then(function () {
      return ticking = false;
    })['catch'](function (err) {
      return setTimeout(function () {
        throw err;
      }, 0);
    });
  });
};

module.exports.entity = function (entity) {
  entity.sendMetadata = function (data) {
    entity._writeOthersNearby('entity_metadata', {
      entityId: entity.id,
      metadata: data
    });
  };

  entity.setAndUpdateMetadata = function (data) {
    entity.metadata = data;
    entity.sendMetadata(data);
  };
};
//# sourceMappingURL=../../maps/lib/plugins/entities.js.map
