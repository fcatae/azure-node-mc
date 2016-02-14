var http = require('http');

http.createServer(app).listen(80);

function app(req,res) {
    res.end('hello world!');
}

console.log('hello world')