"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./utils/context");
const argv_1 = require("./core/argv");
const load_1 = require("./core/load");
const compose_1 = require("./utils/compose");
const router_1 = require("./router");
const defaultMiddlewares = require("./middlewares/default");
const ora = require('ora');
// setTimeout(() => {
//     spinner.color = 'yellow';
//     spinner.text = 'Loading rainbows';
// }, 1000);
const router = new router_1.default();
class App {
    constructor(option) {
        this.name = '';
        this.middlewares = [];
        // this.argv = require('yargs')
        // .usage('Usage: $0 -w [num] -h [num]')
        // .demandOption(['w','h'])
        // .argv;
        const spinner = ora('slowly start').start();
        if (option.es6) {
            require('babel-register')({
                plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
            });
        }
        this.option = option;
        this.argv = new argv_1.default();
        this.cwd = process.cwd();
        //Todo
        this.config = {};
        this.ctx = this.createContext();
        this.baseLoad = new load_1.default(this.ctx);
        Object.keys(defaultMiddlewares).forEach(name => {
            this.use(defaultMiddlewares[name]);
        });
        this.use(router.routes());
        setTimeout(() => {
            this.callback();
            spinner.stop();
        }, 10);
    }
    use(fn) {
        if (typeof fn !== 'function') {
            throw new TypeError('middleware must be a function!');
        }
        this.middlewares.push(fn);
        return this;
    }
    createContext() {
        const ctx = new context_1.default();
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
}
exports.default = App;
