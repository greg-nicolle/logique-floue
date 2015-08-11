/**
 * Created by greg on 05/03/15.
 */

var logique = require('./logique');

var robot = {};
var obstacles = [];
var capteurs = [];
var reactors = [];

var e_capteur = true;
var e_pause = true;
var e_nitro = true;
var vitesse = 0;
var vitessemax = 5;
var vitessemin = 1;
var sem = 0;
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
  for (var i = 1; i < 6; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] + obstacles[i].longueur, 0, 0);
    obstacles[i].Object.setRotation(0, Math.PI / 2, 0);
  }
  for (var i = 6; i < 11; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0], 0, obstacles[i - 1].Object.position[2] + obstacles[i].longueur);
    obstacles[i].Object.setRotation(0, Math.PI, 0);
  }
  for (var i = 11; i < 15; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] - obstacles[i].longueur, 0, obstacles[i - 1].Object.position[2]);
    obstacles[i].Object.setRotation(0, Math.PI / 2, 0);
  }
  for (var i = 15; i < 18; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0], 0, obstacles[i - 1].Object.position[2] - obstacles[i].longueur);
    obstacles[i].Object.setRotation(0, Math.PI, 0);
  }
  for (var i = 18; i < 20; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] + obstacles[i].longueur, 0, obstacles[i - 1].Object.position[2]);
    obstacles[i].Object.setRotation(0, Math.PI / 2, 0);
  }
  for (var i = 20; i < 21; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0], 0, obstacles[i - 1].Object.position[2] + obstacles[i].longueur);
    obstacles[i].Object.setRotation(0, Math.PI, 0);
  }
  robot.Object.setPosition(2000, 0, 4000);
  robot.Object.setRotation(0, 0, 0);
  camera.setPosition(-2500, 1000, 2500);
  camera.setTarget(0, 0, 0);
  e_pause = false;
};

var demitour = function () {
  for (var i = 1; i < 10; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] + obstacles[i].longueur, 0, 0);
    obstacles[i].Object.setRotation(0, Math.PI / 2, 0);
  }
  for (var i = 10; i < 12; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0], 0, obstacles[i - 1].Object.position[2] + obstacles[i].longueur);
    obstacles[i].Object.setRotation(0, Math.PI, 0);
  }
  for (var i = 12; i < 30; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] - obstacles[i].longueur, 0, obstacles[i - 1].Object.position[2]);
    obstacles[i].Object.setRotation(0, Math.PI / 2, 0);
  }
  robot.Object.setPosition(1000, 0, 1500);
  robot.Object.setRotation(0, -Math.PI / 2, 0);
  camera.setPosition(-2500, 1000, 2500);
  camera.setTarget(0, 0, 0);
  e_pause = false;
};

var demitour2 = function () {
  for (var i = 1; i < 10; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] + obstacles[i].longueur, 0, 0);
    obstacles[i].Object.setRotation(0, Math.PI / 2, 0);
  }
  for (var i = 10; i < 12; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0], 0, obstacles[i - 1].Object.position[2] + obstacles[i].longueur * 0.75);
    obstacles[i].Object.setRotation(0, Math.PI, 0);
  }
  for (var i = 12; i < 30; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] - obstacles[i].longueur, 0, obstacles[i - 1].Object.position[2]);
    obstacles[i].Object.setRotation(0, Math.PI / 2, 0);
  }
  robot.Object.setPosition(1000, 0, 800);
  robot.Object.setRotation(0, -Math.PI / 2, 0);
  camera.setPosition(-2500, 1000, 2500);
  camera.setTarget(0, 0, 0);
  e_pause = false;
};

var antonoir = function () {
  obstacles[1].Object.setPosition(-Math.sin(3 * Math.PI / 8) * obstacles[1].longueur * 2, 0, -Math.cos(3 * Math.PI / 8) * obstacles[1].longueur * 2);
  obstacles[1].Object.setRotation(0, 3 * Math.PI / 8, 0);
  for (var i = 2; i < 15; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] - Math.sin(obstacles[i - 1].Object.rotation[1]) * obstacles[i].longueur, 0, obstacles[i - 1].Object.position[2] - Math.cos(obstacles[i - 1].Object.rotation[1]) * obstacles[i].longueur);
    obstacles[i].Object.setRotation(0, obstacles[i - 1].Object.rotation[1], 0);
  }

  obstacles[15].Object.setPosition(-Math.sin(5 * Math.PI / 8) * obstacles[15].longueur * 2, 0, -Math.cos(5 * Math.PI / 8) * obstacles[15].longueur);
  obstacles[15].Object.setRotation(0, 5 * Math.PI / 8, 0);
  for (var i = 16; i < 30; i++) {
    obstacles[i].Object.setPosition(obstacles[i - 1].Object.position[0] - Math.sin(obstacles[i - 1].Object.rotation[1]) * obstacles[i].longueur, 0, obstacles[i - 1].Object.position[2] - Math.cos(obstacles[i - 1].Object.rotation[1]) * obstacles[i].longueur);
    obstacles[i].Object.setRotation(0, obstacles[i - 1].Object.rotation[1], 0);
  }
  robot.Object.setPosition(-10000, 0, 0);
  robot.Object.setRotation(0, -Math.PI / 2, 0);
  camera.setPosition(-2500, 1000, 2500);
  camera.setTarget(0, 0, 0);
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
  for (var i = 1; i < 30; i++) {
    obstacles[i].Object.setPosition(Math.random() * 25000 - 12500, 0, Math.random() * 25000 - 12500);
    obstacles[i].Object.setRotation(0, Math.random() * Math.PI - Math.PI / 2, 0);
  }
  robot.Object.setPosition(0, 0, 0);
  robot.Object.setRotation(0, 0, 0);
  camera.setPosition(-2500, 1000, 2500);
  camera.setTarget(0, 0, 0);
};


function start() {
  Events.InitializeEvents();
  var canvas = document.getElementById("renderingCanvas");

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
  var outlineMat = new Material("outline", "data/shader/renderTexture.vShader", "data/shader/outline.fShader",
      function (mat) {
        mat.uniforms["texture0"].texture = depthTarget;
        mat.uniforms["invScreenSize"].value = vec2.fromValues(1 / canvas.width, 1 / canvas.height);
      });
  outlineMat.zWrite = false;
  outlineMat.zTest = false;
  outlineMat.blendEquation = GL.FUNC_ADD;

  var screenQuad = new Object3D(quad, outlineMat);
  var depthMat = new Material("depth", "data/shader/depth.vShader", "data/shader/depth.fShader");
  depthMat.blendEquation = false;

  function resize(size) {
    depthTarget.resize(renderer.gl, size.w, size.h);
    outlineMat.uniforms["invScreenSize"].value = vec2.fromValues(1 / size.w, 1 / size.h);
  }

  init_robot();
  init_obstacles();
  init_sky();

  setInterval(function () {
    if (e_pause) {
      robot.Object.setPosition(robot.Object.position[0] - vitesse * Math.sin(robot.Object.rotation[1]), 0
          , robot.Object.position[2] - vitesse * Math.cos(robot.Object.rotation[1]));

      camera.setPosition(camera.position[0] - vitesse * Math.sin(robot.Object.rotation[1]),
          camera.position[1],
          camera.position[2] - vitesse * Math.cos(robot.Object.rotation[1]));
      camera.setTarget(robot.Object.position[0], robot.Object.position[1], robot.Object.position[2]);

    }
    sem = 15;
    for (var i in capteurs) {
      calcul_position(capteurs[i]);
      if (e_pause) calcul_droite(capteurs[i]);
    }
    for (var i in reactors) {
      calcul_position(reactors[i]);
    }
  }, 25);

  var time = 0;

  function render(deltaTime) {
    renderer.setCamera(camera);

    renderer.setRenderTarget(depthTarget);
    renderer.clear(/*{r: 0.31, g: 0.59, b: 0.78, a: 1.0}*/null);

    renderer.renderObject(robot.Object, depthMat);
    for (var i in obstacles) {
      renderer.renderObject(obstacles[i].Object, depthMat);
    }

    renderer.setRenderTarget(null);
    renderer.clear(/*{r: 0.31, g: 0.59, b: 0.78, a: 1.0}*/null);
    //renderer.renderObject(groundObject);
    renderer.renderObject(robot.Object);

    if (e_capteur) {
      for (var i in capteurs) {
        renderer.renderObject(capteurs[i].Object);
      }
    }
    for (var i in obstacles) {
      renderer.renderObject(obstacles[i].Object);
    }

    renderer.renderObject(screenQuad, outlineMat);
    if (!e_nitro) {
      for (var i in reactors) {
        renderer.renderObject(reactors[i].Object);
      }
    }
    renderer.renderObject(skyObject);

    time += deltaTime;
    lightDirection[1] = (0.5 + 0.5 * Math.cos(time * 0.0005));
    vec3.normalize(lightDirection, lightDirection);

  }

  Events.AddEventListener(Events.onRender, render);
  Events.FireEvent(Events.onRender);
}

var init_sky = function () {

  var noiseTex = new Texture("data/Noise.jpg");
  noiseTex.wrapping = GL.REPEAT;
  noiseTex.magFilter = GL.LINEAR;
  noiseTex.minFilter = GL.LINEAR_MIPMAP_LINEAR;

  var skyTexture = new Texture("data/GradientSky.png");

  var skyMesh = new Mesh("sky");
  skyMesh.loadFromObjFile("data/Sphere.obj");
  var skyMat = new Material("sky", "data/shader/sky.vShader", "data/shader/sky.fShader",
      function (mat) {
        mat.uniforms["lightDir"].value = lightDirection;
        mat.uniforms["texture0"].texture = skyTexture;
        mat.uniforms["texture1"].texture = noiseTex;

        mat.uniforms["cloudDensity"].value = 0.25;
        mat.uniforms["windSpeed"].value = vec2.fromValues(0.025, 0.015);
      });
  skyMat.doubleSided = true;
  skyObject = new Object3D(skyMesh, skyMat);
  skyObject.setScale(camera.far * 0.7, camera.far * 0.7, camera.far * 0.7);
  skyObject.setPosition(0, -5000, 0);
};

var init_robot = function () {
  robot.largeur = 170;
  robot.longueur = 450;

  robot.Mesh = new Mesh("robot");
  robot.Mesh.loadFromObjFile("data/9112.obj");
  robot.Mat = new Material("robot", "data/shader/default.vShader", "data/shader/default.fShader",
      function (mat) {
        var texture = new Texture("data/0001.BMP");
        mat.uniforms["texture0"].texture = texture;
      });
  robot.Mat.blendEquation = GL.FUNC_ADD;
  robot.Mat.dstBlend = GL.ZERO;
  robot.Mat.srcBlend = GL.ONE;
  robot.Object = new Object3D(robot.Mesh, robot.Mat);
  robot.Object.setScale(100, 100, 100);

  robot.Object.setPosition(0, 0, 0);
  robot.Object.setRotation(0, -Math.PI / 2, 0);


  var randomPos = function () {
    return Math.random() - 0.5;
  };


  var reactorMesh = new Mesh("generatedReactor");
  reactorMesh.primitiveType = GL.POINTS;
  for (var i = 0; i < 300; ++i)
    reactorMesh._positions.push(randomPos(), randomPos(), randomPos());


  var reactorMat = new Material("reactor", "data/shader/reactor.vShader", "data/shader/reactor.fShader",
      function (mat) {
        mat.uniforms["texture0"].texture = new Texture("data/smoke.png");
      });
  reactorMat.blendEquation = GL.FUNC_ADD;
  reactorMat.zWrite = false;
  reactorMat.srcBlend = GL.SRC_ALPHA;
  reactorMat.dstBlend = GL.ONE_MINUS_SRC_ALPHA;


  reactors[0] = {};
  reactors[0].Object = new Object3D(reactorMesh, reactorMat);
  reactors[0].longueur = -robot.longueur * (1 - ratio);
  reactors[0].largeur = robot.largeur / 4;
  reactors[0].rotation = 0;

  reactors[1] = {};
  reactors[1].Object = new Object3D(reactorMesh, reactorMat);
  reactors[1].longueur = -robot.longueur * (1 - ratio);
  reactors[1].largeur = -robot.largeur / 4;
  reactors[1].rotation = 0


  init_capteurs();
};

var init_obstacles = function () {
  var groundMesh = new Mesh("ground");
  groundMesh.loadFromObjFile("data/plateau.obj");
  var groundMat = new Material("ground", "data/shader/default.vShader", "data/shader/default.fShader",
      function (mat) {
        var texture = new Texture("data/grass_diffuse.png");
        texture.minFilter = GL.LINEAR_MIPMAP_LINEAR;
        mat.uniforms["texture0"].texture = texture;
      });
  obstacles[0] = {};
  obstacles[0].Object = new Object3D(groundMesh, groundMat);
  obstacles[0].Object.setPosition(0, 0, 0);
  obstacles[0].Object.setRotation(0, Math.PI, 0);
  obstacles[0].Object.setScale(12000, 0, 12000);
  obstacles[0].largeur = 25000;
  obstacles[0].longueur = 25000;


  var houseMesh = new Mesh("house");
  houseMesh.loadFromObjFile("data/Container.obj");
  var houseMat = new Material("house", "data/shader/default.vShader", "data/shader/default.fShader",
      function (mat) {
        mat.uniforms["texture0"].texture = new Texture("data/Container.BMP");
      });
  houseMat.blendEquation = GL.FUNC_ADD;
  houseMat.dstBlend = GL.ZERO;
  houseMat.srcBlend = GL.ONE;


  for (var i = 1; i < 30; i++) {
    obstacles[i] = {};
    obstacles[i].Object = new Object3D(houseMesh, houseMat);
    obstacles[i].Object.setPosition(Math.random() * 25000 - 12500, 0, Math.random() * 25000 - 12500);
    obstacles[i].Object.setRotation(0, Math.random() * Math.PI - Math.PI / 2, 0);
    //obstacles[i].Object.setPosition(3000,0,0);
    obstacles[i].Object.setScale(50, 50, 50);
    //obstacles[i].Object.setRotation(0,-Math.PI/2,0);
    obstacles[i].largeur = 500;
    obstacles[i].longueur = 1200;
  }
}

var init_capteurs = function () {
  var tmpcapteurs = {};
  tmpcapteurs.Mesh = new Mesh("capteur");
  tmpcapteurs.Mesh.loadFromObjFile("data/cone.obj");
  tmpcapteurs.Mat = new Material("capteur", "data/shader/default.vShader", "data/shader/default.fShader",
      function (mat) {
        var texture = new Texture("data/grass_diffuse.png");
        texture.minFilter = GL.LINEAR_MIPMAP_LINEAR;
        mat.uniforms["texture0"].texture = texture;
      });
  tmpcapteurs.Mat.blendEquation = GL.FUNC_ADD;
  tmpcapteurs.Mat.dstBlend = GL.ZERO;
  tmpcapteurs.Mat.srcBlend = GL.ONE;

  for (var i = 0; i < 15; i++) {
    capteurs[i] = {};
    capteurs[i].appartenance = {};
    capteurs[i].appartenance.e1 = 0;
    capteurs[i].appartenance.e2 = 0;
    capteurs[i].appartenance.e3 = 0;

    capteurs[i].Object = new Object3D(tmpcapteurs.Mesh, tmpcapteurs.Mat);
    capteurs[i].Object.setScale(10, 10, 10);
  }

  capteurs[0].longueur = robot.longueur * ratio;
  capteurs[0].largeur = robot.largeur / 2;
  capteurs[0].rotation = -Math.PI / 4;

  capteurs[1].longueur = robot.longueur * ratio;
  capteurs[1].largeur = robot.largeur / 4;
  capteurs[1].rotation = 0;

  capteurs[2].longueur = robot.longueur * ratio;
  capteurs[2].largeur = -robot.largeur / 4;
  capteurs[2].rotation = 0;

  capteurs[3].longueur = robot.longueur * ratio;
  capteurs[3].largeur = -robot.largeur / 2;
  capteurs[3].rotation = Math.PI / 4;

  capteurs[4].longueur = robot.longueur * ratio - robot.longueur / 4;
  capteurs[4].largeur = -robot.largeur / 2;
  capteurs[4].rotation = Math.PI / 2;

  capteurs[5].longueur = robot.longueur * ratio - robot.longueur / 2;
  capteurs[5].largeur = -robot.largeur / 2;
  capteurs[5].rotation = Math.PI / 2;

  capteurs[6].longueur = -robot.longueur * (1 - ratio) + robot.longueur / 4;
  capteurs[6].largeur = -robot.largeur / 2;
  capteurs[6].rotation = Math.PI / 2;

  capteurs[7].longueur = robot.longueur * ratio - robot.longueur / 4;
  capteurs[7].largeur = robot.largeur / 2;
  capteurs[7].rotation = -Math.PI / 2;

  capteurs[8].longueur = robot.longueur * ratio - robot.longueur / 2;
  capteurs[8].largeur = robot.largeur / 2;
  capteurs[8].rotation = -Math.PI / 2;

  capteurs[9].longueur = -robot.longueur * (1 - ratio) + robot.longueur / 4;
  capteurs[9].largeur = robot.largeur / 2;
  capteurs[9].rotation = -Math.PI / 2

  capteurs[10].longueur = -robot.longueur * (1 - ratio);
  capteurs[10].largeur = robot.largeur / 2;
  capteurs[10].rotation = -3 * Math.PI / 4;

  capteurs[11].longueur = -robot.longueur * (1 - ratio);
  capteurs[11].largeur = robot.largeur / 4;
  capteurs[11].rotation = Math.PI;

  capteurs[12].longueur = -robot.longueur * (1 - ratio);
  capteurs[12].largeur = -robot.largeur / 4;
  capteurs[12].rotation = Math.PI;

  capteurs[13].longueur = -robot.longueur * (1 - ratio);
  capteurs[13].largeur = -robot.largeur / 2;
  capteurs[13].rotation = 3 * Math.PI / 4;

}


var tempo = function () {
  if (--sem == 0) {
    logique.defloutage(capteurs)
        .then(logique.defu)
        .then(function (result) {
          vitesse = vitessemax * result.vitesse + vitessemin;
          robot.Object.setRotation(0, robot.Object.rotation[1] + result.rotation, 0);
        })
        .catch(function (err) {
          console.log("error:" + err)
        });
  }
};

var calcul_droite = function (input) {
  var a = Math.cos(input.Object.rotation[1]) / Math.sin(input.Object.rotation[1]);

  var b = input.Object.position[2] - a * input.Object.position[0];


  var min = Infinity;

  for (var i in obstacles) {

    var vec = {};
    vec.x = -Math.cos(Math.PI / 2) * Math.sin(obstacles[i].Object.rotation[1]) + Math.sin(Math.PI / 2) * Math.cos(obstacles[i].Object.rotation[1]);
    vec.z = -Math.sin(Math.PI / 2) * Math.sin(obstacles[i].Object.rotation[1]) - Math.cos(Math.PI / 2) * Math.cos(obstacles[i].Object.rotation[1]);


    var position = [];
    position[0] = {};
    position[0].x = obstacles[i].Object.position[0] - obstacles[i].longueur * Math.sin(obstacles[i].Object.rotation[1]) / 2 + vec.x * obstacles[i].largeur / 2;
    position[0].y = obstacles[i].Object.position[2] - obstacles[i].longueur * Math.cos(obstacles[i].Object.rotation[1]) / 2 + vec.z * obstacles[i].largeur / 2;

    position[1] = {};
    position[1].x = obstacles[i].Object.position[0] - obstacles[i].longueur * Math.sin(obstacles[i].Object.rotation[1]) / 2 - vec.x * obstacles[i].largeur / 2;
    position[1].y = obstacles[i].Object.position[2] - obstacles[i].longueur * Math.cos(obstacles[i].Object.rotation[1]) / 2 - vec.z * obstacles[i].largeur / 2;

    position[2] = {};
    position[2].x = obstacles[i].Object.position[0] + obstacles[i].longueur * Math.sin(obstacles[i].Object.rotation[1]) / 2 - vec.x * obstacles[i].largeur / 2;
    position[2].y = obstacles[i].Object.position[2] + obstacles[i].longueur * Math.cos(obstacles[i].Object.rotation[1]) / 2 - vec.z * obstacles[i].largeur / 2;

    position[3] = {};
    position[3].x = obstacles[i].Object.position[0] + obstacles[i].longueur * Math.sin(obstacles[i].Object.rotation[1]) / 2 + vec.x * obstacles[i].largeur / 2;
    position[3].y = obstacles[i].Object.position[2] + obstacles[i].longueur * Math.cos(obstacles[i].Object.rotation[1]) / 2 + vec.z * obstacles[i].largeur / 2;

    var a1 = (position[1].y - position[0].y) / (position[1].x - position[0].x);
    var b1 = position[1].y - a1 * position[1].x;

    var a2 = (position[2].y - position[1].y) / (position[2].x - position[1].x);
    var b2 = position[1].y - a2 * position[1].x;

    var a3 = (position[2].y - position[3].y) / (position[2].x - position[3].x);
    var b3 = position[2].y - a3 * position[2].x;

    var a4 = (position[3].y - position[0].y) / (position[3].x - position[0].x);
    var b4 = position[3].y - a4 * position[3].x;


    var x1 = (b1 - b) / (a - a1);
    var y1 = a * x1 + b;

    if ((x1 < position[0].x && x1 > position[1].x) || (x1 > position[0].x && x1 < position[1].x)) {
      if ((((-Math.sin(input.Object.rotation[1]) > 0 && input.Object.position[0] < x1) ||
          (-Math.sin(input.Object.rotation[1]) < 0 && input.Object.position[0] > x1)) &&
          ((-Math.cos(input.Object.rotation[1]) > 0 && input.Object.position[2] < y1) ||
          (-Math.cos(input.Object.rotation[1]) < 0 && input.Object.position[2] > y1))) &&
          min > (x1 - input.Object.position[0]) * (x1 - input.Object.position[0]) + (y1 - input.Object.position[2]) * (y1 - input.Object.position[2])) {

        min = (x1 - input.Object.position[0]) * (x1 - input.Object.position[0]) + (y1 - input.Object.position[2]) * (y1 - input.Object.position[2]);
      }
    }

    var x2 = (b2 - b) / (a - a2);
    var y2 = a * x2 + b;

    if ((x2 < position[1].x && x2 > position[2].x) || (x2 > position[1].x && x2 < position[2].x)) {
      if ((((-Math.sin(input.Object.rotation[1]) > 0 && input.Object.position[0] < x2) ||
          (-Math.sin(input.Object.rotation[1]) < 0 && input.Object.position[0] > x2)) &&
          ((-Math.cos(input.Object.rotation[1]) > 0 && input.Object.position[2] < y2) ||
          (-Math.cos(input.Object.rotation[1]) < 0 && input.Object.position[2] > y2))) &&
          min > (x2 - input.Object.position[0]) * (x2 - input.Object.position[0]) + (y2 - input.Object.position[2]) * (y2 - input.Object.position[2])) {

        min = (x2 - input.Object.position[0]) * (x2 - input.Object.position[0]) + (y2 - input.Object.position[2]) * (y2 - input.Object.position[2]);
      }
    }

    var x3 = (b3 - b) / (a - a3);
    var y3 = a * x3 + b;

    if ((x3 < position[2].x && x3 > position[3].x) || (x3 > position[2].x && x3 < position[3].x)) {
      if ((((-Math.sin(input.Object.rotation[1]) > 0 && input.Object.position[0] < x3) ||
          (-Math.sin(input.Object.rotation[1]) < 0 && input.Object.position[0] > x3)) &&
          ((-Math.cos(input.Object.rotation[1]) > 0 && input.Object.position[2] < y3) ||
          (-Math.cos(input.Object.rotation[1]) < 0 && input.Object.position[2] > y3))) &&
          min > (x3 - input.Object.position[0]) * (x3 - input.Object.position[0]) + (y3 - input.Object.position[2]) * (y3 - input.Object.position[2])) {

        min = (x3 - input.Object.position[0]) * (x3 - input.Object.position[0]) + (y3 - input.Object.position[2]) * (y3 - input.Object.position[2]);
      }
    }

    var x4 = (b4 - b) / (a - a4);
    var y4 = a * x4 + b;

    if ((x4 > position[3].x && x4 < position[0].x) || (x4 < position[3].x && x4 > position[0].x)) {
      if ((((-Math.sin(input.Object.rotation[1]) > 0 && input.Object.position[0] < x4) ||
          (-Math.sin(input.Object.rotation[1]) < 0 && input.Object.position[0] > x4)) &&
          ((-Math.cos(input.Object.rotation[1]) > 0 && input.Object.position[2] < y4) ||
          (-Math.cos(input.Object.rotation[1]) < 0 && input.Object.position[2] > y4))) &&
          min > (x4 - input.Object.position[0]) * (x4 - input.Object.position[0]) + (y4 - input.Object.position[2]) * (y4 - input.Object.position[2])) {

        min = (x4 - input.Object.position[0]) * (x4 - input.Object.position[0]) + (y4 - input.Object.position[2]) * (y4 - input.Object.position[2]);
      }
    }
  }

  triAnsemble(400 - 20 * (input.rotation * input.rotation), 1000, Math.sqrt(min), input);
};

var triAnsemble = function (borne1, borne2, val, cap) {

  var borne0 = (borne2 + borne1) / 2;

  var a1 = 1 / (borne0 - borne1);
  var a2 = 1 / (borne2 - borne0);

  if (val <= borne1) {
    cap.appartenance.e1 = 1;
    cap.appartenance.e2 = 0;
    cap.appartenance.e3 = 0;
  } else if (val > borne1 && val < borne0) {

    cap.appartenance.e2 = a1 * (val - borne1);
    cap.appartenance.e1 = 1 - cap.appartenance.e2;
    cap.appartenance.e3 = 0;
  } else if (val > borne0 && val < borne2) {

    cap.appartenance.e1 = 0;
    cap.appartenance.e3 = a2 * (val - borne0);
    cap.appartenance.e2 = 1 - cap.appartenance.e3;
  } else if (val >= borne2) {

    cap.appartenance.e1 = 0;
    cap.appartenance.e2 = 0;
    cap.appartenance.e3 = 1;
  } else if (val == borne0) {

    cap.appartenance.e1 = 0;
    cap.appartenance.e2 = 1;
    cap.appartenance.e3 = 0;
  }
  tempo();
};


