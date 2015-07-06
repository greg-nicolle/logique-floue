var MouseManager = function () {
    this.mousePos = {x: 0, y: 0};
    this.leftDownPosition = null;
    this.middleDownPosition = null;
    this.rightDownPosition = null;
    this.dragStruct = {
        pos: this.mousePos,
        delta: { x: 0, y: 0}
    };

    var canvas = $('#renderingCanvas');
    canvas.mousedown(_.bind(this.mouseDown, this));
    canvas.mouseup(_.bind(this.mouseUp, this));
    canvas.mousemove(_.bind(this.mouseMove, this));
    canvas.mouseleave(_.bind(this.resetButton, this));
    canvas.on('mousewheel DOMMouseScroll', _.bind(this.wheel, this));
    canvas.css('cursor', 'default');
};

MouseManager.prototype.resetButton = function () {
    delete this.leftDownPosition;
    delete this.rightDownPosition;
    delete this.middleDownPosition;
    this.dragStruct.delta.x = 0;
    this.dragStruct.delta.y = 0;
};

MouseManager.prototype.wheel = function (event) {
    var wheelDelta = event.originalEvent.wheelDelta;
    if(event.originalEvent.detail)
        wheelDelta = Math.sign(event.originalEvent.detail) * -120;
    Events.FireEvent(Events.mouseWheel, wheelDelta);
};

MouseManager.prototype.mouseDown = function (event) {
    if (event.button == 0)
        this.leftDownPosition = { x: event.clientX, y: event.clientY };
    else if (event.button == 1)
        this.middleDownPosition = { x: event.clientX, y: event.clientY };
    else if (event.button == 2)
        this.rightDownPosition = { x: event.clientX, y: event.clientY };
};

MouseManager.prototype.mouseUp = function (event) {
    if (event.button == 0) {
        if (this.leftDownPosition && this.leftDownPosition.x == event.clientX && this.leftDownPosition.y == event.clientY)
            Events.FireEvent(Events.mouseLeftClick, this.leftDownPosition);
        delete this.leftDownPosition;
    } else if (event.button == 1) {
        if (this.middleDownPosition && this.middleDownPosition.x == event.clientX && this.middleDownPosition.y == event.clientY)
            Events.FireEvent(Events.mouseMiddleClick, this.middleDownPosition);
        delete this.middleDownPosition;
    } else if (event.button == 2) {
        if (this.rightDownPosition && this.rightDownPosition.x == event.clientX && this.rightDownPosition.y == event.clientY)
            Events.FireEvent(Events.mouseRightClick, this.rightDownPosition);
        delete this.rightDownPosition;
    }

    var canvas = $('#renderingCanvas');
    canvas.css('cursor', 'auto');
};

MouseManager.prototype.mouseMove = function (event) {

    this.dragStruct.delta.x = event.clientX - this.mousePos.x;
    this.dragStruct.delta.y = event.clientY - this.mousePos.y;
    this.mousePos.x = event.clientX;
    this.mousePos.y = event.clientY;

    if (this.dragStruct.delta.x != 0 || this.dragStruct.delta.y != 0) {
        var canvas = $('#renderingCanvas');
        if (this.leftDownPosition) {
            Events.FireEvent(Events.mouseLeftDrag, this.dragStruct);
            //todo : cursor change doesn't work on left drag
            canvas.css('cursor', 'move');
        }
        if (this.middleDownPosition) {
            Events.FireEvent(Events.mouseMiddleDrag, this.dragStruct);
            canvas.css('cursor', 'move');
        }
        if (this.rightDownPosition) {
            Events.FireEvent(Events.mouseRightDrag, this.dragStruct);
            canvas.css('cursor', 'move');
        }
    }
};
