Object.defineProperty(exports, "__esModule", { value: true });
const merge_json_1 = require("./merge-json");
const is_1 = require("../utils/is");
function After(middlewares) {
    return function (target, functionName) {
        if (!functionName) {
            return;
        }
        if (is_1.isMiddlesFunction(middlewares)) {
            target['commands'] = merge_json_1.mergeJSON(target['commands'] || {}, {
                [functionName]: {
                    after: middlewares
                }
            });
        }
    };
}
exports.default = After;
