"use strict";
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
const argv_1 = require("./core/argv");
/**
 *
 * find Illegality Route Option
 * @param {Object} [query]
 * @param {Array<RouteOptionInterface>} [comandOptions]
 * @returns {Array<string>}
 */
function getIllegalityRouteOption(ctx, comandOptions) {
    let { argv: { query, originalArgv }, argv } = ctx;
    let illegalityRouteOptions = [];
    Object.keys(query).forEach(queryName => {
        let targetOption = comandOptions.filter(option => {
            return [option.name, option.summary_name].includes(queryName);
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
                    rule: search.match(contant_1.ROUTE_OPTION_ENV_REG) ? (matchResult[1] ? type_1.RouteOptionRuleEnum.REST : type_1.RouteOptionRuleEnum.PARAM) : type_1.RouteOptionRuleEnum.QUERY,
                    // search: search.replace(/^[<\[]([\s\S]+)[>\]]$/,'$1')
                    search
                };
            }
            return {};
        }
        // let options: Array<string|RouteOptionInterface> = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g);
        let optionMatchResult = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g) || [];
        let commandMatchResult = route.match(/^(\w+)/) || [];
        const command = commandMatchResult[0] || contant_1.EMPTY_COMMAND_NAME;
        let options = optionMatchResult.map((item) => {
            let option = Object.assign({ rule: type_1.RouteOptionRuleEnum.NORMAL, required: item[0] === '<' && item[item.length - 1] === '>' }, matchReg(item, contant_1.ROUTE_OPTION_ONE_REG, 'summary_name'), matchReg(item, contant_1.ROUTE_OPTION_TWO_REG, 'name'), matchReg(item, contant_1.ROUTE_OPTION_ENV_REG, 'name', 2), { description: config.description });
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
        let usageMessage = Log.getInfo('Usage', usage || path);
        let descriptionMessage = Log.getInfo('Description', description);
        let optionMessage = Log.getInfo('Options', '');
        optionMessage += Log.generateOptionLine('-h | --help', 'output usage information');
        options.forEach(option => {
            if (option.rule === type_1.RouteOptionRuleEnum.QUERY) {
                optionMessage += Log.generateOptionLine(option.search, option.description);
            }
        });
        console.log(`${usageMessage}\n\n${descriptionMessage}\n\n${optionMessage}\n\n`);
        typeof onHelp === 'function' && onHelp();
    }
    /**
     *
     * verify this route options
     * @param {*} ctx
     * @param {*} options
     * @memberof Routers
     */
    verifyOption(ctx, comandOptions) {
        const { argv: { params, query } } = ctx;
        const [command, ...restParams] = params;
        let verify = true, message = '';
        const illegalityRouteOptions = getIllegalityRouteOption(ctx, comandOptions);
        if (illegalityRouteOptions.length > 0) {
            verify = false;
            message = `illegality option ${illegalityRouteOptions.join('、')}`;
            ctx.emitter.emit('illegality:option', command, illegalityRouteOptions);
        }
        else {
            comandOptions.forEach((option) => {
                const { rule, name, summary_name, required, search } = option;
                switch (rule) {
                    case type_1.RouteOptionRuleEnum.QUERY:
                        query[name] = query[name] || query[summary_name];
                        delete query[summary_name];
                        if (required && query[name] === undefined) {
                            message += `\noption ${search} is required`;
                            verify = false;
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
                        query[name] = restParams;
                        break;
                }
            });
        }
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
        const { argv: { params, query } } = ctx;
        const command = params[0] || contant_1.EMPTY_COMMAND_NAME;
        const _this = this;
        const handler = Routers.getHandlerByCommandName(command, this.handlers);
        if (handler) {
            const { fn, options } = handler;
            if (query.help || query.h) { //on - help
                if (command !== contant_1.EMPTY_COMMAND_NAME) {
                    this.generateAutoHelp(handler);
                    ctx.emitter.emit('command:help', command);
                }
                return;
            }
            const { verify, message } = this.verifyOption(ctx, options);
            if (verify) {
                fn(ctx);
            }
            else {
                if (!verify) {
                    ctx.emitter.emit('verifyOption:fail', command, options);
                }
                Log.error(message);
            }
        }
    }
    /**
     *
     * 注册
     * @memberof Routers
     */
    register(path, ...args) {
        const config = args.filter(arg => is.isObject(arg))[0] || {};
        const description = args.filter(arg => is.isString(arg))[0] || '';
        const middlerwares = args.filter(middleware => typeof middleware === 'function');
        const fn = compose_1.compose(middlerwares);
        const { command, options } = Routers.parseRoute(path, config);
        this.currentRouteName = command;
        this.handlers[command] = {
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
    alias(aliasName) {
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName] = Object.assign({}, this.handlers[this.currentRouteName], { alias: aliasName });
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
        const fn = compose_1.compose(middlerwares);
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName] = Object.assign({}, this.handlers[this.currentRouteName], { fn: fn });
        }
        return this;
    }
    usage(description) {
        if (this.handlers[this.currentRouteName]) {
            this.handlers[this.currentRouteName] = Object.assign({}, this.handlers[this.currentRouteName], { usage: description });
        }
        return this;
    }
    option(name, description, handler) {
        const commandHndler = this.handlers[this.currentRouteName];
        if (commandHndler) {
            const { options } = commandHndler;
            const { options: newOptions } = Routers.parseRoute(name, { description });
            this.handlers[this.currentRouteName] = Object.assign({}, commandHndler, { options: options.concat(newOptions) });
        }
        return this;
    }
    static getHandlerByCommandName(commandName, commandHandlers) {
        if (commandHandlers[commandName]) {
            return commandHandlers[commandName];
        }
        for (let key in commandHandlers) {
            if (commandHandlers[key].alias === commandName) {
                return commandHandlers[key];
            }
        }
        return null;
    }
}
exports.default = Routers;
