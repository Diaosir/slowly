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
const log_1 = require("./utils/log");
/**
 *
 * find Illegality Route Option
 * @param {Object} [query]
 * @param {Array<RouteOptionInterface>} [comandOptions]
 * @returns {Array<string>}
 */
function getIllegalityRouteOption(query, comandOptions) {
    let illegalityRouteOptions = [];
    Object.keys(query).forEach(queryName => {
        let targetOption = comandOptions.filter(option => {
            return [option.name, option.summary_name].includes(queryName);
        });
        targetOption.length === 0 && illegalityRouteOptions.push(queryName);
    });
    return illegalityRouteOptions;
}
class Routers {
    constructor() {
        this.handlers = {};
    }
    static parseRoute(route, config) {
        function getOptionDescription(optionName) {
            const { optionConfig } = config;
            return optionConfig[optionName] || '';
        }
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
            let option = Object.assign({ rule: type_1.RouteOptionRuleEnum.NORMAL, required: item[0] === '<' && item[item.length - 1] === '>' }, matchReg(item, contant_1.ROUTE_OPTION_ONE_REG, 'summary_name'), matchReg(item, contant_1.ROUTE_OPTION_TWO_REG, 'name'), matchReg(item, contant_1.ROUTE_OPTION_ENV_REG, 'name', 2));
            option.description = getOptionDescription(option.name);
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
        const { path, config: { onHelp }, options } = commandConfig;
        let usageMessage = `Usage: ${path}`;
        let optionMessage = 'Options:';
        optionMessage += log_1.generateOptionLine('-h | --help', 'output usage information');
        options.forEach(option => {
            if (option.rule === type_1.RouteOptionRuleEnum.QUERY) {
                optionMessage += log_1.generateOptionLine(option.search, option.description);
            }
        });
        console.log(`${usageMessage}\n\n${optionMessage}\n\n`);
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
        const illegalityRouteOptions = getIllegalityRouteOption(query, comandOptions);
        if (illegalityRouteOptions.length > 0) {
            verify = false;
            message = `error: illegality option ${illegalityRouteOptions.join(` | `)}`;
            ctx.emitter.emit('illegality:option', illegalityRouteOptions);
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
        if (this.handlers[command]) {
            const { fn, options } = this.handlers[command];
            if ((query.help || query.h) && command !== contant_1.EMPTY_COMMAND_NAME) { //on - help
                this.generateAutoHelp(this.handlers[command]);
                ctx.emitter.emit('help', command);
                return;
            }
            const { verify, message } = this.verifyOption(ctx, options);
            if (verify) {
                fn(ctx);
            }
            else {
                if (!verify) {
                    ctx.emitter.emit('verifyOptionFailed', command, options);
                }
                console.log(message);
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
        const middlerwares = args.filter(middleware => typeof middleware === 'function');
        const fn = compose_1.compose(middlerwares);
        const { command, options } = Routers.parseRoute(path, config);
        this.handlers[command] = {
            path,
            options,
            fn,
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
                _this.match(ctx);
            });
        };
    }
}
exports.default = Routers;
