const borne1 = -Math.PI;
const borne2 = Math.PI;

exports.defloutage = function (caps) {
  return new Promise(function (resolve, reject) {
    var sum = 0;
    var tmp = 0;
    for (var i in caps) {
      if (!!caps[i].appartenance.e1) {
        tmp = caps[i].appartenance.e1;
      }
      if (caps[i].largeur > 0) {
        sum += caps[i].appartenance.e1 * Math.PI / 2 + caps[i].appartenance.e2 * Math.PI / 4;
      } else {
        sum += -caps[i].appartenance.e1 * Math.PI / 2 - caps[i].appartenance.e2 * Math.PI / 4;
      }
    }
    if (!!tmp && !sum) {
      sum = tmp * Math.PI / 2;
    }
    resolve(sum / caps.length);
  });
};

exports.defu = function (val) {
  return new Promise(function (resolve, reject) {
    var res = {};
    var borne0 = (borne2 + borne1) / 2;

    var a1 = 1 / (borne0 - borne1);
    var a2 = 1 / (borne2 - borne0);

    if (val <= borne1) {
      res.e1 = 1;
      res.e2 = 0;
      res.e3 = 0;
    } else if (val > borne1 && val < borne0) {

      res.e2 = a1 * (val - borne1);
      res.e1 = 1 - res.e2;
      res.e3 = 0;
    } else if (val > borne0 && val < borne2) {

      res.e1 = 0;
      res.e3 = a2 * (val - borne0);
      res.e2 = 1 - res.e3;
    } else if (val >= borne2) {

      res.e1 = 0;
      res.e2 = 0;
      res.e3 = 1;
    } else if (val == borne0) {

      res.e1 = 0;
      res.e2 = 1;
      res.e3 = 0;
    }

    resolve({vitesse: Math.exp(res.e2 * 2) - 1, rotation: (res.e3 * Math.PI / 6) - (res.e1 * Math.PI / 6)});
  })
};

exports.calcul_droite = function (input,obstacles) {
  return new Promise(function (resolve, reject) {
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

    var result = {};
    result.borne1 = 400 - 20 * (input.rotation * input.rotation);
    result.borne2 = 1000;
    result.val = Math.sqrt(min);
    result.cap = input;
    resolve(result)
  })
};

exports.triAnsemble = function (input) {

  return new Promise(function (resolve, reject) {
    var borne1 = input.borne1,
      borne2 = input.borne2,
      val = input.val,
      cap = input.cap;
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
    resolve();
  });
};
