var socket = io(window.location.href);
var position = {};

var scale = {};
var rotation = {};

socket.on('data', function (data) {
  // if (!scale.x) {
  //   scale.x = d3.scaleLinear()
  //     .domain([data.xGyro.range.bottom/10, data.xGyro.range.top/10])
  //     .range([-3, 3]);
  // }
  // if (!scale.y) {
  //   scale.y = d3.scaleLinear()
  //     .domain([data.yGyro.range.bottom/10, data.yGyro.range.top/10])
  //     .range([-3, 3]);
  // }
  // if (!scale.z) {
  //   scale.z = d3.scaleLinear()
  //     .domain([data.zGyro.range.bottom/10, data.zGyro.range.top/10])
  //     .range([-3, 3]);
  // }
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

  // position.x = scale.x(data.xGyro.value[0]);
  // position.y = scale.y(data.yGyro.value[0]);
  // position.z = scale.z(data.zGyro.value[0]);

  rotation.x = scale.pitch(data.pitchAngle.value[0]);
  rotation.y = scale.roll(data.rollAngle.value[0]);
  rotation.z = scale.yaw(data.yawAngle.value[0]);


  console.info('rotation', rotation);
  console.info('data', data);

  // console.info(data.pitchAngle.value[0]);
  // console.info(data.rollAngle.value[0]);
  // console.info(data.yawAngle.value[0]);

  // console.info(data.xGyro.value[0]);
  // console.info(data.yGyro.value[0]);
  // console.info(data.zGyro.value[0]);
  // animate();
});
