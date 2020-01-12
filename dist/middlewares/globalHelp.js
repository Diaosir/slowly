var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../interface/type");
const Log = require("../utils/log");
const contant_1 = require("../utils/contant");
function isGlobalHelp(ctx) {
    const { argv: { params, query } } = ctx;
    return params.length === 0 && (query.help || query.h);
}
function GlobalHelp(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield next();
        const { routes } = ctx;
        if (isGlobalHelp(ctx)) { // handle help
            let message = Log.getInfo('Commands');
            let usageMessage = Log.getInfo('Usage', `${ctx.name} <command> [options]`);
            let optionMessage = Log.getInfo('Options');
            let registerCommandNumber = 0;
            for (let routeName in routes) {
                const { description, options, path } = routes[routeName];
                if (contant_1.EMPTY_COMMAND_NAME === routeName) {
                    options.forEach(option => {
                        if (option.rule === type_1.RouteOptionRuleEnum.QUERY) {
                            optionMessage += Log.generateOptionLine(option.search, option.description);
                        }
                    });
                }
                else {
                    registerCommandNumber++;
                    message += Log.generateOptionLine(path, description);
                }
            }
            if (registerCommandNumber === 0) {
                message += `${ctx.name} haven't register any command`;
            }
            console.log(`${usageMessage}\n\n${message}\n\n${optionMessage}`);
            ctx.emitter.emit('help', 'global');
        }
    });
}
exports.default = GlobalHelp;
