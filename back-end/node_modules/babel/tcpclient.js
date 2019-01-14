  
var babel = require('./babel');

var client = babel.client( 'webserver', { via: 'tcp' } );

client.on( 'connect', function ( socket ) {
  socket.write('data: hello');
  client.send( { hello: 'world' } );
  client.emit( 'message.greeting', { body: 'foo' } );
});