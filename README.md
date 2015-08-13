#How To Put All The Pieces Together:

## I. Set Up A Websocket Connected to Ember and Rails
### a) Rails App with Redis

To start out, create a Rails App to serve as the API for an ember app. Set up Active Model Serializers, configure Rack-Cors, all that jazz. Make a Books model, and throw in some data just to start out.

__Files of note:__  

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
    

### b) Node Server within the Rails App
    $ mkdir websocket  # (at rails root)
    $ cd websocket
    $ npm init  # fill out responses
    $ npm install --save ws
    $ npm install redis express

create a file ws-server in the websocket directory

    var WebSocketServer = require('ws').Server;
    var ws = new WebSocketServer({port: 7000});
    var app = require('express')();
    var http = require('http').Server(app);
    var redis = require('redis').createClient();

    redis.subscribe('live-changes');

    http.listen(3000, function(){
      console.log('listening on *:3000');
    });

    ws.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });

      redis.on('message', function(channel, data){
        console.log('REDIS: '+ data);
        ws.send(data);
      });

    });


### c) Ember, with the Websockets add-on


setup your ember app (e.g. called “embersockets”) with ember-cli

    $ ember new embersockets
    $ ember install ember-websockets
    $ ember g initializer websocket

adapters/application.js

    import DS from 'ember-data';
    import ENV from '../config/environment';
    export default DS.ActiveModelAdapter.extend({
      namespace: 'api/v1',
      host: 'http://localhost:3000'
    });

intializers/websocket.js

    export function initialize(/* container, application */) {
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
      'connect-src': "'self' ws://localhost:7000 localhost:7000 localhost:3000",
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
 
# II. Set Up the Books Index Page to update without page refresh using the Websocket

controllers/books.js  

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
      }
    });
    
So now, if you open up the rails console and Create or Update any books, when you commit the changes to the database, callbacks in the Rails Book model send a message containing the record (as JSON) that was updated to the websocket through Redis. When the websocket server receives the message from Redis, it sends it off to the Ember app. When the Ember app receives the notification that a record has changed, the new file data is "pushed" into the datastore, causing the data displayed to instantly update, without the user having to refresh the page or anything. 

###### This still has some problems!

* Right now you need to start everything up in the right order or there are problems: 
  1. ` bundle exec rails s`
  2. ` ember server` & load the page at localhost:4200 in your browser to display all of the data.
  3. ` node ws-server.js` & refresh the page at localhost:4200 in your browser.
  4. Now everything should be working properly unless you change any ember code, in which case you will have to stop the websocket server, rerender the ember page without the websocket connection, and then restart the websocket server, and then refresh the page at localhost:4200 again. 
  
So obviously this needs to be fixed before can add it into the real project, probably an issue with when the websocket initialized in the ember app or something. Also, probably want to start the websocket server with Foreman to make sure it starts _after_ the rails server at localhost:3000 has fully booted.

* Not sure what happens with sideloaded data atm
