Object.defineProperty(exports, "__esModule", { value: true });
const contant_1 = require("../utils/contant");
const Log = require("../utils/log");
const router_1 = require("../router");
const globalHelp_1 = require("./globalHelp");
const leven = require('leven');
function isGlobalVersion(ctx) {
    const { argv: { query } } = ctx;
    return query.version || query.v || query.V;
}
async function GlobalVesion(ctx, next) {
    const { version } = ctx;
    if (isGlobalVersion(ctx)) {
        console.log(version);
        return;
    }
    await next();
}
exports.GlobalVesion = GlobalVesion;
/**
 *
 *
 * @export
 * @param {*} ctx
 * @param {*} next
 */
async function GlobalCheckCommand(ctx, next) {
    await next();
    const { argv: { params }, routes } = ctx;
    const [command] = params;
    const hasRegisterCommandList = Object.keys(routes).filter(item => item !== contant_1.EMPTY_COMMAND_NAME);
    if (command !== undefined && !router_1.default.getHandlerByCommandName(command, routes)) {
        console.log(`${ctx.name}: '${command}' is not a command, See '${ctx.name} --help'`);
        const sortCommandList = hasRegisterCommandList.filter(item => leven(item, command) <= 2).sort((a, b) => {
            return leven(a, command) - leven(b, command);
        });
        if (sortCommandList.length > 0) {
            console.log(`The most similar command is:  ${sortCommandList[0]}`);
        }
    }
}
exports.GlobalCheckCommand = GlobalCheckCommand;
async function GlobEmptyArgv(ctx, next) {
    await next();
    const { argv: { query, params } } = ctx;
    const emptyOption = Object.keys(query);
    if (params.length === 0 && emptyOption.length === 0) {
        Log.warning(`there is not any command and option, See '${ctx.name} --help'`);
    }
}
exports.GlobEmptyArgv = GlobEmptyArgv;
exports.default = [
    GlobEmptyArgv,
    GlobalVesion,
    GlobalCheckCommand,
    globalHelp_1.default
];
