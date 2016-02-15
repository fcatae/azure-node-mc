'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var Vec3 = require("vec3").Vec3;
var assert = require('assert');
var flatMap = require('flatmap');
var range = require('range').range;

module.exports = { detectFrame: detectFrame, findPotentialLines: findPotentialLines, findBorder: findBorder, getAir: getAir, generateLine: generateLine, generatePortal: generatePortal, addPortalToWorld: addPortalToWorld, makeWorldWithPortal: makeWorldWithPortal };

function findLineInDirection(world, startingPoint, type, direction, directionV) {
  var line, point;
  return _regeneratorRuntime.async(function findLineInDirection$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        line = [];
        point = startingPoint;

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(world.getBlock(point));

      case 4:
        context$1$0.t1 = context$1$0.sent.name;
        context$1$0.t2 = type;
        context$1$0.t0 = context$1$0.t1 == context$1$0.t2;

        if (!context$1$0.t0) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(world.getBlockType(point.plus(directionV)));

      case 10:
        context$1$0.t3 = context$1$0.sent;
        context$1$0.t0 = context$1$0.t3 == 0;

      case 12:
        if (!context$1$0.t0) {
          context$1$0.next = 17;
          break;
        }

        line.push(point);
        point = point.plus(direction);
        context$1$0.next = 2;
        break;

      case 17:
        return context$1$0.abrupt('return', line);

      case 18:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function findLine(world, startingPoint, type, direction, directionV) {
  var firstSegment, secondSegment;
  return _regeneratorRuntime.async(function findLine$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(findLineInDirection(world, startingPoint.plus(direction.scaled(-1)), type, direction.scaled(-1), directionV));

      case 2:
        firstSegment = context$1$0.sent.reverse();
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(findLineInDirection(world, startingPoint, type, direction, directionV));

      case 5:
        secondSegment = context$1$0.sent;
        return context$1$0.abrupt('return', firstSegment.concat(secondSegment));

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function findPotentialLines(world, startingPoint, directionV) {
  var firstLineDirection;
  return _regeneratorRuntime.async(function findPotentialLines$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        firstLineDirection = directionV.y != 0 ? [new Vec3(1, 0, 0), new Vec3(0, 0, 1)] : [new Vec3(0, 1, 0)];
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(_Promise.all(firstLineDirection.map(function callee$1$0(d) {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.t0 = d;
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(findLine(world, startingPoint, 'obsidian', d, directionV));

              case 3:
                context$2$0.t1 = context$2$0.sent;
                return context$2$0.abrupt('return', {
                  direction: context$2$0.t0,
                  line: context$2$0.t1
                });

              case 5:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        })));

      case 3:
        context$1$0.t0 = function (line) {
          return line.line.length >= 3 && line.direction.y != 0 || line.line.length >= 2 && line.direction.y == 0;
        };

        return context$1$0.abrupt('return', context$1$0.sent.filter(context$1$0.t0));

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function positiveOrder(line, direction) {
  if (direction.x == -1 || direction.y == -1 || direction.z == -1) return line.reverse();
  return line;
}

function findBorder(world, _ref, directionV) {
  var line = _ref.line;
  var direction = _ref.direction;

  var bottom, left, right, top, _ref2, _ref3, _ref32, horDir, _ref4, _ref42;

  return _regeneratorRuntime.async(function findBorder$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        bottom = line;

        if (!(bottom.length == 0)) {
          context$1$0.next = 3;
          break;
        }

        return context$1$0.abrupt('return', []);

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(findLineInDirection(world, bottom[0].plus(direction.scaled(-1).plus(directionV)), 'obsidian', directionV, direction));

      case 5:
        left = context$1$0.sent;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(findLineInDirection(world, bottom[line.length - 1].plus(direction).plus(directionV), 'obsidian', directionV, direction.scaled(-1)));

      case 8:
        right = context$1$0.sent;

        if (!(left.length == 0 || left.length != right.length)) {
          context$1$0.next = 11;
          break;
        }

        return context$1$0.abrupt('return', null);

      case 11:
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(findLineInDirection(world, left[left.length - 1].plus(direction).plus(directionV), 'obsidian', direction, directionV.scaled(-1)));

      case 13:
        top = context$1$0.sent;

        if (!(bottom.length != top.length)) {
          context$1$0.next = 16;
          break;
        }

        return context$1$0.abrupt('return', null);

      case 16:

        left = positiveOrder(left, directionV);
        right = positiveOrder(right, directionV);
        top = positiveOrder(top, direction);

        if (direction.y != 0) {
          ;

          _ref2 = [left, bottom, top, right];
          bottom = _ref2[0];
          left = _ref2[1];
          right = _ref2[2];
          top = _ref2[3];
        }_ref3 = directionV.y < 0 ? [top, bottom] : [bottom, top];
        _ref32 = _slicedToArray(_ref3, 2);
        bottom = _ref32[0];
        top = _ref32[1];
        horDir = direction.x != 0 || directionV.x != 0 ? 'x' : 'z';
        _ref4 = direction[horDir] < 0 || directionV[horDir] < 0 ? [right, left] : [left, right];
        _ref42 = _slicedToArray(_ref4, 2);
        left = _ref42[0];
        right = _ref42[1];

        if (!(bottom.length < 2 || top.length < 2 || left.length < 3 || right.length < 3)) {
          context$1$0.next = 31;
          break;
        }

        return context$1$0.abrupt('return', null);

      case 31:
        return context$1$0.abrupt('return', { bottom: bottom, left: left, right: right, top: top });

      case 32:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function detectFrame(world, startingPoint, directionV) {
  var potentialLines;
  return _regeneratorRuntime.async(function detectFrame$(context$1$0) {
    var _this2 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(findPotentialLines(world, startingPoint, directionV));

      case 2:
        potentialLines = context$1$0.sent;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(_Promise.all(potentialLines.map(function (line) {
          return findBorder(world, line, directionV);
        })));

      case 5:
        context$1$0.t0 = function (border) {
          return border != null;
        };

        context$1$0.t1 = function (_ref5) {
          var bottom = _ref5.bottom;
          var left = _ref5.left;
          var right = _ref5.right;
          var top = _ref5.top;
          return { bottom: bottom, left: left, right: right, top: top, air: getAir({ bottom: bottom, left: left, right: right, top: top }) };
        };

        context$1$0.t2 = context$1$0.sent.filter(context$1$0.t0).map(context$1$0.t1);

        context$1$0.t3 = function callee$1$0(_ref6) {
          var air = _ref6.air;
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap(isAllAir(world, air));

              case 2:
                return context$2$0.abrupt('return', context$2$0.sent);

              case 3:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this2);
        };

        return context$1$0.abrupt('return', asyncFilter(context$1$0.t2, context$1$0.t3));

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function asyncEvery(array, pred) {
  return _regeneratorRuntime.async(function asyncEvery$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt('return', _Promise.all(array.map(function (x) {
          return pred(x).then(function (y) {
            return y ? true : _Promise.reject(false);
          });
        })).then(function (results) {
          return true;
        })['catch'](function (x) {
          return false;
        }));

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function asyncFilter(array, pred) {
  return _Promise.all(array.map(function (e) {
    return pred(e).then(function (a) {
      return a ? e : null;
    });
  })).then(function (r) {
    return r.filter(function (a) {
      return a != null;
    });
  });
}

function isAllAir(world, blocks) {
  return _regeneratorRuntime.async(function isAllAir$(context$1$0) {
    var _this3 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt('return', asyncEvery(blocks, function callee$1$0(block) {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap(world.getBlockType(block));

              case 2:
                context$2$0.t0 = context$2$0.sent;
                return context$2$0.abrupt('return', context$2$0.t0 == 0);

              case 4:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this3);
        }));

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function getAir(border) {
  var bottom = border.bottom;
  var top = border.top;

  return flatMap(bottom, function (pos) {
    return range(1, top[0].y - bottom[0].y).map(function (i) {
      return pos.offset(0, i, 0);
    });
  });
}

var World = require('prismarine-world');
var Chunk = require('prismarine-chunk')(require("./version"));

function generateLine(startingPoint, direction, length) {
  return range(0, length).map(function (i) {
    return startingPoint.plus(direction.scaled(i));
  });
}

function generatePortal(bottomLeft, direction, width, height) {
  var directionV = new Vec3(0, 1, 0);
  return {
    bottom: generateLine(bottomLeft.plus(direction), direction, width - 2),
    left: generateLine(bottomLeft.plus(directionV), directionV, height - 2),
    right: generateLine(bottomLeft.plus(direction.scaled(width - 1)).plus(directionV), directionV, height - 2),
    top: generateLine(bottomLeft.plus(directionV.scaled(height - 1).plus(direction)), direction, width - 2),
    air: flatMap(generateLine(bottomLeft.plus(direction).plus(directionV), direction, width - 2), function (p) {
      return generateLine(p, directionV, height - 2);
    })
  };
}

function addPortalToWorld(world, portal, additionalAir, additionalObsidian) {
  var setBlockType = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

  if (setBlockType == null) setBlockType = world.setBlockType.bind(world);
  var bottom = portal.bottom;
  var left = portal.left;
  var right = portal.right;
  var top = portal.top;
  var air = portal.air;

  var p = flatMap([bottom, left, right, top], function (border) {
    return border.map(function (pos) {
      return setBlockType(pos, 49);
    });
  });
  p.push(air.map(function (pos) {
    return setBlockType(pos, 0);
  }));

  p.push(additionalAir.map(function (pos) {
    return setBlockType(pos, 0);
  }));
  p.push(additionalObsidian.map(function (pos) {
    return setBlockType(pos, 49);
  }));

  return _Promise.all(p);
}

function makeWorldWithPortal(portal, additionalAir, additionalObsidian) {
  var world;
  return _regeneratorRuntime.async(function makeWorldWithPortal$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        world = new World(function () {
          return new Chunk();
        });
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(addPortalToWorld(world, portal, additionalAir, additionalObsidian));

      case 3:
        return context$1$0.abrupt('return', world);

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}
//# sourceMappingURL=../maps/lib/portal_detector.js.map
