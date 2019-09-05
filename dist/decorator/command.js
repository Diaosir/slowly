"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const is = require("../utils/is");
function Command(...commandOptions) {
    const [route, description, config] = commandOptions;
    const { option } = config, resetConfig = __rest(config, ["option"]);
    return function (target, name, descriptor) {
        if (!is.isFunction(descriptor.value)) {
            return;
        }
        if (!is.isObject(target.commands)) {
            target.commands = {};
        }
        target.commands[name] = {
            route,
            description,
            config: resetConfig,
            option: option,
            action: function (...actionsArgs) {
                descriptor.value.apply(this, actionsArgs);
            }
        };
    };
}
exports.default = Command;
