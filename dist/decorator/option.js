Object.defineProperty(exports, "__esModule", { value: true });
const merge_json_1 = require("./merge-json");
function Option(...args) {
    return function (target, functionName) {
        const [name] = args;
        if (!name) {
            return;
        }
        if (!functionName) {
            const options = [args];
            target.prototype['optionAll'] = merge_json_1.mergeJSON(target.prototype['optionAll'] || [], options);
        }
        else {
            const data = {
                [functionName]: {
                    options: [args]
                }
            };
            target['commands'] = merge_json_1.mergeJSON(target['commands'] || {}, data);
        }
    };
}
exports.default = Option;
