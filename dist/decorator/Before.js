Object.defineProperty(exports, "__esModule", { value: true });
const merge_json_1 = require("./merge-json");
const is_1 = require("../utils/is");
function Before(middlewares) {
    return function (target, functionName) {
        if (!functionName) {
            return;
        }
        if (!Array.isArray(middlewares))
            throw new TypeError('before middleware stack must be an array!');
        for (const fn of middlewares) {
            if (typeof fn !== 'function')
                throw new TypeError('before middleware must be composed of functions!');
        }
        if (is_1.isMiddlesFunction(middlewares)) {
            target['commands'] = merge_json_1.mergeJSON(target['commands'] || {}, {
                [functionName]: {
                    before: middlewares
                }
            });
        }
    };
}
exports.default = Before;
