
var net = require('net');
var EventEmitter = require('eventemitter2').EventEmitter2;

var services = [];
var babel = {};

babel.service = function( role, options, cb ) {

  var events = new EventEmitter();
  events.bind = function() {
    if( options.via == 'tcp' ){
      var adapter = require('./adapters/tcp')();
      var server = adapter.createServer( events );
      server.listen( 9999 );
      // console.log('server listen',server.address());
      cb( server );
    } else {
      console.log( 'inavlid via' );
    }
  };

  return events;
};

babel.client = function( role, options ) {

  var events = new EventEmitter();

  if( options.via == 'tcp' ){

    var adapter = require('./adapters/tcp')();
    var client = adapter.createClient( events, 9999 );

    // console.log('client connect',9999);

  } else {
    console.log( 'inavlid via' );
  }

  return events;
};

module.exports = babel;