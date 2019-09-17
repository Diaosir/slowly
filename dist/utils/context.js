Object.defineProperty(exports, "__esModule", { value: true });
const eventHandler_1 = require("../utils/eventHandler");
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
}
exports.default = Context;
