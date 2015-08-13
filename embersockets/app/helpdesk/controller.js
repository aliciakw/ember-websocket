import Ember from 'ember';

export default Ember.Controller.extend({
  tickets: [],

  actions: {
    submitTicket: function() {
      let ticket = {
        name: this.get('name'),
        description: this.get('description'),
        createdAt: new Date()
      };

      this.get('tickets').addObject(ticket);
      this.set('name', '');
      this.set('description', '');
    }
  }
});
