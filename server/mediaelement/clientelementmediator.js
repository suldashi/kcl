"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientElementMediator = (function () {
    function ClientElementMediator(client) {
        this.client = client;
    }
    ClientElementMediator.prototype.createPlayerEndpoint = function (pipeline, filePath) {
        return this.client.createPlayerEndpoint(pipeline, filePath);
    };
    ClientElementMediator.prototype.createWebRTCEndpoint = function (pipeline) {
        return this.client.createWebRTCEndpoint(pipeline);
    };
    ClientElementMediator.prototype.playPlayerEndpoint = function (player) {
        return this.client.playPlayerEndpoint(player);
    };
    ClientElementMediator.prototype.processOfferWebRTCEndpoint = function (offer, endpoint) {
        return this.client.processOfferWebRTCEndpoint(offer, endpoint);
    };
    ClientElementMediator.prototype.connectSourceToSink = function (source, sink) {
        return this.client.connectSourceToSink(source, sink);
    };
    ClientElementMediator.prototype.addIceCandidate = function (webRTCEndpoint, candidate) {
        return this.client.addIceCandidate(webRTCEndpoint, candidate);
    };
    ClientElementMediator.prototype.registerIceCandidateFound = function (webRTCEndpoint, callback) {
        return this.client.registerIceCandidateFound(webRTCEndpoint, callback);
    };
    ClientElementMediator.prototype.gatherIceCandidates = function (webRtcEndpoint) {
        return this.client.gatherIceCandidates(webRtcEndpoint);
    };
    ClientElementMediator.prototype.releaseElement = function (element) {
        return this.client.releaseElement(element);
    };
    return ClientElementMediator;
}());
exports.ClientElementMediator = ClientElementMediator;
