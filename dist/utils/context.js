Object.defineProperty(exports, "__esModule", { value: true });
const eventHandler_1 = require("../utils/eventHandler");
const is = require("../utils/is");
class Context {
    /**
     *Creates an instance of Context.
     * @param {*} app
     * @memberof Context
     */
    constructor() {
        this.routes = {};
        this.version = '1.0.0';
        this.emitter = new eventHandler_1.default();
        this.middleware = {};
        // this.app = app;
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
}
exports.default = Context;
