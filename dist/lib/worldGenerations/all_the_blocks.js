'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var Chunk = require('prismarine-chunk')(require("../version"));
var Vec3 = require('vec3').Vec3;
var blocks = require("minecraft-data")(require("../version")).blocks;

function generation() {
  function generateSimpleChunk() {
    var chunk = new Chunk();

    var i = 2;
    for (var x = 0; x < 16; x++) {
      for (var z = 0; z < 16; z++) {
        var y = undefined;
        for (y = 47; y <= 50; y++) {
          chunk.setBlockType(new Vec3(x, y, z), i);
          i = (i + 1) % _Object$keys(blocks).length;
        }
        for (y = 0; y < 256; y++) {
          chunk.setSkyLight(new Vec3(x, y, z), 15);
        }
      }
    }
    return chunk;
  }
  return generateSimpleChunk;
}

module.exports = generation;
//# sourceMappingURL=../../maps/lib/worldGenerations/all_the_blocks.js.map
