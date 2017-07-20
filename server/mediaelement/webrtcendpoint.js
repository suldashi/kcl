"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mediaelement_1 = require("./mediaelement");
var WebRTCEndpoint = (function (_super) {
    __extends(WebRTCEndpoint, _super);
    function WebRTCEndpoint(id, mediator) {
        _super.call(this, id, mediator);
    }
    WebRTCEndpoint.prototype.processOffer = function (offer) {
        return this.mediator.processOfferWebRTCEndpoint(offer, this);
    };
    WebRTCEndpoint.prototype.addIceCandidate = function (candidate) {
        return this.mediator.addIceCandidate(this, candidate);
    };
    WebRTCEndpoint.prototype.registerIceCandidateFound = function (callback) {
        return this.mediator.registerIceCandidateFound(this, callback);
    };
    WebRTCEndpoint.prototype.gatherIceCandidates = function () {
        return this.mediator.gatherIceCandidates(this);
    };
    WebRTCEndpoint.prototype.release = function () {
        return this.mediator.releaseElement(this);
    };
    return WebRTCEndpoint;
}(mediaelement_1.MediaElement));
exports.WebRTCEndpoint = WebRTCEndpoint;
