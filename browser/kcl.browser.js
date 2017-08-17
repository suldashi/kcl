(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class MiniMQ {
	constructor() {
		this.queue = [];
		this.closeQueue();
		this.handlerFunction = (el,prm,resolve,reject) => {};
	}

	openQueue() {
		while(this.queue.length!==0) {
			let currentEl = this.queue.shift();
			this.handlerFunction(currentEl.el,currentEl.prm,currentEl.resolveInstance,currentEl.rejectInstance);
		}
		this.isQueueOpen = true;
	}

	closeQueue() {
		this.isQueueOpen = false;
	}

	addElement(el) {
		let resolveInstance;
		let rejectInstance;
		let prm = new Promise((resolve,reject) => {
			resolveInstance = resolve;
			rejectInstance = reject;
		});
		if(this.isQueueOpen) {
			this.handlerFunction(el,prm,resolveInstance,rejectInstance);
		}
		else {
			this.queue.push({
				el:el,
				prm:prm,
				resolveInstance:resolveInstance,
				rejectInstance,rejectInstance
			});
		}
		return prm;
	}
}

if(typeof window !== "undefined") {
	window.MiniMQ = MiniMQ;	
}
module.exports = MiniMQ;
//end of file
},{}],2:[function(require,module,exports){
"use strict";
var isWebSocket = function (constructor) {
    return constructor && constructor.CLOSING === 2;
};
var isGlobalWebSocket = function () {
    return typeof WebSocket !== 'undefined' && isWebSocket(WebSocket);
};
var getDefaultOptions = function () { return ({
    constructor: isGlobalWebSocket() ? WebSocket : null,
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1500,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4000,
    maxRetries: Infinity,
    debug: false,
}); };
var bypassProperty = function (src, dst, name) {
    Object.defineProperty(dst, name, {
        get: function () { return src[name]; },
        set: function (value) { src[name] = value; },
        enumerable: true,
        configurable: true,
    });
};
var initReconnectionDelay = function (config) {
    return (config.minReconnectionDelay + Math.random() * config.minReconnectionDelay);
};
var updateReconnectionDelay = function (config, previousDelay) {
    var newDelay = previousDelay * config.reconnectionDelayGrowFactor;
    return (newDelay > config.maxReconnectionDelay)
        ? config.maxReconnectionDelay
        : newDelay;
};
var LEVEL_0_EVENTS = ['onopen', 'onclose', 'onmessage', 'onerror'];
var reassignEventListeners = function (ws, oldWs, listeners) {
    Object.keys(listeners).forEach(function (type) {
        listeners[type].forEach(function (_a) {
            var listener = _a[0], options = _a[1];
            ws.addEventListener(type, listener, options);
        });
    });
    if (oldWs) {
        LEVEL_0_EVENTS.forEach(function (name) { ws[name] = oldWs[name]; });
    }
};
var ReconnectingWebsocket = function (url, protocols, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var ws;
    var connectingTimeout;
    var reconnectDelay = 0;
    var retriesCount = 0;
    var shouldRetry = true;
    var savedOnClose = null;
    var listeners = {};
    // require new to construct
    if (!(this instanceof ReconnectingWebsocket)) {
        throw new TypeError("Failed to construct 'ReconnectingWebSocket': Please use the 'new' operator");
    }
    // Set config. Not using `Object.assign` because of IE11
    var config = getDefaultOptions();
    Object.keys(config)
        .filter(function (key) { return options.hasOwnProperty(key); })
        .forEach(function (key) { return config[key] = options[key]; });
    if (!isWebSocket(config.constructor)) {
        throw new TypeError('Invalid WebSocket constructor. Set `options.constructor`');
    }
    var log = config.debug ? function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return console.log.apply(console, ['RWS:'].concat(params));
    } : function () { };
    /**
     * Not using dispatchEvent, otherwise we must use a DOM Event object
     * Deferred because we want to handle the close event before this
     */
    var emitError = function (code, msg) { return setTimeout(function () {
        var err = new Error(msg);
        err.code = code;
        if (Array.isArray(listeners.error)) {
            listeners.error.forEach(function (_a) {
                var fn = _a[0];
                return fn(err);
            });
        }
        if (ws.onerror) {
            ws.onerror(err);
        }
    }, 0); };
    var handleClose = function () {
        log('handleClose', { shouldRetry: shouldRetry });
        retriesCount++;
        log('retries count:', retriesCount);
        if (retriesCount > config.maxRetries) {
            emitError('EHOSTDOWN', 'Too many failed connection attempts');
            return;
        }
        if (!reconnectDelay) {
            reconnectDelay = initReconnectionDelay(config);
        }
        else {
            reconnectDelay = updateReconnectionDelay(config, reconnectDelay);
        }
        log('handleClose - reconnectDelay:', reconnectDelay);
        if (shouldRetry) {
            setTimeout(connect, reconnectDelay);
        }
    };
    var connect = function () {
        if (!shouldRetry) {
            return;
        }
        log('connect');
        var oldWs = ws;
        ws = new config.constructor(url, protocols);
        connectingTimeout = setTimeout(function () {
            log('timeout');
            ws.close();
            emitError('ETIMEDOUT', 'Connection timeout');
        }, config.connectionTimeout);
        log('bypass properties');
        for (var key in ws) {
            // @todo move to constant
            if (['addEventListener', 'removeEventListener', 'close', 'send'].indexOf(key) < 0) {
                bypassProperty(ws, _this, key);
            }
        }
        ws.addEventListener('open', function () {
            clearTimeout(connectingTimeout);
            log('open');
            reconnectDelay = initReconnectionDelay(config);
            log('reconnectDelay:', reconnectDelay);
            retriesCount = 0;
        });
        ws.addEventListener('close', handleClose);
        reassignEventListeners(ws, oldWs, listeners);
        // because when closing with fastClose=true, it is saved and set to null to avoid double calls
        ws.onclose = ws.onclose || savedOnClose;
        savedOnClose = null;
    };
    log('init');
    connect();
    this.close = function (code, reason, _a) {
        if (code === void 0) { code = 1000; }
        if (reason === void 0) { reason = ''; }
        var _b = _a === void 0 ? {} : _a, _c = _b.keepClosed, keepClosed = _c === void 0 ? false : _c, _d = _b.fastClose, fastClose = _d === void 0 ? true : _d, _e = _b.delay, delay = _e === void 0 ? 0 : _e;
        log('close - params:', { reason: reason, keepClosed: keepClosed, fastClose: fastClose, delay: delay });
        shouldRetry = !keepClosed;
        if (delay) {
            reconnectDelay = delay;
        }
        ws.close(code, reason);
        if (fastClose) {
            var fakeCloseEvent_1 = {
                code: code,
                reason: reason,
                wasClean: true,
            };
            // execute close listeners soon with a fake closeEvent
            // and remove them from the WS instance so they
            // don't get fired on the real close.
            handleClose();
            ws.removeEventListener('close', handleClose);
            // run and remove level2
            if (Array.isArray(listeners.close)) {
                listeners.close.forEach(function (_a) {
                    var listener = _a[0], options = _a[1];
                    listener(fakeCloseEvent_1);
                    ws.removeEventListener('close', listener, options);
                });
            }
            // run and remove level0
            if (ws.onclose) {
                savedOnClose = ws.onclose;
                ws.onclose(fakeCloseEvent_1);
                ws.onclose = null;
            }
        }
    };
    this.send = function (data) {
        ws.send(data);
    };
    this.addEventListener = function (type, listener, options) {
        if (Array.isArray(listeners[type])) {
            if (!listeners[type].some(function (_a) {
                var l = _a[0];
                return l === listener;
            })) {
                listeners[type].push([listener, options]);
            }
        }
        else {
            listeners[type] = [[listener, options]];
        }
        ws.addEventListener(type, listener, options);
    };
    this.removeEventListener = function (type, listener, options) {
        if (Array.isArray(listeners[type])) {
            listeners[type] = listeners[type].filter(function (_a) {
                var l = _a[0];
                return l !== listener;
            });
        }
        ws.removeEventListener(type, listener, options);
    };
};
module.exports = ReconnectingWebsocket;

},{}],3:[function(require,module,exports){
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":6,"./v4":7}],4:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],5:[function(require,module,exports){
(function (global){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":4,"./lib/rng":5}],7:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":4,"./lib/rng":5}],8:[function(require,module,exports){
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
                message = this.messageFactory.createPing();
                return [2, this.ws.send(message)];
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
                        this.ws.on(webRTCEndpoint.id, "IceCandidateFound", callback);
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

},{"./mediaelement/mediapipeline":10,"./mediaelement/playerendpoint":11,"./mediaelement/webrtcendpoint":12,"./message/messagefactory":13,"./message/responseadapter":14,"./ws/wschannel":17}],9:[function(require,module,exports){
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
var MediaElement = (function () {
    function MediaElement(id, client) {
        this.id = id;
        this.client = client;
    }
    MediaElement.prototype.connectToSink = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.connectSourceToSink(this, target)];
                    case 1:
                        result = _a.sent();
                        this.sink = target;
                        return [2, this];
                }
            });
        });
    };
    return MediaElement;
}());
exports.MediaElement = MediaElement;

},{}],10:[function(require,module,exports){
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
var MediaPipeline = (function () {
    function MediaPipeline(id, client) {
        this.id = id;
        this.client = client;
        this.mediaElements = new Array();
    }
    MediaPipeline.prototype.createPlayerEndpoint = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.createPlayerEndpoint(this, filePath)];
            });
        });
    };
    MediaPipeline.prototype.createWebRTCEndpoint = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.createWebRTCEndpoint(this)];
            });
        });
    };
    MediaPipeline.prototype.release = function () {
        return this.client.releaseElement(this);
    };
    return MediaPipeline;
}());
exports.MediaPipeline = MediaPipeline;

},{}],11:[function(require,module,exports){
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

},{"./mediaelement":9}],12:[function(require,module,exports){
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
    WebRTCEndpoint.prototype.gatherIceCandidates = function () {
        return this.client.gatherIceCandidates(this);
    };
    WebRTCEndpoint.prototype.release = function () {
        return this.client.releaseElement(this);
    };
    return WebRTCEndpoint;
}(mediaelement_1.MediaElement));
exports.WebRTCEndpoint = WebRTCEndpoint;

},{"./mediaelement":9}],13:[function(require,module,exports){
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
        message.id = uuid();
        return message;
    };
    return MessageFactory;
}());
exports.MessageFactory = MessageFactory;

},{"./wsmessage":15,"uuid":3}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    ResponseAdapter.prototype.playPlayerEndpoint = function (response) {
        return this.operationError(response);
    };
    ResponseAdapter.prototype.processOfferWebRTCEndpoint = function (response) {
        return this.operationError(response);
    };
    ResponseAdapter.prototype.processAnswerWebRTCEndpoint = function (response) {
        return this.operationError(response);
    };
    ResponseAdapter.prototype.generateOfferWebRTCEndpoint = function (response) {
        return this.operationError(response);
    };
    ResponseAdapter.prototype.processOfferSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.processAnswerSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.generateOfferSuccess = function (response) {
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

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WSMessage = (function () {
    function WSMessage() {
        this.jsonrpc = "2.0";
    }
    return WSMessage;
}());
exports.WSMessage = WSMessage;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS = require("reconnecting-websocket");
exports.wsOpts = { constructor: WebSocket };

},{"reconnecting-websocket":2}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MiniMQ = require("minimq");
var websocket_1 = require("./websocket");
var WSChannel = (function () {
    function WSChannel(wsAddress) {
        var _this = this;
        this.messageListeners = {};
        this.eventListeners = {};
        this.queue = new MiniMQ();
        this.queue.handlerFunction = function (el, prm, resolve, reject) {
            try {
                _this.ws.send(JSON.stringify(el));
                _this.messageListeners[el.id] = { resolve: resolve, reject: reject };
            }
            catch (e) {
                reject(e);
            }
            setTimeout(function () {
                reject("timeoutError");
                delete _this.messageListeners[el.id];
            }, 10000);
        };
        this.ws = new websocket_1.WS(wsAddress, undefined, websocket_1.wsOpts);
        this.ws.onopen = function () {
            _this.queue.openQueue();
        };
        this.ws.onclose = function () {
            _this.queue.closeQueue();
        };
        this.ws.onmessage = function (result) {
            var data = JSON.parse(result.data);
            if (data.method != "onEvent" && typeof data.error === "undefined") {
                var id = data.id;
                _this.messageListeners[id]["resolve"](data);
                delete _this.messageListeners[id];
            }
            else if (typeof data.error !== "undefined") {
                var id = data.id;
                _this.messageListeners[id]["reject"](data);
                delete _this.messageListeners[id];
            }
            else {
                var index = data.params.value.object + "|" + data.params.value.type;
                for (var i in _this.eventListeners[index]) {
                    _this.eventListeners[index][i](data.params.value.data.candidate);
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
        return this.queue.addElement(data);
    };
    return WSChannel;
}());
exports.WSChannel = WSChannel;

},{"./websocket":16,"minimq":1}]},{},[8]);
