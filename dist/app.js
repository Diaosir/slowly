var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./utils/context");
const argv_1 = require("./core/argv");
const load_1 = require("./core/load");
const compose_1 = require("./utils/compose");
const router_1 = require("./router");
const default_1 = require("./middlewares/default");
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
        Object.keys(default_1.default).forEach((name) => {
            this.use(default_1.default[name]);
        });
        //default options
        this.router.register('', '', () => __awaiter(this, void 0, void 0, function* () { })).option('[-V | --version]', 'output version')
            .option('[-h | --help]', 'output usage information');
        setTimeout(() => {
            this.callback();
        }, 10);
    }
    start() {
        if (Object.keys(this.router.handlers).length > 0) {
            this.use(this.router.routes());
        }
    }
    use(fn) {
        if (typeof fn !== 'function') {
            throw new TypeError('middleware must be a function!');
        }
        this.middlewares.push(fn);
        return this;
    }
    createContext() {
        const ctx = new context_1.default(this);
        ctx.argv = this.argv;
        ctx.config = this.config;
        ctx.cwd = this.cwd;
        ctx.version = this.option.version || '1.0.0';
        ctx.name = this.option.name;
        return ctx;
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
