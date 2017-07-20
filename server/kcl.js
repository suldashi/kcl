"use strict";
var messagefactory_1 = require("./message/messagefactory");
var responseadapter_1 = require("./message/responseadapter");
var wschannel_1 = require("./ws/wschannel");
var clientelementmediator_1 = require("./mediaelement/clientelementmediator");
var mediapipeline_1 = require("./mediaelement/mediapipeline");
var dispatcherotm_1 = require("./mediaelement/dispatcherotm");
var KCL = (function () {
    function KCL(wsAddress) {
        this.messageFactory = new messagefactory_1.MessageFactory();
        this.commChannel = new wschannel_1.WSChannel(wsAddress);
        this.mediator = new clientelementmediator_1.ClientElementMediator(this);
        this.responseAdapter = new responseadapter_1.ResponseAdapter();
    }
    KCL.prototype.ping = function () {
        var message = this.messageFactory.createPing();
        return this.commChannel.send(message).then(function (result) {
            return result;
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.createPipeline = function () {
        var _this = this;
        var message = this.messageFactory.createPipeline();
        return this.commChannel.send(message).then(function (result) {
            var pipelineId = _this.responseAdapter.createPipelineSuccess(result);
            var pipeline = new mediapipeline_1.MediaPipeline(pipelineId, _this.mediator);
            return pipeline;
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.createDispatcherOTM = function (mediaPipeline) {
        var _this = this;
        var message = this.messageFactory.createDispatcherOTM(mediaPipeline.id);
        return this.commChannel.send(message).then(function (result) {
            var dispatcherOTMId = _this.responseAdapter.createDispatcherOTMSuccess(result);
            var dispatcherOTM = new dispatcherotm_1.DispatcherOTM(dispatcherOTMId, _this.mediator);
            return dispatcherOTM;
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.releaseElement = function (element) {
        var message = this.messageFactory.releaseElement(element.id);
        return this.commChannel.send(message).then(function (result) {
            return true;
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.connectSourceToSink = function (source, sink) {
        var _this = this;
        var message = this.messageFactory.connectSourceToSink(source.id, sink.id);
        return this.commChannel.send(message).then(function (result) {
            var connectSourceToSinkMessageResult = _this.responseAdapter.connectSourceToSink(result);
            if (connectSourceToSinkMessageResult.success) {
                return source;
            }
            else {
                throw connectSourceToSinkMessageResult.result;
            }
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.createPlayerEndpoint = function (mediaPipeline, filePath) {
        var _this = this;
        var message = this.messageFactory.createPlayerEndpoint(mediaPipeline.id, filePath);
        return this.commChannel.send(message).then(function (result) {
            var playerEndpointId = _this.responseAdapter.createPlayerEndpointSuccess(result);
            return playerEndpointId;
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.createWebRTCEndpoint = function (mediaPipeline) {
        var _this = this;
        var message = this.messageFactory.createWebRTCEndpoint(mediaPipeline.id);
        return this.commChannel.send(message).then(function (result) {
            var webRTCEndpointId = _this.responseAdapter.createWebRTCEndpointSuccess(result);
            return webRTCEndpointId;
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.processOfferWebRTCEndpoint = function (offer, endpoint) {
        var _this = this;
        var message = this.messageFactory.processOfferWebRTCEndpoint(offer, endpoint.id);
        return this.commChannel.send(message).then(function (result) {
            var processOfferMessageResult = _this.responseAdapter.processOfferWebRTCEndpoint(result);
            if (processOfferMessageResult.success) {
                var processOfferSuccess = _this.responseAdapter.processOfferSuccess(result);
                return processOfferSuccess;
            }
            else {
                throw processOfferMessageResult.result;
            }
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.playPlayerEndpoint = function (player) {
        var _this = this;
        var message = this.messageFactory.playPlayerEndpoint(player.id);
        return this.commChannel.send(message).then(function (result) {
            var playMessageResult = _this.responseAdapter.playPlayerEndpoint(result);
            if (playMessageResult.success) {
                return player.id;
            }
            else {
                throw playMessageResult.result;
            }
        }).catch(function (reason) {
            var parsedReason = _this.responseAdapter.playPlayerEndpointFailure(reason);
            throw parsedReason;
        });
    };
    KCL.prototype.addIceCandidate = function (webRTCEndpoint, iceCandidate) {
        var message = this.messageFactory.addIceCandidate(webRTCEndpoint.id, iceCandidate);
        return this.commChannel.send(message).then(function (result) {
            return webRTCEndpoint;
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.gatherIceCandidates = function (webRTCEndpoint) {
        var message = this.messageFactory.gatherIceCandidates(webRTCEndpoint.id);
        return this.commChannel.send(message).then(function (result) {
            return webRTCEndpoint;
        }).catch(function (reason) {
            throw reason;
        });
    };
    KCL.prototype.registerIceCandidateFound = function (webRTCEndpoint, callback) {
        var message = this.messageFactory.registerIceCandidateFound(webRTCEndpoint.id);
        this.commChannel.on(webRTCEndpoint.id, "IceCandidateFound", callback);
        return this.commChannel.send(message).then(function (result) {
            return webRTCEndpoint;
        }).catch(function (reason) {
            throw reason;
        });
    };
    return KCL;
}());
exports.KCL = KCL;
if (typeof window !== "undefined") {
    window['KCL'] = KCL;
}
