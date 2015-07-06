var Events = {
    // mouse
    mouseLeftDrag: "mouse_left_drag",
    mouseLeftClick: "mouse_left_click",
    mouseMiddleDrag: "mouse_middle_drag",
    mouseMiddleClick: "mouse_middle_click",
    mouseRightDrag: "mouse_right_drag",
    mouseRightClick: "mouse_right_click",
    mouseWheel: "mouse_wheel",

    // size
    onResize: "resize",
    onRender: "render"
};

var callbacks = {};

Events.InitializeEvents = function () {
    _.each(Events, function (value, key) {
        callbacks[value] = $.Callbacks();
    })
};

Events.AddEventListener = function (eventId, func) {
    callbacks[eventId].add(func);
};

Events.RemoveEventListener = function (eventId, func) {
    callbacks[eventId].remove(func);
};

Events.FireEvent = function (eventId, arguments) {
    callbacks[eventId].fire(arguments);
};
