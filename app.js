(function () {

  // "use strict";

  var express = require('express');
  var app = express();
  var path = require('path');
  var server = require('http').createServer(app);
  var io = require('socket.io')(server);
  var serverPort = process.env.PORT || 8080;
  var participantList = require("./participantList");
  var progressList = [];
  var completedList = [];
  var animation_count = 0;
  var multiples_count = 0;
  // var num_orderings = 2;
  // var ordering_count = [0,0];
  // if (participantList.length > 17) {
  num_orderings = 5;
  ordering_count = [0,0,0,0,0];
  // }

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
    
    socket.on('userID', function(msg){
      var now = new Date();
      if (participantList.length > 0) { // move next participant to progress list
        participantList[0].user_id = msg.userID;
        io.emit('new_participant', { 
          participant: participantList[0].participant,
          user_id: participantList[0].user_id,
          condition: participantList[0].condition,
          ordering: participantList[0].ordering,
          userAgent: msg.userAgent,
          timestamp: now
        });
        console.log('new_participant',{ 
          participant: participantList[0].participant,
          user_id: participantList[0].user_id,
          condition: participantList[0].condition,
          ordering: participantList[0].ordering,
          userAgent: msg.userAgent,
          timestamp: now
        });
        progressList.push(participantList[0]);
        participantList.splice(0,1);
      }
      else if (completedList.length > 0){ //add extra participant considering the completed participants and their condition/orderings 
        var extra_ordering = 0;
        extra_ordering = ordering_count.indexOf(Math.min.apply(Math, ordering_count)); 
        if (extra_ordering == -1) {
          extra_ordering = 0;
        }

        var extra = {
          'user_id': msg.userID,
          'participant': completedList.length + progressList.length,
          'condition': 'multiples',
          // 'condition': animation_count <= multiples_count ? 'animation' : 'multiples',
          'ordering': extra_ordering,
          'timestamp': now,
          'userAgent': msg.userAgent,
          'note': 'extra participant (at least one participant completed)'
        }; 
        io.emit('new_participant',extra);
        console.log('new_participant',extra);
        progressList.push(extra); 
      }
      else if (progressList.length > 0) {  //add extra participant when no one has finished yet 
        var surplus = {
          'user_id': msg.userID,
          'participant': progressList.length,
          'condition': 'multiples',
          // 'condition': progressList[progressList.length-1].condition == 'animation' ? 'multiples' : 'animation',
          'ordering': progressList[progressList.length-1].ordering < num_orderings - 1 ? (progressList[progressList.length-1].ordering + 1) : 0,
          'timestamp': now,
          'userAgent': msg.userAgent,
          'note': 'extra participant (no participants completed)'
        }; 
        io.emit('new_participant',surplus);
        console.log('new_participant',surplus);
        progressList.push(surplus);       
      }
      else {  //this shouldn't ever happen, but if it does, randomize
        var rando = {
          'user_id': msg.userID,
          'participant': -1,
          'condition': 'multiples',
          // 'condition': (Math.random() < 0.5) ? 'multiples' : 'animation',
          'ordering': Math.floor(Math.random() / (1 / num_orderings)),
          'timestamp': now,
          'userAgent': msg.userAgent,
          'note': 'extra participant'
        }; 
        io.emit('new_participant',rando);
        console.log('new_participant',rando);
        progressList.push(rando); 
      }
    });

    socket.on('unload', function(msg){
      var user_id_found = false;
      var i = 0;
      var now = new Date();

      while (!user_id_found && i < completedList.length) {
        if (completedList[i].user_id == msg.userID) { //move participant to completed list
          user_id_found = true;
          console.log('departure', {
            user_id: msg.userID,
            timestamp: now,
            userAgent: msg.userAgent,
            note: 'departure of completed participant'
          });
          io.emit('departure', {
            user_id: msg.userID,
            timestamp: now,
            userAgent: msg.userAgent,
            note: 'departure of completed participant'
          });    
        }
        i++;
      }
      if (!user_id_found) {
        //participant did not finish, so recycle their condition/ordering
        i = 0;
        while (!user_id_found && i < progressList.length) {
          if (progressList[i].user_id == msg.userID) { //move participant to completed list
            user_id_found = true;
            console.log('departure', progressList[i]);
            io.emit('departure', progressList[i]);
            progressList[i].user_id = '';    
            participantList.push(progressList[i]);
            progressList.splice(i,1);
          }
          i++;
        }
        if (!user_id_found) {
          console.log('departure', {
            user_id: msg.userID,
            timestamp: now,
            userAgent: msg.userAgent,
            note: 'departure of unknown participant?'
          });
          io.emit('departure', {
            user_id: msg.userID,
            timestamp: now,
            userAgent: msg.userAgent,
            note: 'departure of unknown participant?'
          });  
        }
      }        
    });

    socket.on('questionnaire', function(msg){
      var user_id_found = false;
      var i = 0;
      var now = new Date();

      while (!user_id_found && i < progressList.length) {
        if (progressList[i].user_id == msg) { //move participant to completed list
          user_id_found = true;
          console.log('completion', progressList[i]);
          io.emit('completion', progressList[i]);   
          if (progressList[i].condition == 'animation') {
            animation_count++;
          } 
          else {
            multiples_count++;
          }
          ordering_count[progressList[i].ordering]++;
          completedList.push(progressList[i]);
          progressList.splice(i,1);
        }
        i++;
      }
      if (!user_id_found) { //participant completed without being on progress list
        console.log('completion', { 
          user_id: msg,
          timestamp: now,
          note: 'completion of unknown participant?'
        });
        io.emit('completion', { 
          user_id: msg,
          timestamp: now,
          note: 'completion of unknown participant?'
        }); 
      }
      
    });

  });

})();
