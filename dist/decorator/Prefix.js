Object.defineProperty(exports, "__esModule", { value: true });
function Prefix(prefix) {
    return function (target, name) {
        if (!!name) {
            if (!target.prototype.functionPrefixs) {
                target.prototype.functionPrefixs = {};
            }
            target.prototype.functionPrefixs[name] = prefix;
        }
        target.prototype.classPrefixs = prefix;
    };
}
exports.default = Prefix;
