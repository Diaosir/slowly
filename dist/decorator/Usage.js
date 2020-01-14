Object.defineProperty(exports, "__esModule", { value: true });
const merge_json_1 = require("./merge-json");
function Usage(usage) {
    return function (target, functionName) {
        if (!functionName) {
            target.prototype['usage'] = usage;
            return;
        }
        target['commands'] = merge_json_1.mergeJSON(target['commands'] || {}, {
            [functionName]: {
                usage
            }
        });
    };
}
exports.default = Usage;
