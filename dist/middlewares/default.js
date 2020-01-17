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
const globalHelp_1 = require("./globalHelp");
const validateOption_1 = require("./validateOption");
const leven = require('leven');
function isGlobalVersion(ctx) {
    const { argv: { query } } = ctx;
    return query.version || query.v || query.V;
}
function GlobalVesion(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { version } = ctx;
        if (isGlobalVersion(ctx)) {
            console.log(version);
            return;
        }
        else {
            yield next();
        }
    });
}
exports.GlobalVesion = GlobalVesion;
/**
 *
 *
 * @export
 * @param {*} ctx
 * @param {*} next
 */
function GlobalCheckCommand(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { argv: { params }, routes } = ctx;
        const [command] = params;
        const hasRegisterCommandList = Object.keys(routes).filter(item => item !== contant_1.EMPTY_COMMAND_NAME);
        const matchRouter = router_1.default.getHandlerByParams(params, routes);
        if (!matchRouter) {
            console.log(`${ctx.name}: '${command}' is not a command, See '${ctx.name} --help'`);
            const sortCommandList = hasRegisterCommandList.filter(item => leven(item, command) <= 2).sort((a, b) => {
                return leven(a, command) - leven(b, command);
            });
            if (sortCommandList.length > 0) {
                console.log(`The most similar command is:  ${sortCommandList[0]}`);
            }
        }
        else {
            yield next();
        }
    });
}
exports.GlobalCheckCommand = GlobalCheckCommand;
function GlobEmptyArgv(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { argv: { query, params } } = ctx;
        const emptyOption = Object.keys(query);
        if (params.length === 0 && emptyOption.length === 0) {
            Log.warning(`there is not any command and option, See '${ctx.name} --help'`);
        }
        else {
            yield next();
        }
    });
}
exports.GlobEmptyArgv = GlobEmptyArgv;
exports.default = [
    GlobEmptyArgv,
    GlobalVesion,
    GlobalCheckCommand,
    globalHelp_1.default,
    validateOption_1.default
];
