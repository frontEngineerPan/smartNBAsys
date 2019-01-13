
should = require 'should'
babel = require '../babel'

describe 'service', ->

  it 'should bind and close a tcp server', (done) ->

    service = babel.service 'webserver', { via: 'tcp' }, ( server ) ->
      server.close() && done()

    service.bind()

describe 'client', ->

  it 'should error when server is unavailable', (done) ->

    client = babel.client 'webserver', { via: 'tcp' }

    client.on 'error', (connectionException) ->
      connectionException.errno.should.equal 'ECONNREFUSED'
      done()

describe 'client / server transports', ->

  it 'should call the connect event once per client', (done) ->

    clients = 3
    service = babel.service 'webserver', { via: 'tcp' }, ( server ) ->

      service.on 'connect', ( socket ) ->
        server.close() && done() if --clients is 0

      babel.client 'webserver', { via: 'tcp' }
      babel.client 'webserver', { via: 'tcp' }
      babel.client 'webserver', { via: 'tcp' }

    service.bind()

describe 'buffer transport', ->

  it 'should send buffers: client -> server', (done) ->

    s = {}
    service = babel.service 'webserver', { via: 'tcp' }, ( server ) -> s = server
    service.on 'data', (buffer) ->
      buffer.should.eql 'some dummy text'
      s.close() && done()
    service.bind()

    client = babel.client 'webserver', { via: 'tcp' }
    client.on 'connect', ( socket ) -> socket.write 'some dummy text'

  it 'should send buffers: client <- server', (done) ->

    s = {}
    service = babel.service 'webserver', { via: 'tcp' }, ( server ) -> s = server
    service.on 'connect', ( socket ) -> socket.write 'some dummy text'
    service.bind()

    client = babel.client 'webserver', { via: 'tcp' }
    client.on 'data', (buffer) ->
      buffer.should.eql 'some dummy text'
      s.close() && done()

describe 'message transport', ->

  it 'should send messages: client -> server', (done) ->

    s = {}
    service = babel.service 'webserver', { via: 'tcp' }, ( server ) -> s = server
    service.on 'message', (buffer) ->
      buffer.should.eql 'some dummy text'
      s.close() && done()
    service.bind()

    client = babel.client 'webserver', { via: 'tcp' }
    client.on 'connect', ( socket ) -> client.send 'some dummy text'

  it 'should send messages: client <- server', (done) ->

    s = {}
    service = babel.service 'webserver', { via: 'tcp' }, ( server ) -> s = server
    service.on 'connect', ( socket ) -> service.send 'some dummy text'
    service.bind()

    client = babel.client 'webserver', { via: 'tcp' }
    client.on 'message', (buffer) ->
      buffer.should.eql 'some dummy text'
      s.close() && done()

describe 'event transport', ->

  it 'should send events: client -> server', (done) ->

    s = {}
    service = babel.service 'webserver', { via: 'tcp' }, ( server ) -> s = server
    service.on 'test.event', (message) ->
      message.should.eql { test: 'data' }
      s.close() && done()
    service.bind()

    client = babel.client 'webserver', { via: 'tcp' }
    client.on 'connect', ( socket ) -> client.emit 'test.event', { test: 'data' }

  it 'should send events: client <- server', (done) ->

    s = {}
    service = babel.service 'webserver', { via: 'tcp' }, ( server ) -> s = server
    service.on 'connect', ( socket ) -> service.emit 'test.event', { test: 'data' }
    service.bind()

    client = babel.client 'webserver', { via: 'tcp' }
    client.on 'data', console.log
    client.on 'test.event', (message) ->
      message.should.eql { test: 'data' }
      s.close() && done()