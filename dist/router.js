var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const compose_1 = require("./utils/compose");
const contant_1 = require("./utils/contant");
const is = require("./utils/is");
const option_1 = require("./core/option");
const default_1 = require("./middlewares/default");
const chalk = require('chalk');
const leven = require('leven');
const OPTION_REG = /(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g;
class Routers {
    constructor() {
        this.currentRouteName = contant_1.EMPTY_COMMAND_NAME;
        this.handlers = {};
    }
    /**
     * init <dir> [...otherDirs] [-q | --quiet] <-a | --action>
     * @param ctx
     */
    match(ctx) {
        const { argv: { params } } = ctx;
        const handler = Routers.getHandlerByParams(params, this.handlers);
        const hasRegisterCommandList = Object.keys(this.handlers).filter(item => item !== contant_1.EMPTY_COMMAND_NAME);
        if (handler) {
            handler.fn(ctx);
            ctx.emitter.emit('command', handler.name, handler);
        }
        else {
            const name = params.join(' ');
            console.log(`${ctx.name}: '${name}' is not a command, See '${ctx.name} --help'`);
            const sortCommandList = hasRegisterCommandList.filter(item => leven(item, name) <= 2).sort((a, b) => {
                return leven(a, name) - leven(b, name);
            });
            if (sortCommandList.length > 0) {
                console.log(`The most similar command is:  ${chalk.cyan(sortCommandList.join(', '))}`);
            }
        }
    }
    after(_) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     *
     * 注册
     * @memberof Routers
     */
    register(search, ...args) {
        const config = args.filter(arg => is.isObject(arg))[0] || {};
        const description = args.filter(arg => is.isString(arg))[0] || '';
        const middlerwares = args.filter(arg => typeof arg === 'function');
        const fn = compose_1.compose([].concat(default_1.default, [...middlerwares, this.after.bind(this)]));
        let commandMatchResult = search.replace(OPTION_REG, '').trim().split(/\s+/).join('__');
        const command = !!commandMatchResult && commandMatchResult !== 'index' ? commandMatchResult : contant_1.EMPTY_COMMAND_NAME;
        this.currentRouteName = command;
        if (!this.handlers[command]) {
            this.handlers[command] = {
                name: command,
                path: search,
                options: [],
                fn,
                description,
                config
            };
        }
        return this;
    }
    /**
     * slowly middlerware
     * @memberof Routers
     */
    routes() {
        const _this = this;
        return function (ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.routes = Object.assign({}, ctx.routes, _this.handlers);
                // console.log(ctx)
                // Todo 无命令输入，且没有注册option
                _this.match(ctx);
                yield next();
            });
        };
    }
    alias(alias) {
        const list = this.currentRouteName.split('__');
        list[list.length - 1] = alias;
        const name = list.join('__');
        this.handlers[name] = new Proxy(this.handlers[this.currentRouteName], {
            get(target, key) {
                if (key === 'name') {
                    return name;
                }
                return target[key];
            },
            set(target, key, value) {
                if (key === 'name') {
                    return false;
                }
                return Reflect.set(target, key, value);
            }
        });
        this.handlers[name].alias = name;
        return this;
    }
    /**
     * register action
     * @param {*} middlerwares
     * @returns
     * @memberof Routers
     */
    action(...middlerwares) {
        const fn = compose_1.compose([].concat(default_1.default, [...middlerwares, this.after.bind(this)]));
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName].fn = fn;
        }
        return this;
    }
    usage(usage) {
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName].usage = usage;
        }
        return this;
    }
    description(description) {
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName].description = description;
        }
        return this;
    }
    /**
     *
     * This method can only register one option
     * @param {string} rule the rule of option
     * @param {string} [description]
     * @param {...Array<any>} args
     * @returns
     * @memberof Routers
     */
    option(rule, description, ...args) {
        const commandHandler = this.handlers[this.currentRouteName];
        const option = new option_1.default(rule, description, ...args);
        if (commandHandler) {
            const { options } = commandHandler;
            const hasRegister = options.filter(opt => opt.name === option.name).length > 0;
            if (!hasRegister) {
                options.push(option);
            }
            this.handlers[this.currentRouteName].options = options;
            this.handlers[this.currentRouteName].path = `${commandHandler.path}`;
        }
        return this;
    }
    static getHandlerByParams(params = [], commandHandlers) {
        if (params.length > 1) {
            for (let i = params.length - 1; i >= 0; i--) {
                let name = params.slice(0, i + 1).join('__');
                if (commandHandlers[name]) {
                    return commandHandlers[name];
                }
            }
        }
        let name = params[0] || contant_1.EMPTY_COMMAND_NAME;
        if (commandHandlers[name]) {
            return commandHandlers[name];
        }
        return null;
    }
    static getAliasName() {
    }
}
exports.default = Routers;
