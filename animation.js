
import { OrbitControls } from './src/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from './src/renderers/CSS2DRenderer.js';


let camera, scene, renderer, labelRenderer;

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

let moon;

var animationDiv = document.getElementById('animate');

init();
animate();

function init() {

  const EARTH_RADIUS = 1;
  const MOON_RADIUS = 0.27;

  camera = new THREE.PerspectiveCamera( 15, animationDiv.offsetWidth / animationDiv.offsetHeight, 0.1, 200 );
  camera.position.set( 10, 5, 20 );

  scene = new THREE.Scene();

  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( 0, 0, 5 );
  scene.add( dirLight );

  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );

  scene.background = new THREE.Color(0xffffff);

  //

  const earthGeometry = new THREE.SphereGeometry( EARTH_RADIUS, 16, 16 );
  const earthMaterial = new THREE.MeshPhongMaterial( {
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load( 'docs/earth_atmos_2048.jpg' ),
    specularMap: textureLoader.load( 'docs/earth_specular_2048.jpg' ),
    normalMap: textureLoader.load( 'docs/earth_normal_2048.jpg' ),
    normalScale: new THREE.Vector2( 0.85, 0.85 )
  } );
  const earth = new THREE.Mesh( earthGeometry, earthMaterial );
  scene.add( earth );

  const moonGeometry = new THREE.SphereGeometry( MOON_RADIUS, 16, 16 );
  const moonMaterial = new THREE.MeshPhongMaterial( {
    shininess: 5,
    map: textureLoader.load( 'docs/moon_1024.jpg' )
  } );
  moon = new THREE.Mesh( moonGeometry, moonMaterial );
  scene.add( moon );

  //

  const earthDiv = document.createElement( 'div' );
  earthDiv.className = 'label';
  earthDiv.textContent = 'Earth';
  earthDiv.style.marginTop = '-1em';
  const earthLabel = new CSS2DObject( earthDiv );
  earthLabel.position.set( 0, -2, 0 );
  earth.add( earthLabel );

  const moonDiv = document.createElement( 'div' );
  moonDiv.className = 'label';
  moonDiv.textContent = 'Moon';
  moonDiv.style.marginTop = '-1em';
  const moonLabel = new CSS2DObject( moonDiv );
  moonLabel.position.set( 0, -1.5, 0 );
  moon.add( moonLabel );

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( animationDiv.offsetWidth, animationDiv.offsetHeight );
  document.getElementById("animate").appendChild( renderer.domElement );

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(animationDiv.offsetWidth, animationDiv.offsetHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  document.getElementById("animate").appendChild( labelRenderer.domElement );

  const controls = new OrbitControls( camera, labelRenderer.domElement );
  controls.enableZoom = false;

  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
  camera.aspect = animationDiv.offsetWidth / animationDiv.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( animationDiv.offsetWidth, animationDiv.offsetHeight );
  labelRenderer.setSize( animationDiv.offsetWidth, animationDiv.offsetHeight );
}

function animate() {
  requestAnimationFrame( animate );
  const elapsed = clock.getElapsedTime();
  moon.position.set( Math.sin( elapsed ) * 5, 0, Math.cos( elapsed ) * 5 );
  renderer.render( scene, camera );
  labelRenderer.render( scene, camera );
}