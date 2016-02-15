"use strict";

var _Object$keys = require("babel-runtime/core-js/object/keys")["default"];

var version = require("flying-squid").version;
var entitiesByName = require("minecraft-data")(version).entitiesByName;
var entitiesById = require("minecraft-data")(version).entities;
var Entity = require("prismarine-entity");
var path = require('path');
var requireIndex = require('requireindex');
var plugins = requireIndex(path.join(__dirname, '..', 'plugins'));
var Item = require("prismarine-item")(version);
var UserError = require('flying-squid').UserError;

var Vec3 = require("vec3").Vec3;

module.exports.server = function (serv, options) {
  serv.initEntity = function (type, entityType, world, position) {
    serv.entityMaxId++;
    var entity = new Entity(serv.entityMaxId);

    _Object$keys(plugins).filter(function (pluginName) {
      return plugins[pluginName].entity != undefined;
    }).forEach(function (pluginName) {
      return plugins[pluginName].entity(entity, serv, options);
    });

    entity.initEntity(type, entityType, world, position);

    serv.emit("newEntity", entity);

    return entity;
  };

  serv.spawnObject = function (type, world, position, _ref) {
    var _ref$pitch = _ref.pitch;
    var pitch = _ref$pitch === undefined ? 0 : _ref$pitch;
    var _ref$yaw = _ref.yaw;
    var yaw = _ref$yaw === undefined ? 0 : _ref$yaw;
    var _ref$velocity = _ref.velocity;
    var velocity = _ref$velocity === undefined ? new Vec3(0, 0, 0) : _ref$velocity;
    var _ref$data = _ref.data;
    var data = _ref$data === undefined ? 1 : _ref$data;
    var itemId = _ref.itemId;
    var _ref$itemDamage = _ref.itemDamage;
    var itemDamage = _ref$itemDamage === undefined ? 0 : _ref$itemDamage;
    var _ref$pickupTime = _ref.pickupTime;
    var pickupTime = _ref$pickupTime === undefined ? undefined : _ref$pickupTime;
    var _ref$deathTime = _ref.deathTime;
    var deathTime = _ref$deathTime === undefined ? undefined : _ref$deathTime;

    var object = serv.initEntity('object', type, world, position.scaled(32).floored());
    object.data = data;
    object.velocity = velocity.scaled(32).floored();
    object.pitch = pitch;
    object.yaw = yaw;
    object.gravity = new Vec3(0, -20 * 32, 0);
    object.terminalvelocity = new Vec3(27 * 32, 27 * 32, 27 * 32);
    object.friction = new Vec3(15 * 32, 0, 15 * 32);
    object.size = new Vec3(0.25 * 32, 0.25 * 32, 0.25 * 32); // Hardcoded, will be dependent on type!
    object.deathTime = deathTime;
    object.pickupTime = pickupTime;
    object.itemId = itemId;
    object.itemDamage = itemDamage;

    object.updateAndSpawn();
  };

  serv.spawnMob = function (type, world, position) {
    var _ref2 = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var _ref2$pitch = _ref2.pitch;
    var pitch = _ref2$pitch === undefined ? 0 : _ref2$pitch;
    var _ref2$yaw = _ref2.yaw;
    var yaw = _ref2$yaw === undefined ? 0 : _ref2$yaw;
    var _ref2$headPitch = _ref2.headPitch;
    var headPitch = _ref2$headPitch === undefined ? 0 : _ref2$headPitch;
    var _ref2$velocity = _ref2.velocity;
    var velocity = _ref2$velocity === undefined ? new Vec3(0, 0, 0) : _ref2$velocity;
    var _ref2$metadata = _ref2.metadata;
    var metadata = _ref2$metadata === undefined ? [] : _ref2$metadata;

    var mob = serv.initEntity('mob', type, world, position.scaled(32).floored());
    mob.name = entitiesById[type].name;
    mob.velocity = velocity.scaled(32).floored();
    mob.pitch = pitch;
    mob.headPitch = headPitch;
    mob.yaw = yaw;
    mob.gravity = new Vec3(0, -20 * 32, 0);
    mob.terminalvelocity = new Vec3(27 * 32, 27 * 32, 27 * 32);
    mob.friction = new Vec3(15 * 32, 0, 15 * 32);
    mob.size = new Vec3(0.75, 1.75, 0.75);
    mob.health = 20;
    mob.metadata = metadata;

    mob.updateAndSpawn();
    return mob;
  };

  serv.destroyEntity = function (entity) {
    entity._writeOthersNearby('entity_destroy', {
      entityIds: [entity.id]
    });
    delete serv.entities[entity.id];
  };
};

module.exports.player = function (player, serv) {
  player.commands.add({
    base: 'spawn',
    info: 'Spawn a mob',
    usage: '/spawn <entity_id>',
    op: true,
    parse: function parse(str) {
      var results = str.match(/(\d+)/);
      if (!results) return false;
      return {
        id: parseInt(results[1])
      };
    },
    action: function action(_ref3) {
      var id = _ref3.id;

      serv.spawnMob(id, player.world, player.position.scaled(1 / 32), {
        velocity: Vec3((Math.random() - 0.5) * 10, Math.random() * 10 + 10, (Math.random() - 0.5) * 10)
      });
    }
  });

  player.commands.add({
    base: 'spawnObject',
    info: 'Spawn an object',
    usage: '/spawnObject <entity_id>',
    op: true,
    parse: function parse(str) {
      var results = str.match(/(\d+)/);
      if (!results) return false;
      return {
        id: parseInt(results[1])
      };
    },
    action: function action(_ref4) {
      var id = _ref4.id;

      serv.spawnObject(id, player.world, player.position.scaled(1 / 32), {
        velocity: Vec3((Math.random() - 0.5) * 10, Math.random() * 10 + 10, (Math.random() - 0.5) * 10)
      });
    }
  });

  player.commands.add({
    base: 'summon',
    info: 'Summon an entity',
    usage: '/summon <entity_name>',
    op: true,
    action: function action(name) {
      var entity = entitiesByName[name];
      if (!entity) {
        player.chat("No entity named " + name);
        return;
      }
      serv.spawnMob(entity.id, player.world, player.position.scaled(1 / 32), {
        velocity: Vec3((Math.random() - 0.5) * 10, Math.random() * 10 + 10, (Math.random() - 0.5) * 10)
      });
    }
  });

  player.commands.add({
    base: 'summonMany',
    info: 'Summon many entities',
    usage: '/summonMany <number> <entity_name>',
    op: true,
    parse: function parse(str) {
      var args = str.split(" ");
      if (args.length != 2) return false;
      return { number: args[0], name: args[1] };
    },
    action: function action(_ref5) {
      var number = _ref5.number;
      var name = _ref5.name;

      var entity = entitiesByName[name];
      if (!entity) {
        player.chat("No entity named " + name);
        return;
      }
      var s = Math.floor(Math.sqrt(number));
      for (var i = 0; i < number; i++) {
        serv.spawnMob(entity.id, player.world, player.position.scaled(1 / 32).offset(Math.floor(i / s * 10), 0, i % s * 10), {
          velocity: Vec3((Math.random() - 0.5) * 10, Math.random() * 10 + 10, (Math.random() - 0.5) * 10)
        });
      }
    }
  });

  player.commands.add({
    base: 'pile',
    info: 'make a pile of entities',
    usage: '/pile <entities types>',
    op: true,
    parse: function parse(str) {
      var args = str.split(' ');
      if (args.length == 0) return false;
      return args.map(function (name) {
        return entitiesByName[name];
      }).filter(function (entity) {
        return !!entity;
      });
    },
    action: function action(entityTypes) {
      entityTypes.map(function (entity) {
        return serv.spawnMob(entity.id, player.world, player.position.scaled(1 / 32), {
          velocity: Vec3((Math.random() - 0.5) * 10, Math.random() * 10 + 10, (Math.random() - 0.5) * 10)
        });
      }).reduce(function (prec, entity) {
        if (prec != null) prec.attach(entity);
        return entity;
      }, null);
    }
  });

  player.commands.add({
    base: 'attach',
    info: 'attach an entity on an other entity',
    usage: '/attach <carrier> <attached>',
    op: true,
    parse: function parse(str) {
      var args = str.split(' ');
      if (args.length != 2) return false;

      var carrier = player.selectorString(args[0]);
      if (carrier.length == 0) throw new UserError("one carrier");
      var attached = player.selectorString(args[1]);
      if (attached.length == 0) throw new UserError("one attached");

      return { carrier: carrier[0], attached: attached[0] };
    },
    action: function action(_ref6) {
      var carrier = _ref6.carrier;
      var attached = _ref6.attached;

      carrier.attach(attached);
    }
  });

  player.spawnEntity = function (entity) {
    player._client.write(entity.spawnPacketName, entity.getSpawnPacket());
    if (typeof entity.itemId != 'undefined') {
      entity.sendMetadata([{
        "key": 10,
        "type": 5,
        "value": {
          blockId: entity.itemId,
          itemDamage: entity.itemDamage,
          itemCount: 1
        }
      }]);
    }
    entity.equipment.forEach(function (equipment, slot) {
      if (equipment != undefined) player._client.write("entity_equipment", {
        entityId: entity.id,
        slot: slot,
        item: Item.toNotch(equipment)
      });
    });
  };
};

module.exports.entity = function (entity, serv) {
  entity.initEntity = function (type, entityType, world, position) {
    entity.type = type;
    entity.spawnPacketName = '';
    entity.entityType = entityType;
    entity.world = world;
    entity.position = position;
    entity.lastPositionPlayersUpdated = entity.position.clone();
    entity.nearbyEntities = [];
    entity.viewDistance = 150;
    entity.score = {};

    entity.bornTime = Date.now();
    serv.entities[entity.id] = entity;

    if (entity.type == 'player') entity.spawnPacketName = 'named_entity_spawn';else if (entity.type == 'object') entity.spawnPacketName = 'spawn_entity';else if (entity.type == 'mob') entity.spawnPacketName = 'spawn_entity_living';
  };

  entity.getSpawnPacket = function () {
    var scaledVelocity = entity.velocity.scaled(8000 / 32 / 20).floored(); // from fixed-position/second to unit => 1/8000 blocks per tick
    if (entity.type == 'player') {
      return {
        entityId: entity.id,
        playerUUID: entity._client.uuid,
        x: entity.position.x,
        y: entity.position.y,
        z: entity.position.z,
        yaw: entity.yaw,
        pitch: entity.pitch,
        currentItem: 0,
        metadata: entity.metadata
      };
    } else if (entity.type == 'object') {
      return {
        entityId: entity.id,
        type: entity.entityType,
        x: entity.position.x,
        y: entity.position.y,
        z: entity.position.z,
        pitch: entity.pitch,
        yaw: entity.yaw,
        objectData: {
          intField: entity.data,
          velocityX: scaledVelocity.x,
          velocityY: scaledVelocity.y,
          velocityZ: scaledVelocity.z
        }
      };
    } else if (entity.type == 'mob') {
      return {
        entityId: entity.id,
        type: entity.entityType,
        x: entity.position.x,
        y: entity.position.y,
        z: entity.position.z,
        yaw: entity.yaw,
        pitch: entity.pitch,
        headPitch: entity.headPitch,
        velocityX: scaledVelocity.x,
        velocityY: scaledVelocity.y,
        velocityZ: scaledVelocity.z,
        metadata: entity.metadata
      };
    }
  };

  entity.updateAndSpawn = function () {
    var updatedEntities = entity.getNearby();
    var entitiesToAdd = updatedEntities.filter(function (e) {
      return entity.nearbyEntities.indexOf(e) == -1;
    });
    var entitiesToRemove = entity.nearbyEntities.filter(function (e) {
      return updatedEntities.indexOf(e) == -1;
    });
    if (entity.type == 'player') {
      entity.despawnEntities(entitiesToRemove);
      entitiesToAdd.forEach(entity.spawnEntity);
    }
    entity.lastPositionPlayersUpdated = entity.position.clone();

    var playersToAdd = entitiesToAdd.filter(function (e) {
      return e.type == 'player';
    });
    var playersToRemove = entitiesToRemove.filter(function (e) {
      return e.type == 'player';
    });

    playersToRemove.forEach(function (p) {
      return p.despawnEntities([entity]);
    });
    playersToRemove.forEach(function (p) {
      return p.nearbyEntities = p.getNearby();
    });
    playersToAdd.forEach(function (p) {
      return p.spawnEntity(entity);
    });
    playersToAdd.forEach(function (p) {
      return p.nearbyEntities = p.getNearby();
    });

    entity.nearbyEntities = updatedEntities;
  };

  entity.on("move", function () {
    if (entity.position.distanceTo(entity.lastPositionPlayersUpdated) > 2 * 32) entity.updateAndSpawn();
  });

  entity.destroy = function () {
    serv.destroyEntity(entity);
  };

  entity.attach = function (attachedEntity) {
    var leash = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var p = {
      entityId: attachedEntity.id,
      vehicleId: entity.id,
      leash: leash
    };
    if (entity.type == 'player') entity._client.write('attach_entity', p);
    entity._writeOthersNearby('attach_entity', p);
  };
};
//# sourceMappingURL=../../maps/lib/plugins/spawn.js.map
