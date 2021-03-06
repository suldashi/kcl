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
var WebRTCEndpoint = (function (_super) {
    __extends(WebRTCEndpoint, _super);
    function WebRTCEndpoint(id, client) {
        return _super.call(this, id, client) || this;
    }
    WebRTCEndpoint.prototype.processOffer = function (offer) {
        return this.client.processOfferWebRTCEndpoint(offer, this);
    };
    WebRTCEndpoint.prototype.processAnswer = function (answer) {
        return this.client.processAnswerWebRTCEndpoint(answer, this);
    };
    WebRTCEndpoint.prototype.generateOffer = function (offer) {
        return this.client.generateOfferWebRTCEndpoint(this);
    };
    WebRTCEndpoint.prototype.addIceCandidate = function (candidate) {
        return this.client.addIceCandidate(this, candidate);
    };
    WebRTCEndpoint.prototype.registerIceCandidateFound = function (callback) {
        return this.client.registerIceCandidateFound(this, callback);
    };
    WebRTCEndpoint.prototype.registerConnectionStateChanged = function (callback) {
        return this.client.registerConnectionStateChanged(this, callback);
    };
    WebRTCEndpoint.prototype.gatherIceCandidates = function () {
        return this.client.gatherIceCandidates(this);
    };
    WebRTCEndpoint.prototype.setMinVideoSendBandwidth = function (bitrate) {
        return this.client.setMinVideoSendBandwidth(this, bitrate);
    };
    WebRTCEndpoint.prototype.setMaxVideoSendBandwidth = function (bitrate) {
        return this.client.setMaxVideoSendBandwidth(this, bitrate);
    };
    WebRTCEndpoint.prototype.setMinVideoRecvBandwidth = function (bitrate) {
        return this.client.setMinVideoRecvBandwidth(this, bitrate);
    };
    WebRTCEndpoint.prototype.setMaxVideoRecvBandwidth = function (bitrate) {
        return this.client.setMaxVideoRecvBandwidth(this, bitrate);
    };
    return WebRTCEndpoint;
}(mediaelement_1.MediaElement));
exports.WebRTCEndpoint = WebRTCEndpoint;
