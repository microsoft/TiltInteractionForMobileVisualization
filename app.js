(function () {

  // "use strict";

  var express = require('express');
  var app = express();
  var server = require('http').createServer(app);
  var io = require('socket.io')(server);
  var serverPort = process.env.PORT || 8080;
 

  app.use(express.static('public'));

  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

  server.listen(serverPort, function() {
    console.log('Server started on port %s', serverPort);
  });

  io.on('connection', function (socket) {
    io.set('transports', ['websocket']);
    var now = new Date();
    io.emit('new_connection', { 
      port: serverPort,
      timestamp: now
    });
    console.log('new_connection',{ 
      port: serverPort,
      timestamp: now
    });
  });

})();
