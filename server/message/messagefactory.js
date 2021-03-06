"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidPackage = require("uuid");
var uuid = uuidPackage.v4;
var wsmessage_1 = require("./wsmessage");
var MessageFactory = (function () {
    function MessageFactory() {
    }
    MessageFactory.prototype.createPing = function () {
        var message = this.newMessage("ping");
        message.params = {
            interval: 1000
        };
        return message;
    };
    MessageFactory.prototype.createPipeline = function () {
        var message = this.newMessage("create");
        message.params = {
            type: "MediaPipeline",
            constructorParams: {}
        };
        return message;
    };
    MessageFactory.prototype.releaseElement = function (elementId) {
        var message = this.newMessage("release");
        message.params = {
            object: elementId
        };
        return message;
    };
    MessageFactory.prototype.addIceCandidate = function (webRTCEndpointId, candidate) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "addIceCandidate",
            object: webRTCEndpointId,
            operationParams: {
                "candidate": candidate
            }
        };
        return message;
    };
    MessageFactory.prototype.createPlayerEndpoint = function (pipelineId, filePath) {
        var message = this.newMessage("create");
        message.params = {
            type: "PlayerEndpoint",
            constructorParams: {
                mediaPipeline: pipelineId,
                uri: filePath
            }
        };
        return message;
    };
    MessageFactory.prototype.createWebRTCEndpoint = function (pipelineId) {
        var message = this.newMessage("create");
        message.params = {
            type: "WebRtcEndpoint",
            constructorParams: {
                mediaPipeline: pipelineId,
            }
        };
        return message;
    };
    MessageFactory.prototype.createComposite = function (pipelineId) {
        var message = this.newMessage("create");
        message.params = {
            type: "Composite",
            constructorParams: {
                mediaPipeline: pipelineId,
            }
        };
        return message;
    };
    MessageFactory.prototype.createHubPort = function (pipelineId) {
        var message = this.newMessage("create");
        message.params = {
            type: "HubPort",
            constructorParams: {
                mediaPipeline: pipelineId,
            }
        };
        return message;
    };
    MessageFactory.prototype.playPlayerEndpoint = function (playerId) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "play",
            object: playerId,
            constructorParams: {}
        };
        return message;
    };
    MessageFactory.prototype.processOfferWebRTCEndpoint = function (offer, endpointId) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "processOffer",
            object: endpointId,
            operationParams: {
                "offer": offer
            }
        };
        return message;
    };
    MessageFactory.prototype.processAnswerWebRTCEndpoint = function (answer, endpointId) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "processAnswer",
            object: endpointId,
            operationParams: {
                "answer": answer
            }
        };
        return message;
    };
    MessageFactory.prototype.generateOfferWebRTCEndpoint = function (endpointId) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "generateOffer",
            object: endpointId
        };
        return message;
    };
    MessageFactory.prototype.registerIceCandidateFound = function (webRTCEndpointId) {
        var message = this.newMessage("subscribe");
        message.params = {
            type: "IceCandidateFound",
            object: webRTCEndpointId,
        };
        return message;
    };
    MessageFactory.prototype.registerConnectionStateChanged = function (webRTCEndpointId) {
        var message = this.newMessage("subscribe");
        message.params = {
            type: "ConnectionStateChanged",
            object: webRTCEndpointId,
        };
        return message;
    };
    MessageFactory.prototype.gatherIceCandidates = function (webRTCEndpointId) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "gatherCandidates",
            object: webRTCEndpointId,
        };
        return message;
    };
    MessageFactory.prototype.connectSourceToSink = function (sourceId, sinkId) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "connect",
            object: sourceId,
            operationParams: {
                "sink": sinkId
            }
        };
        return message;
    };
    MessageFactory.prototype.setMinVideoSendBandwidth = function (sourceId, bitrate) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "setMinVideoSendBandwidth",
            object: sourceId,
            operationParams: {
                "minVideoSendBandwidth": bitrate
            }
        };
        return message;
    };
    MessageFactory.prototype.setMaxVideoSendBandwidth = function (sourceId, bitrate) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "setMaxVideoSendBandwidth",
            object: sourceId,
            operationParams: {
                "maxVideoSendBandwidth": bitrate
            }
        };
        return message;
    };
    MessageFactory.prototype.setMinVideoRecvBandwidth = function (sourceId, bitrate) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "setMinVideoRecvBandwidth",
            object: sourceId,
            operationParams: {
                "minVideoRecvBandwidth": bitrate
            }
        };
        return message;
    };
    MessageFactory.prototype.setMaxVideoRecvBandwidth = function (sourceId, bitrate) {
        var message = this.newMessage("invoke");
        message.params = {
            operation: "setMaxVideoRecvBandwidth",
            object: sourceId,
            operationParams: {
                "maxVideoRecvBandwidth": bitrate
            }
        };
        return message;
    };
    MessageFactory.prototype.newMessage = function (method) {
        var message = new wsmessage_1.WSMessage();
        message.method = method;
        message.id = uuid();
        return message;
    };
    return MessageFactory;
}());
exports.MessageFactory = MessageFactory;
