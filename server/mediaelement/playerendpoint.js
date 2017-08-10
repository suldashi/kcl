"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mediaelement_1 = require("./mediaelement");
var PlayerEndpoint = (function (_super) {
    __extends(PlayerEndpoint, _super);
    function PlayerEndpoint(id, client) {
        return _super.call(this, id, client) || this;
    }
    PlayerEndpoint.prototype.play = function () {
        return this.client.playPlayerEndpoint(this);
    };
    return PlayerEndpoint;
}(mediaelement_1.MediaElement));
exports.PlayerEndpoint = PlayerEndpoint;
