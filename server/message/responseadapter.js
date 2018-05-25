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
    ResponseAdapter.prototype.createCompositeSuccess = function (response) {
        return this.getValue(response);
    };
    ResponseAdapter.prototype.createHubPortSuccess = function (response) {
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
