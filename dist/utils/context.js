Object.defineProperty(exports, "__esModule", { value: true });
const eventHandler_1 = require("../utils/eventHandler");
const is = require("../utils/is");
class Context {
    /**
     *Creates an instance of Context.
     * @param {*} app
     * @memberof Context
     */
    constructor(app) {
        this.routes = {};
        this.emitter = new eventHandler_1.default();
        this.middleware = {};
        this.app = app;
        // this.config = app.config;
    }
    get query() {
        return this.argv.query;
    }
    set query(query) {
        if (is.isObject(query)) {
            this.argv.query = query;
        }
    }
    get params() {
        return this.argv.params;
    }
    get curl() {
        return this.app.curl;
    }
    set config(config) {
        if (is.isObject(config)) {
            this.app.config = config;
        }
    }
    get config() {
        return this.app.config;
    }
    get version() {
        return this.app.option ? this.app.option.version : '1.0.0';
    }
    get name() {
        return this.app.option ? this.app.option.name : '';
    }
    get cwd() {
        return this.app.cwd;
    }
    set cwd(cwd) {
        this.app.cwd = cwd;
    }
    get argv() {
        return this.app.argv;
    }
}
exports.default = Context;
