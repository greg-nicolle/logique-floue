exports.defloutage = function(caps) {
  return new Promise(function(resolve, reject) {
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
    resolve(sum/caps.length);
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

        resolve({vitesse:Math.exp(res.e2 * 2) - 1,rotation: (res.e3 * Math.PI / 2) - (res.e1 * Math.PI / 2)});
      })
};