Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./utils/context");
const argv_1 = require("./core/argv");
const load_1 = require("./core/load");
const compose_1 = require("./utils/compose");
const router_1 = require("./router");
const path = require("path");
const curl_1 = require("./utils/curl");
class App {
    constructor(option) {
        this.name = '';
        this.middlewares = [];
        this.curl = curl_1.default;
        this.router = new router_1.default();
        const rootModule = this._getRootParentModule(module);
        this.option = option;
        this.argv = new argv_1.default();
        this.cwd = path.dirname(rootModule.filename);
        this.config = load_1.default.loadAllConfig(path.join(this.cwd, '/config/'), option.userConfigFile);
        this.ctx = this.createContext();
        this.baseLoad = new load_1.default(this.ctx);
        this.router.register('').option('-V, --version', 'output version')
            .option('-h, --help', 'output usage information');
    }
    start() {
        if (Object.keys(this.router.handlers).length > 0) {
            this.use(this.router.routes());
        }
        this.callback();
    }
    use(fn) {
        if (typeof fn !== 'function') {
            throw new TypeError('middleware must be a function!');
        }
        this.middlewares.push(fn);
        return this;
    }
    createContext() {
        return new context_1.default(this);
    }
    callback() {
        const fn = compose_1.compose(this.middlewares);
        fn(this.ctx);
    }
    help() {
    }
    usage() { }
    _getRootParentModule(module) {
        if (!module.parent) {
            return module;
        }
        else {
            return this._getRootParentModule(module.parent);
        }
    }
}
exports.default = App;
