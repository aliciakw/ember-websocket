io.sockets.on('connection', function (socket) {
  console.log('A user has connected');
  socket.on('ticket-submitted', function (ticket) {
    console.log('A ticket has been submitted');
    socket.broadcast.emit('ticket-submitted', ticket);
  });
});