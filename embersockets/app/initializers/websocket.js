export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'websockets',
  initialize: function(container, app) {
    app.inject('controller', 'websockets', 'service:websockets');
  }
};

// originally the name was just 'websocket'
// Since there is already a service called 'websockets' we don't have to register it.