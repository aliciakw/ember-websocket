var WebSocketServer = require('ws').Server;
var ws = new WebSocketServer({port: 7000});
var app = require('express')();
var http = require('http').Server(app);
var redis = require('redis').createClient();

redis.subscribe('live-changes');

http.listen(3000, function(){
  console.log('listening on *:3000');
});

ws.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('Hey! Welcome to my websocket challenge!');

  redis.on('message', function(channel, message){
    console.log('REDIS: '+ message); // this sends the data but there's something weird with the object
    ws.send(message);
  });

});
