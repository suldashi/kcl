"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mediaelement_1 = require("./mediaelement");
var PlayerEndpoint = (function (_super) {
    __extends(PlayerEndpoint, _super);
    function PlayerEndpoint(id, mediator) {
        _super.call(this, id, mediator);
    }
    PlayerEndpoint.prototype.play = function () {
        return this.mediator.playPlayerEndpoint(this);
    };
    return PlayerEndpoint;
}(mediaelement_1.MediaElement));
exports.PlayerEndpoint = PlayerEndpoint;
