var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Log = require("../utils/log");
const globalHelp_1 = require("./globalHelp");
const validateOption_1 = require("./validateOption");
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
    globalHelp_1.default,
    validateOption_1.default
];
