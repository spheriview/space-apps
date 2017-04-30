require('dotenv').config();

const sphero = require('sphero');
const SPHERO_PORT = process.env.SPHERO_PORT;
let orb = sphero(SPHERO_PORT);
let isConnected = false;

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8080);
app.use(express.static('public'));

function setupSphero() {
  orb.setStabilization(0);
  orb.streamAccelerometer();
  orb.streamImuAngles();
  orb.detectCollisions();
  isConnected = true;
}

function setupStreaming(socket) {
  orb.on('dataStreaming', function(data) {
    socket.emit('data', data);
  });
}

orb.connect()
  .then(setupSphero)
  .then(function(){
    io.on('connection', setupStreaming);

    // close not being triggered when connection drops :(
    orb.on('close', function(){
      console.info('orb closed');
      isConnected = false;
    });
  })
  .catch(function(){
    console.log('error', arguments);
  });

io.on('connection', function (socket) {
  // only reconnect to orb if not already connected.
  if(isConnected){
    return;
  }

  socket.on('connect', function(){
    orb.connect()
      .then(setupSphero)
      .then(function(){
        setupStreaming(socket);
      });
  });
});


