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
