"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is = require("../utils/is");
function Option(...args) {
    return function (target, name, descriptor) {
        if (!is.isArray(target.options)) {
            target.options = [];
        }
        target.options.push(args);
    };
}
exports.default = Option;
