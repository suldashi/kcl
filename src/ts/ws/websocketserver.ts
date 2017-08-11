declare const require;
export const WS = require("reconnecting-websocket");
const Html5WebSocket = require('html5-websocket');
export const wsOpts = {constructor: Html5WebSocket}