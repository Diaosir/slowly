"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require('glob');
const path = require('path');
const FILTER_FUNCTION = ['constructor'];
class Load {
    constructor(ctx) {
        this.dynamicLoad(ctx, 'service', glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}')));
        this.dynamicLoad(ctx, 'controller', glob.sync(path.join(ctx.cwd, '/controller/*.{js,ts}')));
        this.dynamicLoad(ctx, 'middleware', glob.sync(path.join(ctx.cwd, '/middleware/*.{js,ts}')), false);
        this.dynamicLoad(ctx, null, glob.sync(path.join(__dirname, '../plugins/**/*.{js,ts}')));
    }
    dynamicLoad(ctx, key, glob, autoInstantiation = true) {
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
        if (!!key) {
            ctx[key] = new Proxy(object, {
                get: function (target, name) {
                    if (typeof target[name] === 'string') {
                        const originalClass = Load.getOriginalClass(target[name]);
                        if (autoInstantiation) {
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
                        else {
                            return originalClass;
                        }
                    }
                    return target[name];
                }
            });
        }
        else {
            Object.keys(object).forEach(name => {
                const originalClass = Load.getOriginalClass(object[name]);
                ctx[name] = new originalClass(ctx);
            });
        }
    }
    static getOriginalClass(path) {
        return require(path).default || require(path);
    }
}
exports.default = Load;
