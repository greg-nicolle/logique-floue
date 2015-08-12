exports.escargot = function (obstacles,robot,camera) {
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
  //e_pause = false;
};

exports.demitour = function (obstacles,robot,camera) {
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

exports.demitour2 = function (obstacles,robot,camera) {
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

exports.antonoir = function (obstacles,robot,camera) {
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

exports.reboot = function (obstacles,robot,camera) {
  for (var i = 1; i < 30; i++) {
    obstacles[i].Object.setPosition(Math.random() * 25000 - 12500, 0, Math.random() * 25000 - 12500);
    obstacles[i].Object.setRotation(0, Math.random() * Math.PI - Math.PI / 2, 0);
  }
  robot.Object.setPosition(0, 0, 0);
  robot.Object.setRotation(0, 0, 0);
  camera.setPosition(-2500, 1000, 2500);
  camera.setTarget(0, 0, 0);
};
