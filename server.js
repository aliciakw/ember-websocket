var WebSocketServer = require('ws').Server;
var ws = new WebSocketServer({port: 7000});


ws.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('Hey! Welcome to my websocket challenge!');
});