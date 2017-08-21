"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var messagefactory_1 = require("./message/messagefactory");
var responseadapter_1 = require("./message/responseadapter");
var wschannel_1 = require("./ws/wschannel");
var mediapipeline_1 = require("./mediaelement/mediapipeline");
var webrtcendpoint_1 = require("./mediaelement/webrtcendpoint");
var playerendpoint_1 = require("./mediaelement/playerendpoint");
var KCL = (function () {
    function KCL(wsAddress) {
        this.messageFactory = new messagefactory_1.MessageFactory();
        this.ws = new wschannel_1.WSChannel(wsAddress);
        this.responseAdapter = new responseadapter_1.ResponseAdapter();
    }
    KCL.prototype.ping = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.createPing();
                        return [4, this.ws.send(message)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    KCL.prototype.createPipeline = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, pipelineId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.createPipeline();
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        pipelineId = this.responseAdapter.createPipelineSuccess(result);
                        return [2, new mediapipeline_1.MediaPipeline(pipelineId, this)];
                }
            });
        });
    };
    KCL.prototype.releaseElement = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.releaseElement(element.id);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        return [2, true];
                }
            });
        });
    };
    KCL.prototype.connectSourceToSink = function (source, sink) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, connectSourceToSinkMessageResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.connectSourceToSink(source.id, sink.id);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        connectSourceToSinkMessageResult = this.responseAdapter.connectSourceToSink(result);
                        if (connectSourceToSinkMessageResult.success) {
                            return [2, true];
                        }
                        else {
                            throw connectSourceToSinkMessageResult.result;
                        }
                        return [2];
                }
            });
        });
    };
    KCL.prototype.createPlayerEndpoint = function (mediaPipeline, filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, playerEndpointId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.createPlayerEndpoint(mediaPipeline.id, filePath);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        playerEndpointId = this.responseAdapter.createPlayerEndpointSuccess(result);
                        return [2, new playerendpoint_1.PlayerEndpoint(playerEndpointId, this)];
                }
            });
        });
    };
    KCL.prototype.createWebRTCEndpoint = function (mediaPipeline) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, webRTCEndpointId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.createWebRTCEndpoint(mediaPipeline.id);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        webRTCEndpointId = this.responseAdapter.createWebRTCEndpointSuccess(result);
                        return [2, new webrtcendpoint_1.WebRTCEndpoint(webRTCEndpointId, this)];
                }
            });
        });
    };
    KCL.prototype.processOfferWebRTCEndpoint = function (offer, endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, processOfferMessageResult, processOfferSuccess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.processOfferWebRTCEndpoint(offer, endpoint.id);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        processOfferMessageResult = this.responseAdapter.processOfferWebRTCEndpoint(result);
                        if (processOfferMessageResult.success) {
                            processOfferSuccess = this.responseAdapter.processOfferSuccess(result);
                            return [2, processOfferSuccess];
                        }
                        else {
                            throw processOfferMessageResult.result;
                        }
                        return [2];
                }
            });
        });
    };
    KCL.prototype.processAnswerWebRTCEndpoint = function (answer, endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, processAnswerMessageResult, processAnswerSuccess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.processAnswerWebRTCEndpoint(answer, endpoint.id);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        processAnswerMessageResult = this.responseAdapter.processAnswerWebRTCEndpoint(result);
                        if (processAnswerMessageResult.success) {
                            processAnswerSuccess = this.responseAdapter.processAnswerSuccess(result);
                            return [2, processAnswerSuccess];
                        }
                        else {
                            throw processAnswerMessageResult.result;
                        }
                        return [2];
                }
            });
        });
    };
    KCL.prototype.generateOfferWebRTCEndpoint = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, generateOfferMessageResult, processOfferSuccess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.generateOfferWebRTCEndpoint(endpoint.id);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        generateOfferMessageResult = this.responseAdapter.generateOfferWebRTCEndpoint(result);
                        if (generateOfferMessageResult.success) {
                            processOfferSuccess = this.responseAdapter.generateOfferSuccess(result);
                            return [2, processOfferSuccess];
                        }
                        else {
                            throw generateOfferMessageResult.result;
                        }
                        return [2];
                }
            });
        });
    };
    KCL.prototype.playPlayerEndpoint = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, playMessageResult;
            return __generator(this, function (_a) {
                message = this.messageFactory.playPlayerEndpoint(player.id);
                result = this.ws.send(message);
                playMessageResult = this.responseAdapter.playPlayerEndpoint(result);
                if (playMessageResult.success) {
                    return [2, true];
                }
                else {
                    throw playMessageResult.result;
                }
                return [2];
            });
        });
    };
    KCL.prototype.addIceCandidate = function (webRTCEndpoint, iceCandidate) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.addIceCandidate(webRTCEndpoint.id, iceCandidate);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        return [2, true];
                }
            });
        });
    };
    KCL.prototype.gatherIceCandidates = function (webRTCEndpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.gatherIceCandidates(webRTCEndpoint.id);
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        return [2, true];
                }
            });
        });
    };
    KCL.prototype.registerIceCandidateFound = function (webRTCEndpoint, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.registerIceCandidateFound(webRTCEndpoint.id);
                        this.ws.on(webRTCEndpoint.id, "IceCandidateFound", function (candidate) { return callback(candidate.data.candidate); });
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        return [2, true];
                }
            });
        });
    };
    KCL.prototype.registerConnectionStateChanged = function (webRTCEndpoint, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.messageFactory.registerConnectionStateChanged(webRTCEndpoint.id);
                        this.ws.on(webRTCEndpoint.id, "ConnectionStateChanged", function (state) {
                            callback({
                                state: state.data.newState
                            });
                        });
                        return [4, this.ws.send(message)];
                    case 1:
                        result = _a.sent();
                        return [2, true];
                }
            });
        });
    };
    return KCL;
}());
exports.KCL = KCL;
if (typeof window !== "undefined") {
    window['KCL'] = KCL;
}
else {
    module.exports = KCL;
}
