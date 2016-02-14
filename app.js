var http = require('http');

var port = process.env.PORT || 1337;

http.createServer(app).listen(port);

function app(req,res) {
    res.end('hello world!');
}

console.log('hello world')