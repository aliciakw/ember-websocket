import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.ActiveModelAdapter.extend({
  namespace: 'api/v1',
  host: 'http://localhost:3000'
  //host: ENV['serverURL']
//  headers: function() {
//    var authorization_string = (JSON.parse(localStorage.getItem('ember_simple_auth:session')));
//    return {
//      xmlrpc_token: authorization_string["xmlrpc_token"],
//      token: authorization_string["user_token"],
//      user_email: authorization_string["user_email"],
//      user_id: authorization_string["user_id"]
//    };
//  }.property().volatile()   //if the token expires we dont want to use a cached value. volatile forces this to not cache the return value.
});