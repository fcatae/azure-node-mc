'use strict';

module.exports.server = function (serv) {
  serv.broadcast = function (message) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$whitelist = _ref.whitelist;
    var whitelist = _ref$whitelist === undefined ? serv.players : _ref$whitelist;
    var _ref$blacklist = _ref.blacklist;
    var blacklist = _ref$blacklist === undefined ? [] : _ref$blacklist;
    var _ref$system = _ref.system;
    var system = _ref$system === undefined ? false : _ref$system;

    if (whitelist.type == 'player') whitelist = [whitelist];

    if (typeof message == 'string') message = serv.parseClassic(message);

    whitelist.filter(function (w) {
      return blacklist.indexOf(w) == -1;
    }).forEach(function (player) {
      if (!system) player.chat(message);else player.system(message);
    });
  };

  serv.color = {
    'black': '&0',
    'dark_blue': '&1',
    'dark_green': '&2',
    'dark_cyan': '&3',
    'dark_red': '&4',
    'purple': '&5',
    'dark_purple': '&5',
    'gold': '&6',
    'gray': '&7',
    'grey': '&7',
    'dark_gray': '&8',
    'dark_grey': '&8',
    'blue': '&9',
    'green': '&a',
    'aqua': '&b',
    'cyan': '&b',
    'red': '&c',
    'pink': '&d',
    'light_purple': '&d',
    'yellow': '&e',
    'white': '&f',
    'random': '&k',
    'obfuscated': '&k',
    'bold': '&l',
    'strikethrough': '&m',
    'underlined': '&n',
    'underline': '&n',
    'italic': '&o',
    'italics': '&o',
    'reset': '&r'
  };

  serv.parseClassic = function (message) {
    if (typeof message == 'object') return message;
    var messageList = [];
    var text = '';
    var nextChanged = false;
    var color = 'white';
    var bold = false;
    var italic = false;
    var underlined = false;
    var strikethrough = false;
    var random = false;
    var colors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'k', 'l', 'm', 'n', 'o', 'r', '&'];
    var convertColor = ['black', 'dark_blue', 'dark_green', 'dark_cyan', 'dark_red', 'dark_purple', 'gold', 'gray', 'dark_gray', 'blue', 'green', 'aqua', 'red', 'light_purple', 'yellow', 'white', 'random', 'bold', 'strikethrough', 'underlined', 'italic', 'reset', '&'];

    function createJSON() {
      if (!text.trim()) return;
      messageList.push({
        text: text,
        color: color,
        bold: bold,
        italic: italic,
        underlined: underlined,
        strikethrough: strikethrough,
        obfuscated: random
      });
      text = '';
    }

    while (message != '') {
      var currChar = message[0];
      if (nextChanged) {
        var newColor = convertColor[colors.indexOf(currChar)];
        if (newColor) {
          if (newColor == 'bold') bold = true;else if (newColor == 'strikethrough') strikethrough = true;else if (newColor == 'underlined') underlined = true;else if (newColor == 'italic') italic = true;else if (newColor == 'random') random = true;else if (newColor == '&') text += '&';else if (newColor == 'reset') {
            strikethrough = false;
            bold = false;
            underlined = false;
            random = false;
            italic = false;
            color = 'white';
          } else color = newColor;
        }
        nextChanged = false;
      } else if (currChar == '&') {
        if (nextChanged) {
          text += '&';
          nextChanged = false;
        } else {
          nextChanged = true;
          createJSON();
        }
      } else {
        text += currChar;
      }

      message = message.slice(1, message.length);
    }
    createJSON();

    if (messageList.length > 0) return {
      text: '',
      extra: messageList
    };else return { text: '' };
  };
};

module.exports.player = function (player, serv) {
  player._client.on('chat', function () {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var message = _ref2.message;

    if (message[0] == "/") {
      player.behavior('command', { command: message.slice(1) }, function (_ref3) {
        var command = _ref3.command;
        return player.handleCommand(command);
      });
    } else {
      player.behavior('chat', {
        message: message,
        prefix: '<' + player.username + '> ',
        text: message,
        whitelist: serv.players,
        blacklist: []
      }, function (_ref4) {
        var prefix = _ref4.prefix;
        var text = _ref4.text;
        var whitelist = _ref4.whitelist;
        var blacklist = _ref4.blacklist;

        var obj = serv.parseClassic(prefix);
        if (!obj.extra) obj.extra = [];
        obj.extra.push(serv.parseClassic(text));
        serv.broadcast(obj, {
          whitelist: whitelist,
          blacklist: blacklist
        });
      });
    }
  });

  player.chat = function (message) {
    if (typeof message == 'string') message = serv.parseClassic(message);
    player._client.write('chat', { message: JSON.stringify(message), position: 0 });
  };

  player.emptyChat = function () {
    var count = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    for (var i = 0; i < count; i++) {
      player.chat('');
    }
  };

  player.system = function (message) {
    if (typeof message == 'string') message = serv.parseClassic(message);
    player._client.write('chat', { message: JSON.stringify(message), position: 2 });
  };
};
//# sourceMappingURL=../../maps/lib/plugins/chat.js.map
