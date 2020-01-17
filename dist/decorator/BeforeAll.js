Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("../utils/is");
function BeforeAll(middlewares) {
    return function (target, name) {
        if (!!name) {
            return;
        }
        if (is_1.isMiddlesFunction(middlewares)) {
            target.prototype['beforeAll'] = middlewares;
        }
    };
}
exports.default = BeforeAll;
