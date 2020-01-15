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
const type_1 = require("./interface/type");
const contant_1 = require("./utils/contant");
const is = require("./utils/is");
const Log = require("./utils/log");
const ui_1 = require("../lib/ui");
const argv_1 = require("./core/argv");
const chalk = require('chalk');
const OPTION_REG = /(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g;
/**
 *
 * find Illegality Route Option
 * @param {Object} [query]
 * @param {Array<IRouteOption>} [comandOptions]
 * @returns {Array<string>}
 */
function getIllegalityRouteOption(ctx, comandOptions) {
    let { argv: { query, originalArgv } } = ctx;
    let illegalityRouteOptions = [];
    Object.keys(query).forEach(queryName => {
        let targetOption = comandOptions.filter(option => {
            return [option.name, option.summary_name].indexOf(queryName) > -1;
        });
        targetOption.length === 0 && illegalityRouteOptions.push(`'${argv_1.default.getOriginalOptionNameByQueryName(originalArgv, queryName)}'`);
    });
    return illegalityRouteOptions;
}
class Routers {
    constructor() {
        this.currentRouteName = '';
        this.handlers = {};
    }
    static parseRoute(route, config = {}) {
        function matchReg(search, reg, optionName, getRegIndex = 1) {
            const matchResult = search.match(reg);
            if (matchResult) {
                return {
                    [optionName]: matchResult[getRegIndex],
                    rule: search.match(contant_1.ROUTE_OPTION_REST_REG) ? (matchResult[1] ? type_1.RouteOptionRuleEnum.REST : type_1.RouteOptionRuleEnum.PARAM) : type_1.RouteOptionRuleEnum.QUERY,
                    // search: search.replace(/^[<\[]([\s\S]+)[>\]]$/,'$1')
                    search
                };
            }
            return {};
        }
        // let options: Array<string|IRouteOption> = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g);
        let optionMatchResult = route.match(OPTION_REG) || [];
        let commandMatchResult = route.replace(OPTION_REG, '').trim().split(/\s+/).join('__');
        const command = commandMatchResult || contant_1.EMPTY_COMMAND_NAME;
        let options = optionMatchResult.map((item) => {
            let option = Object.assign({ rule: type_1.RouteOptionRuleEnum.NORMAL, required: item[0] === '<' && item[item.length - 1] === '>' }, matchReg(item, contant_1.ROUTE_OPTION_ONE_REG, 'summary_name'), matchReg(item, contant_1.ROUTE_OPTION_TWO_REG, 'name'), matchReg(item, contant_1.ROUTE_OPTION_REST_REG, 'name', 2), { description: config.description });
            return option;
        });
        return {
            command,
            options
        };
    }
    /**
     *
     *
     * @memberof Routers
     */
    generateAutoHelp(commandConfig) {
        const { path, config: { onHelp }, options, usage, description } = commandConfig;
        const ui = ui_1.default({
            width: 150
        });
        ui.div({
            text: 'Usage:',
            width: 15,
        }, {
            text: `${usage || path}`
        });
        ui.div({
            text: '\nOptions:\n',
            width: 15
        });
        ui.div({
            text: '[-h | --help]',
            width: 30,
            padding: [0, 4, 0, 4]
        }, {
            text: `output usage information`
        });
        options.forEach(option => {
            if (option.rule === type_1.RouteOptionRuleEnum.QUERY) {
                ui.div({
                    text: option.search,
                    padding: [0, 4, 0, 4],
                    width: 30
                }, {
                    text: `${option.description}`,
                    width: 100
                }, {
                    text: option.required ? chalk.yellow('[required]') : '',
                    align: 'right'
                });
            }
        });
        ui.div({
            text: '\nDescription:',
            width: 15
        }, {
            text: `\n${description}`
        });
        console.log(ui.toString());
        typeof onHelp === 'function' && onHelp();
    }
    /**
     *
     * verify this route options
     * @param {*} ctx
     * @param {*} options
     * @memberof Routers
     */
    verifyOption(ctx, comandOptions, commandName) {
        const { argv: { params, query } } = ctx;
        const restParams = params.filter((param) => {
            return commandName.split('__').indexOf(param) === -1;
        });
        let verify = true, message = '';
        const illegalityRouteOptions = getIllegalityRouteOption(ctx, comandOptions);
        if (illegalityRouteOptions.length > 0) {
            verify = false;
            message = `illegality option ${illegalityRouteOptions.join('、')}`;
            ctx.emitter.emit('illegality:option', commandName, illegalityRouteOptions);
            return {
                verify,
                message
            };
        }
        comandOptions.forEach((option) => {
            const { rule, name, summary_name, required, search, defaultValue, transform } = option;
            switch (rule) {
                case type_1.RouteOptionRuleEnum.QUERY:
                    query[name] = query[name] || query[summary_name] || defaultValue;
                    delete query[summary_name];
                    if (required && query[name] === undefined) {
                        message += `\noption ${search} is required`;
                        verify = false;
                    }
                    else if (is.isFunction(transform)) {
                        try {
                            query[name] = transform(query[name]);
                        }
                        catch (err) {
                            Log.warning(err);
                        }
                    }
                    break;
                case type_1.RouteOptionRuleEnum.PARAM:
                    if (required && restParams[0] === undefined) {
                        verify = false;
                        message += `\nparam ${search} is required`;
                    }
                    query[name] = restParams.shift();
                    break;
                case type_1.RouteOptionRuleEnum.REST:
                    if (required && restParams[0] === undefined) {
                        verify = false;
                        message += `\nparam ${search} is required`;
                    }
                    query[name] = restParams;
                    break;
            }
        });
        return {
            verify: verify,
            message: message
        };
    }
    /**
     * init <dir> [...otherDirs] [-q | --quiet] <-a | --action>
     * @param ctx
     */
    match(ctx) {
        const { argv: { params } } = ctx;
        const handler = Routers.getHandlerByParams(params, this.handlers);
        if (handler) {
            handler.fn(ctx);
            ctx.emitter.emit('command', handler.name, handler);
        }
    }
    before(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { argv: { params, query } } = ctx;
            const handler = Routers.getHandlerByParams(params, this.handlers);
            const { options } = handler;
            if (query.help || query.h) {
                if (handler.name !== contant_1.EMPTY_COMMAND_NAME) {
                    this.generateAutoHelp(handler);
                    ctx.emitter.emit('command:help', handler.name);
                }
                return;
            }
            const { verify, message } = this.verifyOption(ctx, options, handler.name);
            if (verify) {
                yield next();
            }
            else {
                ctx.emitter.emit('verifyOption:fail', handler.name, options);
                Log.error(message);
            }
        });
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
    register(path, ...args) {
        const config = args.filter(arg => is.isObject(arg))[0] || {};
        const description = args.filter(arg => is.isString(arg))[0] || '';
        const middlerwares = args.filter(arg => typeof arg === 'function');
        const fn = compose_1.compose([this.before.bind(this), ...middlerwares, this.after.bind(this)]);
        const { command, options } = Routers.parseRoute(path, config);
        this.currentRouteName = command;
        // Json.render(options)
        this.handlers[command] = {
            name: command,
            path,
            options,
            fn,
            description,
            config
        };
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
                yield next();
                ctx.routes = Object.assign({}, ctx.routes, _this.handlers);
                // console.log(ctx)
                // Todo 无命令输入，且没有注册option
                _this.match(ctx);
            });
        };
    }
    alias(alias) {
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName] = Object.assign({}, this.handlers[this.currentRouteName], { alias: alias });
        }
        return this;
    }
    /**
     * register action
     * @param {*} middlerwares
     * @returns
     * @memberof Routers
     */
    action(...middlerwares) {
        const fn = compose_1.compose([this.before.bind(this), ...middlerwares, this.after.bind(this)]);
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName] = Object.assign({}, this.handlers[this.currentRouteName], { fn: fn });
        }
        return this;
    }
    usage(usage) {
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName] = Object.assign({}, this.handlers[this.currentRouteName], { usage: usage });
        }
        return this;
    }
    description(description) {
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName] = Object.assign({}, this.handlers[this.currentRouteName], { description: description });
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
        const defaultValue = args.filter((arg) => !is.isFunction(arg))[0];
        const transform = args.filter((arg) => is.isFunction(arg))[0];
        const commandHandler = this.handlers[this.currentRouteName];
        if (commandHandler) {
            const { options } = commandHandler;
            const { options: newOptions } = Routers.parseRoute(rule, { description });
            const option = Object.assign({}, newOptions[0], { defaultValue,
                transform });
            options.push(option);
            const path = `${commandHandler.path} ${newOptions.map(item => item.search).join(' ')}`;
            this.handlers[this.currentRouteName] = Object.assign({}, commandHandler, { options,
                path });
        }
        return this;
    }
    static getHandlerByParams(params = [], commandHandlers) {
        for (let i = params.length - 1; i >= 0; i--) {
            let name = params.slice(0, i + 1).join('__');
            if (commandHandlers[name]) {
                return commandHandlers[name];
            }
        }
        let name = params[0] || contant_1.EMPTY_COMMAND_NAME;
        if (commandHandlers[name]) {
            return commandHandlers[name];
        }
        for (let key in commandHandlers) {
            if (commandHandlers[key].alias === name) {
                return commandHandlers[key];
            }
        }
        return null;
    }
}
exports.default = Routers;
