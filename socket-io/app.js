var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(4200);

var redis = require('redis').createClient();
redis.subscribe('live-changes');
console.log('SERVER STARTED at PORT 4200');

app.use(express.static(__dirname + '/bower_components'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
  console.log('A user has connected');

  client.on('join', function(data) {
    console.log('join: ' +data);
  });

  client.on('messages', function(data) {
    client.emit('live-changes', data);
    client.broadcast.emit('live-changes',data);
  });

  redis.on('message', function(channel, message){
    console.log('redis: ' + message);
    client.broadcast.emit('live-changes', message);
  });
});
