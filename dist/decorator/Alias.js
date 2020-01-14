Object.defineProperty(exports, "__esModule", { value: true });
const merge_json_1 = require("./merge-json");
function Alias(alias) {
    return function (target, functionName) {
        if (!functionName) {
            return;
        }
        target['commands'] = merge_json_1.mergeJSON(target['commands'] || {}, {
            [functionName]: {
                alias
            }
        });
    };
}
exports.default = Alias;
