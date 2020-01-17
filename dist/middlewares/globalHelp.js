var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const help_1 = require("../ui/help");
function isGlobalHelp(ctx) {
    const { argv: { params, query } } = ctx;
    return params.length === 0 && (query.help || query.h);
}
function GlobalHelp(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isGlobalHelp(ctx)) { // handle help
            help_1.showHelp(ctx);
            ctx.emitter.emit('help', 'global');
        }
        else {
            yield next();
        }
    });
}
exports.default = GlobalHelp;
