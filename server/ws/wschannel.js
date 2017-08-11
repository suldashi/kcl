"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_1 = require("./websocket");
var WSChannel = (function () {
    function WSChannel(wsAddress) {
        this.wsUrl = "192.168.56.101:8888";
        this.ws = new websocket_1.WS(wsAddress, undefined, websocket_1.wsOpts);
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
