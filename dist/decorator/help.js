Object.defineProperty(exports, "__esModule", { value: true });
const merge_json_1 = require("./merge-json");
function Help(onHelp) {
    return function (target, functionName) {
        if (!functionName) {
            // target.prototype['usage'] = usage;
            return;
        }
        target['commands'] = merge_json_1.mergeJSON(target['commands'] || {}, {
            [functionName]: {
                config: {
                    onHelp
                }
            }
        });
    };
}
exports.default = Help;
