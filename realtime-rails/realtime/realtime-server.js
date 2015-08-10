var io = require('socket.io').listen(5001);
var redis = require('redis').createClient();
redis.subscribe('rt-change');
console.log('SERVER STARTED at PORT 5001');

io.on('connection', function(socket){
  redis.on('message', function(channel, message){
    console.log(message); // this sends the data but there's something weird with the object
    socket.emit('rt-change', JSON.parse(message)); // where is this emitted?
  });
});
