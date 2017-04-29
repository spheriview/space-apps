const sphero = require('sphero');
const SPHERO_PORT = '/dev/tty.Sphero-PGP-AMP-SPP';
let orb = sphero(SPHERO_PORT);

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8080);
app.use(express.static('public'))

io.on('connection', function (socket) {

  orb.connect(function() {
    orb.setStabilization(0);

    orb.streamGyroscope();
    orb.streamAccelerometer();
    orb.streamImuAngles();

    socket.emit('news', { hello: 'world' });

    orb.on("dataStreaming", function(data) {
      socket.emit('data', data);
    });

    // orb.stopOnDisconnect(function(err, data) {
    //   console.log(err || "data" + data);
    // });
  });
});
