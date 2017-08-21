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
                    _this.eventListeners[index][i](data.params.value);
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
