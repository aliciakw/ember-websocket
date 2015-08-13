import Ember from 'ember';

export default Ember.Controller.extend({

  init: function() {
    this._super();
    var socket = this.get('websockets').socketFor('ws://localhost:7000/');
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', function(event) {
      console.log('closed');
    }, this);
  },

  myOpenHandler: function(event) {
    console.log('On open event has been called: ' + event);
  },

  myMessageHandler: function(event) {
    var book = JSON.parse(event.data).obj;
    var action = JSON.parse(event.data).action;
    if (action === "update" || action === "create"){
      this.store.push('book', book);
    }

  },

  actions: {
    sendButtonPressed: function() {
      var socket = this.get('websockets').socketFor('ws://localhost:7000/');
      socket.send('Hello Websocket World');

      console.log('Push data into store!');
      this.store.push('book', {
        id: 1,
        title: "TaiPIZZA",
        author: "Tao Lin",
        num_pages: 248
      });

    }
  }
});