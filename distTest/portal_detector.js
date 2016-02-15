"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _require$portal_detector = require("flying-squid").portal_detector;

var detectFrame = _require$portal_detector.detectFrame;
var findPotentialLines = _require$portal_detector.findPotentialLines;
var findBorder = _require$portal_detector.findBorder;
var getAir = _require$portal_detector.getAir;
var generateLine = _require$portal_detector.generateLine;
var generatePortal = _require$portal_detector.generatePortal;
var makeWorldWithPortal = _require$portal_detector.makeWorldWithPortal;

var Vec3 = require("vec3").Vec3;
var assert = require('chai').assert;
var range = require('range').range;

describe("Generate portal", function () {
  it("generate a line", function () {
    assert.deepEqual(generateLine(new Vec3(3, 1, 1), new Vec3(1, 0, 0), 2), [new Vec3(3, 1, 1), new Vec3(4, 1, 1)]);
  });
  it("generate a portal", function () {
    assert.deepEqual(generatePortal(new Vec3(2, 1, 1), new Vec3(1, 0, 0), 4, 5), {
      bottom: generateLine(new Vec3(3, 1, 1), new Vec3(1, 0, 0), 2),
      left: generateLine(new Vec3(2, 2, 1), new Vec3(0, 1, 0), 3),
      right: generateLine(new Vec3(5, 2, 1), new Vec3(0, 1, 0), 3),
      top: generateLine(new Vec3(3, 5, 1), new Vec3(1, 0, 0), 2),
      air: generateLine(new Vec3(3, 2, 1), new Vec3(0, 1, 0), 3).concat(generateLine(new Vec3(4, 2, 1), new Vec3(0, 1, 0), 3))
    });
  });
});

describe("Detect portal", function () {
  this.timeout(60 * 1000);
  var portalData = [];
  portalData.push({
    name: "simple portal frame x",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 4,
    height: 5,
    additionalAir: [],
    additionalObsidian: []
  });
  portalData.push({
    name: "simple portal frame z",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(0, 0, 1),
    width: 4,
    height: 5,
    additionalAir: [],
    additionalObsidian: []
  });
  portalData.push({
    name: "big simple portal frame x",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 10,
    height: 10,
    additionalAir: [],
    additionalObsidian: []
  });
  portalData.push({
    name: "simple portal frame x with borders",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 4,
    height: 5,
    additionalAir: [],
    additionalObsidian: [new Vec3(2, 1, 1), new Vec3(5, 1, 1), new Vec3(2, 6, 1), new Vec3(5, 6, 1)]
  });

  var _generatePortal = generatePortal(new Vec3(2, 1, 2), new Vec3(1, 0, 0), 4, 5);

  var bottom = _generatePortal.bottom;
  var left = _generatePortal.left;
  var right = _generatePortal.right;
  var top = _generatePortal.top;
  var air = _generatePortal.air;

  portalData.push({
    name: "2 portals",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 4,
    height: 5,
    additionalAir: air,
    additionalObsidian: [].concat.apply([], [bottom, left, right, top])
  });

  portalData.push({
    name: "huge simple portal frame z",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(0, 0, 1),
    width: 50,
    height: 50,
    additionalAir: [],
    additionalObsidian: []
  });

  portalData.forEach(function (_ref) {
    var name = _ref.name;
    var bottomLeft = _ref.bottomLeft;
    var direction = _ref.direction;
    var width = _ref.width;
    var height = _ref.height;
    var additionalAir = _ref.additionalAir;
    var additionalObsidian = _ref.additionalObsidian;

    var portal = generatePortal(bottomLeft, direction, width, height);
    var bottom = portal.bottom;
    var left = portal.left;
    var right = portal.right;
    var top = portal.top;
    var air = portal.air;

    describe("Detect " + name, function () {
      var expectedBorder = { bottom: bottom, left: left, right: right, top: top };

      var world = undefined;
      before(function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(makeWorldWithPortal(portal, additionalAir, additionalObsidian));

            case 2:
              world = context$4$0.sent;

            case 3:
            case "end":
              return context$4$0.stop();
          }
        }, null, this);
      });

      describe("detect potential first lines", function () {
        it("detect potential first lines from bottom left", function callee$4$0() {
          var potentialLines;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findPotentialLines(world, bottom[0], new Vec3(0, 1, 0)));

              case 2:
                potentialLines = context$5$0.sent;

                assert.include(potentialLines, {
                  "direction": direction,
                  "line": bottom
                });

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });

        it("detect potential first lines from bottom right", function callee$4$0() {
          var potentialLines;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findPotentialLines(world, bottom[bottom.length - 1], new Vec3(0, 1, 0)));

              case 2:
                potentialLines = context$5$0.sent;

                assert.include(potentialLines, {
                  "direction": direction,
                  "line": bottom
                });

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });

        it("detect potential first lines from top left", function callee$4$0() {
          var potentialLines;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findPotentialLines(world, top[0], new Vec3(0, -1, 0)));

              case 2:
                potentialLines = context$5$0.sent;

                assert.include(potentialLines, {
                  "direction": direction,
                  "line": top
                });

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });

        it("detect potential first lines from top right", function callee$4$0() {
          var potentialLines;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findPotentialLines(world, top[top.length - 1], new Vec3(0, -1, 0)));

              case 2:
                potentialLines = context$5$0.sent;

                assert.include(potentialLines, {
                  "direction": direction,
                  "line": top
                });

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });

        it("detect potential first lines from left top", function callee$4$0() {
          var potentialLines;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findPotentialLines(world, left[left.length - 1], direction));

              case 2:
                potentialLines = context$5$0.sent;

                assert.include(potentialLines, {
                  "direction": new Vec3(0, 1, 0),
                  "line": left
                });

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });

        it("detect potential first lines from right bottom", function callee$4$0() {
          var potentialLines;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findPotentialLines(world, right[0], direction.scaled(-1)));

              case 2:
                potentialLines = context$5$0.sent;

                assert.include(potentialLines, {
                  "direction": new Vec3(0, 1, 0),
                  "line": right
                });

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
      });

      describe("find borders", function () {
        it("find borders from bottom", function callee$4$0() {
          var border;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findBorder(world, {
                  "direction": direction,
                  "line": bottom
                }, new Vec3(0, 1, 0)));

              case 2:
                border = context$5$0.sent;

                assert.deepEqual(border, expectedBorder);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });

        it("find borders from top", function callee$4$0() {
          var border;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findBorder(world, {
                  "direction": direction,
                  "line": top
                }, new Vec3(0, -1, 0)));

              case 2:
                border = context$5$0.sent;

                assert.deepEqual(border, expectedBorder);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });

        it("find borders from left", function callee$4$0() {
          var border;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findBorder(world, {
                  "direction": new Vec3(0, 1, 0),
                  "line": left
                }, direction));

              case 2:
                border = context$5$0.sent;

                assert.deepEqual(border, expectedBorder);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
        it("find borders from right", function callee$4$0() {
          var border;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(findBorder(world, {
                  "direction": new Vec3(0, 1, 0),
                  "line": right
                }, direction.scaled(-1)));

              case 2:
                border = context$5$0.sent;

                assert.deepEqual(border, expectedBorder);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
      });

      describe("detect portals", function () {
        it("detect portals from bottom left", function callee$4$0() {
          var portals;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(detectFrame(world, bottom[0], new Vec3(0, 1, 0)));

              case 2:
                portals = context$5$0.sent;

                assert.deepEqual(portals, [portal]);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
        it("detect portals from top left", function callee$4$0() {
          var portals;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(detectFrame(world, top[0], new Vec3(0, -1, 0)));

              case 2:
                portals = context$5$0.sent;

                assert.deepEqual(portals, [portal]);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
        it("detect portals from right top", function callee$4$0() {
          var portals;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(detectFrame(world, right[right.length - 1], direction.scaled(-1)));

              case 2:
                portals = context$5$0.sent;

                assert.deepEqual(portals, [portal]);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
      });

      it("get air", function () {
        var foundAir = getAir(expectedBorder);
        assert.deepEqual(foundAir, air);
      });
    });
  });
});

describe("Doesn't detect non-portal", function () {
  var portalData = [];

  portalData.push({
    name: "simple portal frame x with one obsidian in the middle",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 5,
    height: 5,
    additionalAir: [],
    additionalObsidian: [new Vec3(4, 3, 1)]
  });

  portalData.forEach(function (_ref2) {
    var name = _ref2.name;
    var bottomLeft = _ref2.bottomLeft;
    var direction = _ref2.direction;
    var width = _ref2.width;
    var height = _ref2.height;
    var additionalAir = _ref2.additionalAir;
    var additionalObsidian = _ref2.additionalObsidian;

    var portal = generatePortal(bottomLeft, direction, width, height);
    var bottom = portal.bottom;
    var left = portal.left;
    var right = portal.right;
    var top = portal.top;

    describe("Doesn't detect detect " + name, function () {
      var world = undefined;
      before(function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(makeWorldWithPortal(portal, additionalAir, additionalObsidian));

            case 2:
              world = context$4$0.sent;

            case 3:
            case "end":
              return context$4$0.stop();
          }
        }, null, this);
      });

      describe("doesn't detect portals", function () {
        it("doesn't detect portals from bottom left", function callee$4$0() {
          var portals;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(detectFrame(world, bottom[0], new Vec3(0, 1, 0)));

              case 2:
                portals = context$5$0.sent;

                assert.deepEqual(portals, []);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
        it("doesn't detect portals from top left", function callee$4$0() {
          var portals;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(detectFrame(world, top[0], new Vec3(0, -1, 0)));

              case 2:
                portals = context$5$0.sent;

                assert.deepEqual(portals, []);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
        it("doesn't detect portals from right top", function callee$4$0() {
          var portals;
          return _regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return _regeneratorRuntime.awrap(detectFrame(world, right[right.length - 1], direction.scaled(-1)));

              case 2:
                portals = context$5$0.sent;

                assert.deepEqual(portals, []);

              case 4:
              case "end":
                return context$5$0.stop();
            }
          }, null, this);
        });
      });
    });
  });
});
//# sourceMappingURL=maps/portal_detector.js.map
