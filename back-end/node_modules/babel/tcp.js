
var babel = require('./babel');

var service = babel.service( 'webserver', { via: 'tcp' } );

// service.on( 'connect', function ( socket ) {
//   // console.log("TCP server listening on port " + socket.address().port + " at localhost.");
// });

// service.on( 'connect', function ( socket ) {
//   // console.log("Hello World\n");
//   console.log("Connection from " + socket.remoteAddress);
//   socket.end("Hello World\n");
// });

// service.on( 'data', function( data ){
//   console.log( 'got data: ' + data );
// });

// service.on( 'message', function( message ){
//   console.log( 'got message :', message );
// });

// service.on( 'message.greeting', function( data ){
//   console.log( 'got message.greeting', data );
// });

// service.bind();

///

// setTimeout( function(){
try {
  var client = babel.client( 'webserver', { via: 'tcp' } );

  client.on( 'connect', function ( socket ) {
    socket.write('data: hello');
    client.send( { hello: 'world' } );
    client.emit( 'message.greeting', { body: 'foo' } );
  });
}
catch(e) {
  console.log( 'error', e );
}
  // client.emit( 'pie', { type: 'apricot' } );

// }, 1000 );



// var server = net.createServer(function (socket) {

//   // Every time someone connects, tell them hello and then close the connection.
//   socket.addListener("connect", function () {
//     sys.puts("Connection from " + socket.remoteAddress);
//     socket.end("Hello World\n");
//   });

// });

// server.listen( 0, function() {
//   console.log("TCP server listening on port " + server.address().port + " at localhost.");
//   var role = role('webserver',{ type: 'tcp' });
//   role.use( server.address() );
// });