Object.defineProperty(exports, "__esModule", { value: true });
const glob = require('glob');
const path = require('path');
const util_1 = require("util");
const FILTER_FUNCTION = ['constructor'];
class Load {
    constructor(ctx) {
        this.lazyLoadStack = [];
        this.dynamicLoad(ctx, 'service', Load._filterGlobs(glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}'))));
        this.dynamicLoad(ctx, 'controller', Load._filterGlobs(glob.sync(path.join(ctx.cwd, '/controller/*.{js,ts}'))));
        this.dynamicLoad(ctx, 'middleware', Load._filterGlobs(glob.sync(path.join(ctx.cwd, '/middleware/*.{js,ts}'))), false);
        this.dynamicLoad(ctx, null, Load._filterGlobs(glob.sync(path.join(__dirname, '../plugins/**/*.{js,ts}'))));
        this.lazyLoad();
    }
    dynamicLoad(ctx, key, glob, autoInstantiation = true) {
        const _this = this;
        let object = {};
        try {
            glob.map((filePath) => {
                const { name } = path.parse(filePath);
                object[name] = filePath;
                _this.lazyLoadStack.push({
                    name,
                    filePath,
                    objectName: key,
                    autoInstantiation
                });
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
                            const entry = new originalClass(ctx);
                            Object.getOwnPropertyNames(originalClass.prototype).forEach((prototyeName) => {
                                if (FILTER_FUNCTION.indexOf(prototyeName) === -1 && typeof originalClass.prototype[prototyeName] === 'function') {
                                    entry.__proto__[prototyeName] = entry.__proto__[prototyeName].bind(entry);
                                }
                                return;
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
    //TODO
    lazyLoad() {
        // console.log(this.lazyLoadStack)
    }
    static getOriginalClass(path) {
        return require(path).default || require(path);
    }
    static loadAllConfig(configFolder, userConfigFile) {
        const configGlob = Load._filterGlobs(glob.sync(path.join(configFolder, '*.{js,ts}')));
        if (!!userConfigFile && util_1.isString(userConfigFile)) {
            configGlob.push(userConfigFile);
        }
        let config = {};
        try {
            configGlob.forEach(filepath => {
                const fileContext = require(filepath).default || require(filepath);
                config = Object.assign({}, config, fileContext);
            });
        }
        catch (error) {
        }
        return config;
    }
    static _filterGlobs(globs) {
        return globs.filter((glob) => {
            return !glob.match(/\.d\.ts$/);
        });
    }
}
exports.default = Load;
