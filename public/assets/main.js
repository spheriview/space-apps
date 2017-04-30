var socket = io(window.location.href);
var position = {};

var scale = {};
var rotation = {};
var justUpdated = false;

var MODE = 'rotation';

socket.on('data', function (data) {
  if (!scale.pitch) {
    scale.pitch = d3.scaleLinear()
      .domain([data.pitchAngle.range.bottom, data.pitchAngle.range.top])
      .range([-1 * Math.PI, Math.PI]);
  }
  if (!scale.roll) {
    scale.roll = d3.scaleLinear()
      .domain([data.rollAngle.range.bottom, data.rollAngle.range.top])
      .range([-1 * Math.PI, Math.PI]);
  }
  if (!scale.yaw) {
    scale.yaw = d3.scaleLinear()
      .domain([data.yawAngle.range.bottom, data.yawAngle.range.top])
      .range([-1 * Math.PI, Math.PI]);
  }

  justUpdated = true;
  rotation.x = scale.pitch(data.pitchAngle.value[0]);
  rotation.z = scale.roll(data.rollAngle.value[0]);
  rotation.y = scale.yaw(data.yawAngle.value[0]);

  console.info('rotation', rotation);
  console.info('data', data);
});

socket.emit('connect');
