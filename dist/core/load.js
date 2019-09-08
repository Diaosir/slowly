"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require('glob');
const path = require('path');
const FILTER_FUNCTION = ['constructor'];
class Load {
    constructor(ctx) {
        this.dynamicLoad(ctx, 'service', glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}')));
        this.dynamicLoad(ctx, 'controller', glob.sync(path.join(ctx.cwd, '/controller/*.{js,ts}')));
    }
    dynamicLoad(ctx, key, glob) {
        let object = {};
        try {
            glob.map((filePath) => {
                const { name } = path.parse(filePath);
                object[name] = filePath;
            });
        }
        catch (error) {
            console.log(error);
        }
        ctx[key] = new Proxy(object, {
            get: function (target, name) {
                if (typeof target[name] === 'string') {
                    const originalClass = require(target[name]).default || require(target[name]);
                    originalClass.prototype.ctx = ctx;
                    const ownPropertyNames = Object.getOwnPropertyNames(originalClass.prototype).filter((prototyeName) => {
                        return FILTER_FUNCTION.indexOf(prototyeName) === -1 && typeof originalClass.prototype[prototyeName] === 'function';
                    });
                    const entry = new originalClass(ctx);
                    ownPropertyNames.forEach((prototyeName) => {
                        entry.__proto__[prototyeName] = entry.__proto__[prototyeName].bind(entry);
                    });
                    return entry;
                }
                return target[name];
            }
        });
    }
}
exports.default = Load;
