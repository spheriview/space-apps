/**
 * filePath parsing
 */
var filePath = Qs.parse(window.location.search.replace('?','')).file.split('/');
filePath.splice(2, 0, 'master');
var fileUrl = '//raw.githubusercontent.com/' + filePath.join('/')


/**
 * Three JS viewer code
 */
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, stats;
var camera, cameraTarget, scene, renderer;
init();
animate();
function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
  camera.position.set( 3, 0.15, 3 );
  cameraTarget = new THREE.Vector3( 0, -0.25, 0 );
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xededed, 2, 15 );

  // Ground
  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 40, 40 ),
    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
  );
  plane.rotation.x = - Math.PI/2;
  plane.position.y = - 0.5;
  scene.add( plane );
  plane.receiveShadow = true;

  var loader = new THREE.STLLoader();
  var material = new THREE.MeshPhongMaterial( { color: 0x5588ff, specular: 0x111111, shininess: 200 } );
  loader.load( fileUrl, function ( geometry ) {
    geometry.computeVertexNormals();
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0.5, 0.2, 0 );
    mesh.rotation.set( - Math.PI / 2, 0, 0);
    mesh.scale.set( 0.3, 0.3, 0.3 );
    // mesh.castShadow = true;
    // mesh.receiveShadow = true;
    scene.add( mesh );
  } );
  // Lights
  scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
  light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );
  addShadowedLight( 1, 1, 1, 0xcccccc, 1.35 );
  addShadowedLight( 0.5, 1, -1, 0xffffff, 0.5 );
  // renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.renderReverseSided = false;
  container.appendChild( renderer.domElement );
  // stats
  stats = new Stats();
  container.appendChild( stats.dom );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}
function addShadowedLight( x, y, z, color, intensity ) {
  var directionalLight = new THREE.DirectionalLight( color, intensity );
  directionalLight.position.set( x, y, z );
  scene.add( directionalLight );
  directionalLight.castShadow = true;
  var d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.bias = -0.005;
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate(timestamp) {
  requestAnimationFrame( animate );
  render(timestamp);
  stats.update();
}

/**
 * Frame update code
 */
var start = null;
var ratio = 0;
var interps = null;

function makeSmoothUpdate(timestamp, previousStep, nextStep) {
  var update = null;

  if (_.isEmpty(nextStep)) {
    return;
  }

  if (justUpdated) {
    start = timestamp;
    justUpdated = false;
    ratio = 0;

    interps = {
      x: d3.interpolateNumber(previousStep.x, nextStep.x),
      y: d3.interpolateNumber(previousStep.y, nextStep.y),
      z: d3.interpolateNumber(previousStep.z, nextStep.z)
    };

  } else if (ratio < 1 && interps) {

    ratio = (timestamp - start)/(1000/30);

    update = update || {};

    update.x = interps.x(ratio);
    update.y = interps.y(ratio);
    update.z = interps.z(ratio);

  } else {

    start = null;
    interps = null;

    update = update || {};
    update.x = nextStep.x;
    update.y = nextStep.y;
    update.z = nextStep.z;
  }

  return update;
}


// camera and scene can be updated here.
function render(timestamp) {
  if (mode == 'rotate') {
    var update = makeSmoothUpdate(timestamp, scene.rotation, rotation);

    if (update) {
      scene.rotation.x = update.x;
      scene.rotation.y = update.y;
      scene.rotation.z = update.z;
    }
  } else if (mode == 'zoom') {


  }

  camera.lookAt( cameraTarget );
  renderer.render( scene, camera );
}
