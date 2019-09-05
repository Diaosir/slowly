"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Help(callback) {
    return function (target, name, descriptor) {
        target.onHelp = function () {
            callback.apply(this, null);
        };
    };
}
exports.default = Help;
