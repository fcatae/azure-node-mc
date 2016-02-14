// var http = require('http');
// 
// var port = process.env.PORT || 1337;
// 
// http.createServer(app).listen(port);
// 
// function app(req,res) {
//     res.end('hello world! I am listening at ' + port);
// }
// 
// console.log('hello world')

var mcServer = require("flying-squid");

mcServer.createMCServer({
  "motd": "A Minecraft Server \nRunning flying-squid",
  "port": process.env.PORT || 1337,
  "max-players": 10,
  "online-mode": true,
  "logging": true,
  "gameMode": 1,
  "generation": {
    "name": "diamond_square",
    "options":{
      "worldHeight": 80
    }
  },
  "kickTimeout": 10000,
  "plugins": {

  },
  "modpe": false,
  "view-distance": 10
});