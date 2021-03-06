'use strict';

var Chunk = require('prismarine-chunk')(require("../version"));
var Vec3 = require('vec3').Vec3;

function generation() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$opt = _ref.opt;
  var opt = _ref$opt === undefined ? 'default' : _ref$opt;
  var _ref$bottom_id = _ref.bottom_id;
  var bottom_id = _ref$bottom_id === undefined ? 7 : _ref$bottom_id;
  var _ref$middle_id = _ref.middle_id;
  var middle_id = _ref$middle_id === undefined ? 1 : _ref$middle_id;
  var _ref$top_id = _ref.top_id;
  var top_id = _ref$top_id === undefined ? 2 : _ref$top_id;
  var _ref$middle_thickness = _ref.middle_thickness;
  var middle_thickness = _ref$middle_thickness === undefined ? 3 : _ref$middle_thickness;
  var _ref$debug = _ref.debug;
  var debug = _ref$debug === undefined ? false : _ref$debug;

  function generateChunk() {
    var chunk = new Chunk();
    var height = middle_thickness + 1;
    var DEBUG_POINTS = [new Vec3(0, height, 0), new Vec3(15, height, 0), new Vec3(0, height, 15), new Vec3(15, height, 15)];
    for (var x = 0; x < 16; x++) {
      for (var z = 0; z < 16; z++) {
        for (var y = 0; y < middle_thickness + 2; y++) {
          if (y == 0) chunk.setBlockType(new Vec3(x, y, z), bottom_id);else if (y < middle_thickness + 1) chunk.setBlockType(new Vec3(x, y, z), middle_id);else chunk.setBlockType(new Vec3(x, y, z), top_id);
        }
        for (var y = 0; y < 256; y++) {
          chunk.setSkyLight(new Vec3(x, y, z), 15);
        }
      }
    }

    if (debug) DEBUG_POINTS.forEach(function (p) {
      return chunk.setBlockType(p, 35);
    });
    return chunk;
  }
  return generateChunk;
}

module.exports = generation;
//# sourceMappingURL=../../maps/lib/worldGenerations/superflat.js.map
