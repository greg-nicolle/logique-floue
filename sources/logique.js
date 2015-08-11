exports.defloutage = function(capteurs) {
  return new Promise(function(resolve, reject) {
    var sum = 0;
    var tmp = 0;
    for (var i in capteurs) {
      if (!!capteurs[i].appartenance.e1) {
        tmp = capteurs[i].appartenance.e1;
      }
      if (capteurs[i].largeur > 0) {
        sum += capteurs[i].appartenance.e1 * Math.PI / 2 + capteurs[i].appartenance.e2 * Math.PI / 4;
      } else {
        sum += -capteurs[i].appartenance.e1 * Math.PI / 2 - capteurs[i].appartenance.e2 * Math.PI / 4;
      }
    }
    if (!!tmp && !sum) {
      sum = tmp * Math.PI / 2;
    }
    resolve(sum/capteurs.length);
  });
};
var borne1 = -Math.PI;
var borne2 = -borne1;

exports.defu = function(val){
      return new Promise(function(resolve, reject) {
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

        vitesse = vitessemax * (Math.exp(res.e2 * 2) - 1) + vitessemin;
        robot.Object.setRotation(0, robot.Object.rotation[1] - res.e1 * Math.PI / 2, 0);
        robot.Object.setRotation(0, robot.Object.rotation[1] + res.e3 * Math.PI / 2, 0);
        resolve({vitesse:vitesse,rotation:robot.Object.rotation[1] - res.e1 * Math.PI / 2 + res.e3 * Math.PI / 2});
      })
};