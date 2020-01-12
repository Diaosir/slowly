Object.defineProperty(exports, "__esModule", { value: true });
const merge_json_1 = require("./merge-json");
function Option(...args) {
    return function (target, functionName) {
        const [name] = args;
        if (!name) {
            return;
        }
        const data = {
            [functionName]: {
                options: [args]
            }
        };
        target.__proto__['commands'] = merge_json_1.mergeJSON(target.__proto__['commands'] || {}, data);
    };
}
exports.default = Option;
