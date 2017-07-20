"use strict";
var MediaElement = (function () {
    function MediaElement(id, mediator) {
        this.id = id;
        this.mediator = mediator;
    }
    MediaElement.prototype.connectToSink = function (target) {
        var t = this;
        return this.mediator.connectSourceToSink(this, target).then(function (result) {
            t.sink = target;
            return t;
        });
    };
    return MediaElement;
}());
exports.MediaElement = MediaElement;
