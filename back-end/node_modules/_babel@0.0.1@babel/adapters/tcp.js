
var net = require('net');
var EventEmitter = require('eventemitter2').EventEmitter2;

function middleware_proxy( data ) {
  if( data ){
    this.emit( 'data', data );
  }
}

function middleware_json( data, next ) {
  if( data ){
    var messages = data.match( /json>>(.*?)<<json/g );
    if( messages && messages.length ){
      messages.forEach( function( message ){
        var json = JSON.parse( message.substring( 6, message.length-6 ) );
        this.emit( 'message', json );
      }, this );
    }
    next( data.replace( /json>>(.*?)<<json/g, '' ) );
  }
}

function middleware_events( data, next ) {
  if( data ){
    var events = data.match( /event>>(.*?)<<event/g );
    if( events && events.length ){
      events.forEach( function( message ){
        var json = JSON.parse( message.substring( 7, message.length-7 ) );
        // console.log(json);
        if( json && json.body ) {
          this.emit( json.proto, json.body );
          data = data.replace( message, '' );
        }
        else {
          console.log('FAIL');
        }
      }, this );
    }
    next( data );
  }
}

module.exports = function(){

  return {
    createServer: function( bus ) {

      var proxy = new EventEmitter();

      var server = net.createServer( function ( socket ){

        bus.send = function( message ) {
          socket.write( 'json>>' + JSON.stringify( message ) + '<<json' );
        };

        var anyBack = function( message ){
          if( ['connect','error','data','message'].indexOf(bus.event) == -1 ) {
            socket.write( 'event>>' + JSON.stringify({ proto: bus.event, body: message }) + '<<event' );
          }
        };

        proxy.onAny( function( message ){
          bus.offAny( anyBack );
          bus.emit( proxy.event, message );
          bus.onAny( anyBack );
        });

        bus.onAny( anyBack );

        bus.emit( 'connect', socket );
        // socket.on( 'data', function( data ){ bus.emit( 'data', data ); });
        // socket.on( 'end', function( err ){ bus.emit( 'end', err ); });
        // socket.on( 'timeout', function( err ){ bus.emit( 'timeout', err ); });
        // socket.on( 'drain', function( err ){ bus.emit( 'drain', err ); });
        socket.on( 'error', function( err ){ bus.emit( 'error', err ); });
        // socket.on( 'close', function( err ){ bus.emit( 'close', err ); });

        socket.on( 'data', function( data ){
          data = data.toString('utf8');
          middleware_events.call( proxy, data, function( data ){
            middleware_json.call( proxy, data, function( data ){
              middleware_proxy.call( proxy, data );
            });
          });
        });
      });

      return server;
    },

    createClient: function( bus, port ) {

      var proxy = new EventEmitter();


      var socket = new net.connect({ port: port }, function(){
        bus.emit( 'connect', socket );
      });

      socket.setEncoding('utf8');
      // socket.on( 'data', function( data ){ bus.emit( 'data', data ); });
      // socket.on( 'end', function( err ){ bus.emit( 'end', err ); });
      // socket.on( 'timeout', function( err ){ bus.emit( 'timeout', err ); });
      // socket.on( 'drain', function( err ){ bus.emit( 'drain', err ); });
      socket.on( 'error', function( err ){ bus.emit( 'error', err ); });
      // socket.on( 'close', function( err ){ bus.emit( 'close', err ); });

      bus.send = function( message ) {
        socket.write( 'json>>' + JSON.stringify( message ) + '<<json' );
      };

      var anyBack = function( message ){
        if( ['connect','error','data','message'].indexOf(bus.event) == -1 ) {
          socket.write( 'event>>' + JSON.stringify({ proto: bus.event, body: message }) + '<<event' );
        }
      };

      proxy.onAny( function( message ){
        bus.offAny( anyBack );
        bus.emit( proxy.event, message );
        bus.onAny( anyBack );
      });

      bus.onAny( anyBack );

      socket.on( 'data', function( data ){
        data = data.toString('utf8');
        middleware_events.call( proxy, data, function( data ){
          middleware_json.call( proxy, data, function( data ){
            middleware_proxy.call( proxy, data );
          });
        });
      });

      return socket;
    }
  };
};