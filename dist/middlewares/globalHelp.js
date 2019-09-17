Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../interface/type");
const Log = require("../utils/log");
const contant_1 = require("../utils/contant");
function isGlobalHelp(ctx) {
    const { argv: { params, query } } = ctx;
    return params.length === 0 && (query.help || query.h);
}
async function GlobalHelp(ctx, next) {
    await next();
    const { routes } = ctx;
    if (isGlobalHelp(ctx)) { // handle help
        let message = Log.getInfo('Commands');
        let usageMessage = Log.getInfo('Usage', `${ctx.name} <command> [options]`);
        let optionMessage = Log.getInfo('Options');
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
                message += Log.generateOptionLine(path, description);
            }
        }
        console.log(`${usageMessage}\n\n${message}\n\n${optionMessage}`);
        ctx.emitter.emit('help', 'global');
    }
}
exports.default = GlobalHelp;
