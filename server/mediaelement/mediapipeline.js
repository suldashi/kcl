"use strict";
var playerendpoint_1 = require("./playerendpoint");
var webrtcendpoint_1 = require("./webrtcendpoint");
var MediaPipeline = (function () {
    function MediaPipeline(id, mediator) {
        this.id = id;
        this.mediator = mediator;
        this.mediaElements = new Array();
    }
    MediaPipeline.prototype.createPlayerEndpoint = function (filePath) {
        var _this = this;
        var p = this.mediator.createPlayerEndpoint(this, filePath);
        var mediator = this.mediator;
        return p.then(function (result) {
            var playerEndpoint = new playerendpoint_1.PlayerEndpoint(result, mediator);
            _this.mediaElements.push(playerEndpoint);
            return playerEndpoint;
        });
    };
    MediaPipeline.prototype.createWebRTCEndpoint = function () {
        var _this = this;
        var p = this.mediator.createWebRTCEndpoint(this);
        var mediator = this.mediator;
        return p.then(function (result) {
            var webRtcEndpoint = new webrtcendpoint_1.WebRTCEndpoint(result, mediator);
            _this.mediaElements.push(webRtcEndpoint);
            return webRtcEndpoint;
        });
    };
    MediaPipeline.prototype.release = function () {
        return this.mediator.releaseElement(this);
    };
    return MediaPipeline;
}());
exports.MediaPipeline = MediaPipeline;
