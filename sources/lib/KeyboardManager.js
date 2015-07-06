var KeyboardManager = function () {
    this.pressedKeys = {};
    this.nomodCallbacks = {};
    document.onkeydown = _.bind(this.keyDown, this);
    document.onkeyup = _.bind(this.keyUp, this);
    //todo : reset this.pressedKeys on focus lost
};

KeyboardManager.prototype.keyDown = function (event) {
    this.pressedKeys[event.keyCode] = true;
};

KeyboardManager.prototype.keyUp = function (event) {
    delete this.pressedKeys[event.keyCode];
};

KeyboardManager.prototype.registerOnKey = function (keyCode, func) {
    if (!this.nomodCallbacks[keyCode])
        this.nomodCallbacks[keyCode] = $.Callbacks();
    this.nomodCallbacks[keyCode].add(func);
};

KeyboardManager.prototype.unregisterOnKey = function (keyCode, func) {
    this.nomodCallbacks[keyCode].remove(func);
};

KeyboardManager.prototype.compute = function (deltaMs) {
    _.each(this.pressedKeys, function (value, keyCode) {
        if (this.nomodCallbacks[keyCode])
            this.nomodCallbacks[keyCode].fire(deltaMs);
    }, this);
};
