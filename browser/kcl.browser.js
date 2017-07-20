(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  var validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");

  function gen(count) {
    var out = "";
    for (var i=0; i<count; i++) {
      out += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return out;
  }

  function Guid(guid) {
    if (!guid) throw new TypeError("Invalid argument; `value` has no value.");
      
    this.value = Guid.EMPTY;
    
    if (guid && guid instanceof Guid) {
      this.value = guid.toString();

    } else if (guid && Object.prototype.toString.call(guid) === "[object String]" && Guid.isGuid(guid)) {
      this.value = guid;
    }
    
    this.equals = function(other) {
      // Comparing string `value` against provided `guid` will auto-call
      // toString on `guid` for comparison
      return Guid.isGuid(other) && this.value == other;
    };

    this.isEmpty = function() {
      return this.value === Guid.EMPTY;
    };
    
    this.toString = function() {
      return this.value;
    };
    
    this.toJSON = function() {
      return this.value;
    };
  };

  Guid.EMPTY = "00000000-0000-0000-0000-000000000000";

  Guid.isGuid = function(value) {
    return value && (value instanceof Guid || validator.test(value.toString()));
  };

  Guid.create = function() {
    return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join("-"));
  };

  Guid.raw = function() {
    return [gen(2), gen(1), gen(1), gen(1), gen(3)].join("-");
  };

  if(typeof module != 'undefined' && module.exports) {
    module.exports = Guid;
  }
  else if (typeof window != 'undefined') {
    window.Guid = Guid;
  }
})();

},{}],2:[function(require,module,exports){
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

},{"./mediaelement/clientelementmediator":3,"./mediaelement/dispatcherotm":4,"./mediaelement/mediapipeline":6,"./message/messagefactory":9,"./message/responseadapter":10,"./ws/wschannel":13}],3:[function(require,module,exports){
"use strict";
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

},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mediaelement_1 = require("./mediaelement");
var DispatcherOTM = (function (_super) {
    __extends(DispatcherOTM, _super);
    function DispatcherOTM(id, mediator) {
        _super.call(this, id, mediator);
    }
    return DispatcherOTM;
}(mediaelement_1.MediaElement));
exports.DispatcherOTM = DispatcherOTM;

},{"./mediaelement":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./playerendpoint":7,"./webrtcendpoint":8}],7:[function(require,module,exports){
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

},{"./mediaelement":5}],8:[function(require,module,exports){
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

},{"./mediaelement":5}],9:[function(require,module,exports){
"use strict";
var guid = require("guid");
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
    MessageFactory.prototype.createDispatcherOTM = function (pipelineId) {
        var message = this.newMessage("create");
        message.params = {
            type: "DispatcherOneToMany",
            constructorParams: {
                mediaPipeline: pipelineId,
            }
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
    MessageFactory.prototype.registerIceCandidateFound = function (webRTCEndpointId) {
        var message = this.newMessage("subscribe");
        message.params = {
            type: "IceCandidateFound",
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
    MessageFactory.prototype.newMessage = function (method) {
        var message = new wsmessage_1.WSMessage();
        message.method = method;
        message.id = guid.create().value;
        return message;
    };
    return MessageFactory;
}());
exports.MessageFactory = MessageFactory;

},{"./wsmessage":11,"guid":1}],10:[function(require,module,exports){
"use strict";
var ResponseAdapter = (function () {
    function ResponseAdapter() {
    }
    ResponseAdapter.prototype.pingSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.pingFailure = function (response) {
        return response.toString();
    };
    ResponseAdapter.prototype.createPipelineSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.createPlayerEndpointSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.createWebRTCEndpointSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.createDispatcherOTMSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.playPlayerEndpoint = function (response) {
        return this.operationError(response);
    };
    ResponseAdapter.prototype.processOfferWebRTCEndpoint = function (response) {
        return this.operationError(response);
    };
    ResponseAdapter.prototype.processOfferSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.connectSourceToSink = function (response) {
        return this.operationError(response);
    };
    ResponseAdapter.prototype.playPlayerEndpointFailure = function (reason) {
        return reason.error.message;
    };
    ResponseAdapter.prototype.getValue = function (response) {
        return response.result.value;
    };
    ResponseAdapter.prototype.operationError = function (response) {
        if (typeof response.error === "undefined") {
            return { "success": true, "result": response.result };
        }
        else {
            return { "success": false, "result": response };
        }
    };
    return ResponseAdapter;
}());
exports.ResponseAdapter = ResponseAdapter;

},{}],11:[function(require,module,exports){
"use strict";
var WSMessage = (function () {
    function WSMessage() {
        this.jsonrpc = "2.0";
    }
    return WSMessage;
}());
exports.WSMessage = WSMessage;

},{}],12:[function(require,module,exports){
"use strict";
exports.WS = WebSocket;

},{}],13:[function(require,module,exports){
"use strict";
var websocket_1 = require("./websocket");
var WSChannel = (function () {
    function WSChannel(wsAddress) {
        this.wsUrl = "192.168.56.101:8888";
        this.ws = new websocket_1.WS(wsAddress + "/kurento");
        var t = this;
        this.messageListeners = {};
        this.eventListeners = {};
        this.ws.onmessage = function (result) {
            var data = JSON.parse(result.data);
            if (data.method != "onEvent" && typeof data.error === "undefined") {
                var id = data.id;
                t.messageListeners[id]["resolve"](data);
                delete t.messageListeners[id];
            }
            else if (typeof data.error !== "undefined") {
                var id = data.id;
                t.messageListeners[id]["reject"](data);
                delete t.messageListeners[id];
            }
            else {
                var index = data.params.value.object + "|" + data.params.value.type;
                for (var i in t.eventListeners[index]) {
                    t.eventListeners[index][i](data.params.value.data.candidate);
                }
            }
        };
    }
    WSChannel.prototype.on = function (objectId, methodName, callback) {
        var index = objectId + "|" + methodName;
        if (typeof this.eventListeners[index] === "undefined") {
            this.eventListeners[index] = [];
        }
        this.eventListeners[index].push(callback);
    };
    WSChannel.prototype.send = function (data) {
        var id = data.id;
        var t = this;
        return new Promise(function (resolve, reject) {
            try {
                t.ws.send(JSON.stringify(data));
                t.messageListeners[id] = { resolve: resolve, reject: reject };
            }
            catch (e) {
                reject(e);
            }
            setTimeout(function () {
                reject("timeoutError");
                delete t.messageListeners[id];
            }, 10000);
        });
    };
    return WSChannel;
}());
exports.WSChannel = WSChannel;

},{"./websocket":12}]},{},[2]);
