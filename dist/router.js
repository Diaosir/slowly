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
class Routers {
    constructor() {
        this.handlers = {};
    }
    static parseRoute(route) {
        function matchReg(search, reg, optionName, getRegIndex = 1) {
            const matchResult = search.match(reg);
            if (matchResult) {
                return {
                    [optionName]: matchResult[getRegIndex],
                    rule: search.match(contant_1.ROUTE_OPTION_ENV_REG) ? (matchResult[1] ? type_1.RouteOptionRuleEnum.REST : type_1.RouteOptionRuleEnum.PARAM) : type_1.RouteOptionRuleEnum.QUERY,
                    search: search.replace(/^[<\[]([\s\S]+)[>\]]$/, '$1')
                };
            }
            return {};
        }
        // let options: Array<string|RouteOptionInterface> = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g);
        let matchResult = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g) || [];
        const command = route.match(/^([\w\S]+)/)[0];
        let options = matchResult.map((item) => {
            let option = Object.assign({ rule: type_1.RouteOptionRuleEnum.NORMAL, required: item[0] === '<' && item[item.length - 1] === '>' }, matchReg(item, contant_1.ROUTE_OPTION_ONE_REG, 'summary_name'), matchReg(item, contant_1.ROUTE_OPTION_TWO_REG, 'name'), matchReg(item, contant_1.ROUTE_OPTION_ENV_REG, 'name', 2));
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
        optionMessage += generateOptionLine('-h | --help', 'output usage information');
        options.forEach(option => {
            if (option.rule === type_1.RouteOptionRuleEnum.QUERY) {
                optionMessage += generateOptionLine(option.search, 'dddd');
            }
        });
        console.log(`${usageMessage}\n${optionMessage}\n`);
        typeof onHelp === 'function' && onHelp();
        function generateOptionLine(optionStr, description) {
            return `\n  ${optionStr}      ${description}`;
        }
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
        const firstParam = params[0];
        for (const command in this.handlers) {
            //Todo 判断route
            if (command === firstParam) {
                const { fn, options } = this.handlers[command];
                if (query.help || query.H) { //on - help
                    this.generateAutoHelp(this.handlers[command]);
                    break;
                }
                const { verify, message } = this.verifyOption(ctx, options);
                if (verify) {
                    fn(ctx);
                }
                else {
                    console.log(message);
                }
                break;
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
        const { command, options } = Routers.parseRoute(path);
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
