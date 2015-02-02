var audio_hit = document.getElementById("audio_hit"),
	audio_disolve = document.getElementById("audio_disolve"),
	WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
	scene = new THREE.Scene(),
	camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 0.1, 1000 );

camera.position.set(4.5,9,17);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( WIDTH, HEIGHT );
document.body.appendChild( renderer.domElement );

// Create an event listener that resizes the renderer with the browser window.
window.addEventListener('resize', function() {
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
});

// Create the border
var heightBorderGeometry = new THREE.BoxGeometry(.5, 20, 1),
	widthBorderGeometry = new THREE.BoxGeometry(11, .5, 1),
	borderMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } )

leftBorder = new THREE.Mesh( heightBorderGeometry, borderMaterial );
leftBorder.position.set(-.75, 9.5, 0);
scene.add( leftBorder );

rightBorder = new THREE.Mesh( heightBorderGeometry, borderMaterial );
rightBorder.position.set(9.75, 9.5, 0);
scene.add( rightBorder );

bottomBorder = new THREE.Mesh( widthBorderGeometry, borderMaterial );
bottomBorder.position.set(4.5, -.75, 0);
scene.add( bottomBorder );

topBorder = new THREE.Mesh( widthBorderGeometry, borderMaterial );
topBorder.position.set(4.5, 19.75, 0);
scene.add( topBorder );

// Add the lights
var mainLight = new THREE.PointLight(0xFFFFFF, .8);
mainLight.position.set(4.5, 9.5, 12);
scene.add(mainLight);

var leftLight = new THREE.PointLight(0xAAAAFF, .6);
leftLight.position.set(-2, 9.5, 0);
scene.add(leftLight);

var rightLight = new THREE.PointLight(0xFFAAAA, .6);
rightLight.position.set(11, 9.5, 0);
scene.add(rightLight);

// Write out 'Next' above the next field
var material = new THREE.MeshPhongMaterial({
    color: 0xEEEEEE
});
var textGeom = new THREE.TextGeometry( 'Next', {
    font: 'helvetiker',
    size: 1,
    height: .25
});
var textMesh = new THREE.Mesh( textGeom, material );
textMesh.position.set(11, 17.5, 0);

scene.add( textMesh );