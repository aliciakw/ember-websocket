export default Ember.Service.extend({
  socket: {},
  setup: function() {
    this.set('socket', io())
  }.on('init'),

  submitTicket: function(ticket) {
    this.get('socket').emit('ticket-submitted', ticket);
  }

});

