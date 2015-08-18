var logique = require('./logique');
var maps = require('./maps');

var robot = new Robot(170, 450, 'data/9112.obj');
var obstacles = [];
var reactors = [];

var e_capteur = true;
var e_pause = true;
var e_nitro = true;
var vitesse = 0;
var vitessemax = 5;
var vitessemin = 1;
var ratio = 0.75;
var test = [];
var skyObject = {};


var lightDirection = vec3.fromValues(0.3, 0.5, -0.4);
var lightColor = vec3.fromValues(0.85, 0.8, 0.6);
var ambientColor = vec3.fromValues(0.4, 0.4, 0.4);

var calcul_position = function (input) {
  var vec = {};
  vec.x = -Math.cos(Math.PI / 2) * Math.sin(robot.Object.rotation[1]) + Math.sin(Math.PI / 2) * Math.cos(robot.Object.rotation[1]);
  vec.z = -Math.sin(Math.PI / 2) * Math.sin(robot.Object.rotation[1]) - Math.cos(Math.PI / 2) * Math.cos(robot.Object.rotation[1]);

  var position = {};
  position.x = robot.Object.position[0] - input.longueur * Math.sin(robot.Object.rotation[1]) + vec.x * input.largeur;
  position.z = robot.Object.position[2] - input.longueur * Math.cos(robot.Object.rotation[1]) + vec.z * input.largeur;

  input.Object.setPosition(position.x, 40, position.z);
  input.Object.setRotation(0, robot.Object.rotation[1] + input.rotation, 0);
};

var escargot = function () {
  maps.escargot(obstacles, robot, camera);
  e_pause = false;
};

var demitour = function () {
  maps.demitour(obstacles, robot, camera);
  e_pause = false;
};

var demitour2 = function () {
  maps.demitour2(obstacles, robot, camera);
  e_pause = false;
};

var antonoir = function () {
  maps.antonoir(obstacles, robot, camera);
  e_pause = false;
};


var change_capteur = function () {
  e_capteur = !e_capteur;
};

var pause = function () {
  e_pause = !e_pause;
};

var nitro = function () {
  if (e_nitro) {
    vitessemax = 2 * vitessemax;
  } else {
    vitessemax = 5;
  }
  e_nitro = !e_nitro;
};

var camera = {};
var reboot = function () {
  maps.reboot(obstacles, robot, camera);
  e_pause = false;
};


function start() {
  Events.InitializeEvents();
  var canvas = document.getElementById('renderingCanvas');

  camera = new Camera({
    pos: {x: -2500, y: 1000, z: 2500},
    target: {x: 0, y: 0, z: 0},
    fov: Math.PI / 3,
    aspectRatio: canvas.width / canvas.height,
    near: 1.0,
    far: 100000.0
  });


  var glParams = {
    alpha: false,
    depth: true,
    stencil: false,
    antialias: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    preferLowPowerToHighPerformance: false,
    failIfMajorPerformanceCaveat: false
  };

  var renderer = new Renderer(canvas, glParams);
  camera.bindCommands(renderer.keyboardManager);

  var depthTarget = new RenderTarget(canvas.width, canvas.height, true, false);

  var quad = new Mesh();
  quad._positions.push(-1, 1, 0, -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0);
  var outlineMat = new Material('outline', 'data/shader/renderTexture.vShader', 'data/shader/outline.fShader',
    function (mat) {
      mat.uniforms['texture0'].texture = depthTarget;
      mat.uniforms['invScreenSize'].value = vec2.fromValues(1 / canvas.width, 1 / canvas.height);
    });
  outlineMat.zWrite = false;
  outlineMat.zTest = false;
  outlineMat.blendEquation = GL.FUNC_ADD;

  var screenQuad = new Object3D(quad, outlineMat);
  var depthMat = new Material('depth', 'data/shader/depth.vShader', 'data/shader/depth.fShader');
  depthMat.blendEquation = false;

  function resize(size) {
    depthTarget.resize(renderer.gl, size.w, size.h);
    outlineMat.uniforms['invScreenSize'].value = vec2.fromValues(1 / size.w, 1 / size.h);
  }

  init_obstacles();
  init_sky();

  setInterval(function () {
    if (e_pause) {
      robot.move(vitesse);

      camera.setPosition(camera.position[0] - vitesse * Math.sin(robot.getRotation()),
        camera.position[1],
        camera.position[2] - vitesse * Math.cos(robot.getRotation()));
      camera.setTarget(robot.getPosition()[0], robot.getPosition()[1], robot.getPosition()[2]);//TODO horrible

    }
    var P = [];
    for (var i in robot.sensors) {
      robot.calcul_position(robot.sensors[i]);
      if (e_pause) {
        P.push(logique.calcul_droite(robot.sensors[i],obstacles)
          .then(logique.triAnsemble));
      }
    }
    Promise.all(P)
      .then(function () {
        return logique.defloutage(robot.sensors)
      })
      .then(logique.defu)
      .then(function (result) {
        vitesse = vitessemax * result.vitesse + vitessemin;
        robot.rotate(result.rotation);
      })
      .catch(function (err) {
        console.log('error:' + err)
      });
    for (var i in reactors) {
      //robot.calcul_position(reactors[i]);
    }
  }, 25);

  var time = 0;

  function render(deltaTime) {
    renderer.setCamera(camera);

    renderer.setRenderTarget(depthTarget);
    renderer.clear(null);

    renderer.renderObject(robot.Object, depthMat);
    for (var i in obstacles) {
      renderer.renderObject(obstacles[i].Object, depthMat);
    }

    renderer.setRenderTarget(null);
    renderer.clear(null);
    renderer.renderObject(robot.Object);


    if (e_capteur) {
      for (var i in robot.sensors) {
        renderer.renderObject(robot.sensors[i].Object);
      }
    }
    for (var i in obstacles) {
      renderer.renderObject(obstacles[i].Object);
    }

    renderer.renderObject(screenQuad, outlineMat);
    //if (!e_nitro) {
    //  for (var i in reactors) {
    //    renderer.renderObject(reactors[i].Object);
    //  }
    //}
    renderer.renderObject(skyObject);
    time += deltaTime;
    lightDirection[1] = (0.5 + 0.5 * Math.cos(time * 0.0005));
    vec3.normalize(lightDirection, lightDirection);


  }

  Events.AddEventListener(Events.onRender, render);
  Events.FireEvent(Events.onRender);


}

var init_sky = function () {

  var noiseTex = new Texture('data/Noise.jpg');
  noiseTex.wrapping = GL.REPEAT;
  noiseTex.magFilter = GL.LINEAR;
  noiseTex.minFilter = GL.LINEAR_MIPMAP_LINEAR;

  var skyTexture = new Texture('data/GradientSky.png');

  var skyMesh = new Mesh('sky');
  skyMesh.loadFromObjFile('data/Sphere.obj');
  var skyMat = new Material('sky', 'data/shader/sky.vShader', 'data/shader/sky.fShader',
    function (mat) {
      mat.uniforms['lightDir'].value = lightDirection;
      mat.uniforms['texture0'].texture = skyTexture;
      mat.uniforms['texture1'].texture = noiseTex;

      mat.uniforms['cloudDensity'].value = 0.25;
      mat.uniforms['windSpeed'].value = vec2.fromValues(0.025, 0.015);
    });
  skyMat.doubleSided = true;
  skyObject = new Object3D(skyMesh, skyMat);
  skyObject.setScale(camera.far * 0.7, camera.far * 0.7, camera.far * 0.7);
  skyObject.setPosition(0, -5000, 0);
};

var init_obstacles = function () {
  var groundMesh = new Mesh('ground');
  groundMesh.loadFromObjFile('data/plateau.obj');
  var groundMat = new Material('ground', 'data/shader/default.vShader', 'data/shader/default.fShader',
    function (mat) {
      var texture = new Texture('data/grass_diffuse.png');
      texture.minFilter = GL.LINEAR_MIPMAP_LINEAR;
      mat.uniforms['texture0'].texture = texture;
    });
  obstacles[0] = {};
  obstacles[0].Object = new Object3D(groundMesh, groundMat);
  obstacles[0].Object.setPosition(0, 0, 0);
  obstacles[0].Object.setRotation(0, Math.PI, 0);
  obstacles[0].Object.setScale(12000, 0, 12000);
  obstacles[0].largeur = 25000;
  obstacles[0].longueur = 25000;


  var houseMesh = new Mesh('house');
  houseMesh.loadFromObjFile('data/Container.obj');
  var houseMat = new Material('house', 'data/shader/default.vShader', 'data/shader/default.fShader',
    function (mat) {
      mat.uniforms['texture0'].texture = new Texture('data/Container.BMP');
    });
  houseMat.blendEquation = GL.FUNC_ADD;
  houseMat.dstBlend = GL.ZERO;
  houseMat.srcBlend = GL.ONE;


  for (var i = 1; i < 30; i++) {
    obstacles[i] = {};
    obstacles[i].Object = new Object3D(houseMesh, houseMat);
    obstacles[i].Object.setPosition(Math.random() * 25000 - 12500, 0, Math.random() * 25000 - 12500);
    obstacles[i].Object.setRotation(0, Math.random() * Math.PI - Math.PI / 2, 0);
    obstacles[i].Object.setScale(50, 50, 50);
    obstacles[i].largeur = 500;
    obstacles[i].longueur = 1200;
  }
};


