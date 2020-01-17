var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contant_1 = require("../utils/contant");
const Log = require("../utils/log");
const router_1 = require("../router");
const argv_1 = require("../core/argv");
const help_1 = require("../ui/help");
const is = require("../utils/is");
/**
 *
 * find Illegality Route Option
 * @param {Object} [query]
 * @param {Array<Option>} [comandOptions]
 * @returns {Array<string>}
 */
function getIllegalityRouteOption(ctx, comandOptions) {
    let { argv: { query, originalArgv } } = ctx;
    let illegalityRouteOptions = [];
    Object.keys(query).forEach(queryName => {
        let targetOption = comandOptions.filter(option => {
            return [option.long, option.short].indexOf(queryName) > -1;
        });
        targetOption.length === 0 && illegalityRouteOptions.push(`'${argv_1.default.getOriginalOptionNameByQueryName(originalArgv, queryName)}'`);
    });
    return illegalityRouteOptions;
}
function verifyOption(ctx, comandOptions, commandName) {
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
        const { name, short, required, search, defaultValue, transform, long, isCollect, isArgument } = option;
        if (isArgument && isCollect) {
            if (required && restParams[0] === undefined) {
                verify = false;
                message += `\nArgument ${search} is required`;
            }
            query[name] = restParams;
        }
        if (isArgument && !isCollect) {
            if (required && restParams[0] === undefined) {
                verify = false;
                message += `\nArgument ${search} is required`;
            }
            query[name] = restParams.shift();
        }
        if (!isArgument) {
            const longValue = query[long], shortValue = query[short];
            delete query[short];
            delete query[long];
            query[name] = longValue || shortValue || defaultValue;
            if (required && query[name] === undefined) {
                message += `\nOption ${search} is required`;
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
        }
    });
    return {
        verify: verify,
        message: message
    };
}
function ValidateOption(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { argv: { params, query }, routes } = ctx;
        const handler = router_1.default.getHandlerByParams(params, routes);
        const { options } = handler;
        if (query.help || query.h) {
            if (handler.name !== contant_1.EMPTY_COMMAND_NAME) {
                help_1.showCommandHelp(handler);
                ctx.emitter.emit('command:help', handler.name);
            }
            return;
        }
        const { verify, message } = verifyOption(ctx, options, handler.name);
        if (verify) {
            yield next();
        }
        else {
            ctx.emitter.emit('verifyOption:fail', handler.name, options);
            Log.error(message);
        }
        yield next();
    });
}
exports.default = ValidateOption;
