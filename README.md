#How To Put All The Pieces Together:

## 1 - Rails App with Redis

config/initializers/redis.rb
` $redis = Redis.new(:host => 'localhost', :port=> 6379) `

Gemfile
` gem ‘redis' `

command line:
` $ redis-server `
(...or  `redis-server &`  to keep it running in the bg)

add callbacks to your models to log changes to the db via redis, like this:

    class Book < ActiveRecord::Base

      after_create {|book| book.message 'create' }
      after_update {|book| book.message 'update' }
      after_destroy {|book| book.message 'destroy' }

      def message action
        msg = { resource: 'books',
                action: action,
                id: self.id,
                obj: self }
    
      $redis.publish ‘<CHANNEL_NAME>', msg.to_json
      end
    end

## 2 - Node Server within the Rails App
    $ mkdir websocket  # (at rails root)
    $ cd websocket
    $ npm init  # fill out responses
    $ npm install --save ws


## 3 - Ember, with the Websockets add-on
setup your ember app (e.g. called “embersockets”) with ember-cli

    $ ember new embersockets
    $ ember install ember-websockets
    $ ember g initializer websocket

intializers/websocket.js

    export function initialize(/* container, application */) {
      // application.inject('route', 'foo', 'service:foo');
    }

    export default {
      name: 'websockets',
      initialize: function(container, app) {
        app.inject('controller', 'websockets', 'service:websockets');
      }
    };
 
Add a content security policy to the ENV= { … } in config/environment.js. Otherwise ember will throw ‘unauthorized’ errors on the websocket connection

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
      'font-src': "'self'",
      'connect-src': "'self' ws://localhost:7000 localhost:7000",
      'img-src': "'self'",
      'report-uri':"'localhost'",
      'style-src': "'self' 'unsafe-inline'",
      'frame-src': "'none'"
    }

In controller files that make use of the websocket:
Add an init function that finds the websocket connection, saves it to a variable, and maps controller functions to socket messages/states
You can also contact the websocket from Ember via actions.
    ...
    init: function() {
        this._super();
        var socket = this.get('websockets').socketFor('ws://localhost:7000/');
        socket.on('open', this.myOpenHandler, this);
        socket.on('message', this.myMessageHandler, this);
        socket.on('close', function(event) {
            console.log('closed');
        }, this);
      },
      message: '',
    
      myOpenHandler: function(event) {
        console.log('On open event has been called: ' + event);
      },
    
      myMessageHandler: function(event) {
        console.log('Message: ' + event.data);
        this.set('message',event.data);
      },
    
      actions: {
        sendButtonPressed: function() {
          var socket = this.get('websockets').socketFor('ws://localhost:7000/');
          socket.send('Hello Websocket World');
        }
      }
    … 

## References:

* http://www.programwitherik.com/getting-started-with-web-sockets-and-ember/
* http://liamkaufman.com/blog/2013/02/27/adding-real-time-to-a-restful-rails-app/ 
* http://cball.me/realtime-app-version-notices/