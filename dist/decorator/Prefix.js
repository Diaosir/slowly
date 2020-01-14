Object.defineProperty(exports, "__esModule", { value: true });
function Prefix(prefix) {
    return function (target, name) {
        if (!!name) {
            return;
        }
        target.prototype['commandPrefix'] = prefix;
    };
}
exports.default = Prefix;
