var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_json_1 = require("./merge-json");
function Before(before) {
    return function (target, functionName) {
        if (!functionName || typeof before !== 'function') {
            return;
        }
        target['commands'] = merge_json_1.mergeJSON(target['commands'] || {}, {
            [functionName]: {
                before: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
                    yield before(ctx);
                    yield next();
                })
            }
        });
    };
}
exports.default = Before;
