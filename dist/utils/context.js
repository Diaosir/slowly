"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Context {
    /**
     *Creates an instance of Context.
     * @param {*} app
     * @memberof Context
     */
    constructor(app) {
        this.routes = {};
        this.version = '1.0.0';
        // this.app = app;
        // this.config = app.config;
    }
}
exports.default = Context;
