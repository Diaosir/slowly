Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../utils/log");
const is = require("../utils/is");
exports.ROUTE_OPTION_ONE_REG = /-(\w+)/;
exports.ROUTE_OPTION_TWO_REG = /--(\w+)/;
const REQUIRED_OPTION = /^<(\w+)(\.\.\.)?>$/;
const OPTIONAL_OPTION = /^\[(\w+)(\.\.\.)?\]$/;
class Option {
    constructor(search, description, ...args) {
        this.shortNames = new Map();
        this.longNames = new Map();
        this.isArgument = false;
        this.isCollect = false;
        const defaultValue = args.filter((arg) => !is.isFunction(arg))[0];
        const transform = args.filter((arg) => is.isFunction(arg))[0];
        this.search = search;
        this.description = description;
        const parseData = this._parse();
        this.longNames = parseData.longNames;
        this.shortNames = parseData.shortNames;
        this.required = parseData.required;
        this.defaultValue = defaultValue;
        this.transform = transform;
        this.isArgument = this._isArgument();
        this.short = this.getShortName();
        this.long = this.getLongName();
        this.isCollect = parseData.isCollect;
        this.name = this.long || this.short || parseData.name;
    }
    _parse() {
        let result = {
            shortNames: new Map(),
            longNames: new Map(),
            isArgument: false
        };
        this.search.split(/[\s\t,]+/).forEach((value) => {
            if (exports.ROUTE_OPTION_TWO_REG.test(value)) {
                result.longNames.set(this._matchReg(value, exports.ROUTE_OPTION_TWO_REG), value);
            }
            else if (exports.ROUTE_OPTION_ONE_REG.test(value)) {
                result.shortNames.set(this._matchReg(value, exports.ROUTE_OPTION_ONE_REG), value);
            }
            else if (REQUIRED_OPTION.test(value)) {
                result.required = true;
                result.name = this._matchReg(value, REQUIRED_OPTION);
                result.isCollect = value.substr(-4, 3) === '...';
            }
            else if (OPTIONAL_OPTION.test(value)) {
                result.required = false;
                result.name = this._matchReg(value, OPTIONAL_OPTION);
                result.isCollect = value.substr(-4, 3) === '...';
            }
            else {
                log_1.syntaxError(this.search);
            }
        });
        return result;
    }
    _matchReg(search, reg, getRegIndex = 1) {
        const matchResult = search.match(reg);
        if (matchResult) {
            return matchResult[getRegIndex];
        }
        return '';
    }
    _isArgument() {
        return !!this.search.trim().match(/^[\[|<](.*?)[\]|>]$/);
    }
    getShortName() {
        const shortNames = Array.from(this.shortNames.keys());
        return shortNames[0];
    }
    getLongName() {
        const longNames = Array.from(this.longNames.keys());
        return longNames[0];
    }
}
exports.default = Option;
