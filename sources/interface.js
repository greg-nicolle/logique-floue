HTMLElement.prototype.has_class = function (c) {
  return (this.className.indexOf(c) >= 0);
};

var acc = {};

acc.init = function () {
  document.addEventListener("click", acc.on_click);
};


acc.on_click = function (ev) {
  var src = ev.target;
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
