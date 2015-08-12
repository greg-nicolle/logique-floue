/**
 * Created by greg on 05/03/15.
 */
HTMLElement.prototype.has_class = function (c) {
  /*
   * .indexOf() -> Retourne la position de l'argument (à partir de quel caractère il se trouve dans la chaîne)
   * Retourne -1 si l'argument n'est pas dans la chaîne testée
   */
  return (this.className.indexOf(c) >= 0);
};

var acc = {};

/* Script sur action "click" */
acc.init = function () {
  /* object.addEventListener (eventName, function, useCapture) */
  document.addEventListener("click", acc.on_click);

};


acc.on_click = function (ev) {
  // .target désigne la cible(le noeud DOM) concerné par le chang. d'état sur événement "click" (ici balises <div>)
  var src = ev.target;
  //alert("click : " + ev.target);
  if (src.has_class("capteur")) {
    change_capteur();
  } else if (src.has_class("play")) {
    pause();
  } else if (src.has_class("nitro")) {
    nitro();
  } else if (src.has_class("reboot")) {
    reboot();
  } else if (src.has_class("escargot")) {
    escargot();
  } else if (src.has_class("demitour")) {
    demitour();
  } else if (src.has_class("antonoir")) {
    antonoir();
  } else if (src.has_class("emitour2")) {
    demitour2();
  }

};
acc.init();