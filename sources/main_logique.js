var logique = require('./logique');
var maps = require('./maps');

var robot = new Robot(450, 170, 'data/9112.obj');
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
var world = {};


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
  maps.escargot(world.obstacles, robot, camera);
  e_pause = false;
};

var demitour = function () {
  maps.demitour(world.obstacles, robot, camera);
  e_pause = false;
};

var demitour2 = function () {
  maps.demitour2(world.obstacles, robot, camera);
  e_pause = false;
};

var antonoir = function () {
  maps.antonoir(world.obstacles, robot, camera);
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
  maps.reboot(world.obstacles, robot, camera);
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

  world = new World(camera,lightDirection);


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
        P.push(logique.calcul_droite(robot.sensors[i], world.obstacles)
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
    for (var i in robot.reactors) {
      robot.calcul_position(robot.reactors[i]);
    }
  }, 25);

  var time = 0;

  var outlineObject = [];
  for(var i in world.obstacles[i]) {
    outlineObject.push(world.obstacles[i].Object);
  }
  outlineObject.push(robot.Object);

  function render(deltaTime) {
    renderer.setCamera(camera);

    renderer.setRenderTarget(depthTarget);
    renderer.clear(null);

    //for (var i in outlineObject) {
    //  renderer.renderObject(outlineObject[i], depthMat);
    //}
    renderer.renderObject(robot.Object, depthMat);
    for (var i in world.obstacles) {
      renderer.renderObject(world.obstacles[i].Object, depthMat);
    }

    renderer.setRenderTarget(null);
    renderer.clear(null);
    renderer.renderObject(robot.Object);

    if (e_capteur) {
      for (var i in robot.sensors) {
        renderer.renderObject(robot.sensors[i].Object);
      }
    }
    for (var i in world.obstacles) {
      renderer.renderObject(world.obstacles[i].Object);
    }

    //for (var i in outlineObject) {
    //  renderer.renderObject(outlineObject[i]);
    //}

    renderer.renderObject(screenQuad, outlineMat);
    if (!e_nitro) {
      for (var i in robot.reactors) {
        renderer.renderObject(robot.reactors[i].Object);
      }
    }
    renderer.renderObject(world.sky.Object);
    time += deltaTime;
    lightDirection[1] = (0.5 + 0.5 * Math.cos(time * 0.0005));
    vec3.normalize(lightDirection, lightDirection);

  }
  Events.AddEventListener(Events.onRender, render);
  Events.FireEvent(Events.onRender);
}
