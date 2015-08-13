import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('books', function(){});
  this.route('helpdesk', {path: '/'});
  this.route('chat');
});

export default Router;
