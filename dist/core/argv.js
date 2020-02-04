var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { OPTION_ONE_REG, OPTION_TWO_REG } from '../utils/contant'
const minimist = require('minimist');
const path = require('path');
const is = require("../utils/is");
const parsing_1 = require("../utils/parsing");
class Argv {
    constructor(argv) {
        this.originalArgv = argv || process.argv;
        this.execPath = argv ? argv[0] : process.execPath;
        this.params = [];
        this.query = {};
        this.parseArgv();
        this.generateParams();
    }
    parseArgv() {
        if (/\b(node|iojs|electron)(\.exe)?$/.test(this.originalArgv[0])) {
            this.name = this.originalArgv[1];
        }
        else {
            this.name = this.originalArgv[0];
        }
        this.name = this.name.replace(`${path.dirname(this.execPath)}/`, '');
    }
    /**
     * add a params in argv params
     * @param object
     * @param name
     * @param value
     */
    setObject(object, name, queryValue) {
        const value = parsing_1.parseQuery(queryValue);
        if (object[name] === undefined) {
            object[name] = value;
        }
        else if (is.isArray(object[name])) {
            object[name].push(value);
        }
        else {
            object[name] = [
                object[name],
                value
            ];
        }
        return object;
    }
    /**
     * 格式化参数
     * @memberof Argv
     */
    generateParams() {
        const effectiveArgv = this.originalArgv.slice(2);
        const argv = minimist(effectiveArgv);
        const _a = argv || {}, { _ } = _a, reset = __rest(_a, ["_"]);
        this.params = _;
        this.query = reset;
        // for(let i = 0; i < effectiveArgv.length; ){
        //   const matchOne_ = effectiveArgv[i].match(OPTION_ONE_REG);
        //   const matchTow_ = effectiveArgv[i].match(OPTION_TWO_REG);
        //   if (matchOne_){
        //     if (effectiveArgv[i+1] === undefined) {
        //       this.setObject(this.query, matchOne_[1], true);
        //       break;
        //     }
        //     //如果下一个参数是带有'-' 或者 '--' 符合的则给上一个设置为true
        //     if (effectiveArgv[i+1].match(OPTION_ONE_REG) || effectiveArgv[i+1].match(OPTION_TWO_REG)) {
        //       this.setObject(this.query, matchOne_[1], true);
        //       i++;
        //       continue;
        //     }
        //     this.setObject(this.query, matchOne_[1], effectiveArgv[i+1]);
        //     i = i + 2;
        //     continue;
        //   }
        //   //如果为'--'时
        //   if(matchTow_){
        //     this.setObject(this.query, matchTow_[1], matchTow_[3] === undefined ? true : matchTow_[3]);
        //     i++
        //     continue;
        //   }
        //   this.params.push(effectiveArgv[i])
        //   i++;
        // }
    }
    /**
     *
     * @param {*} queryName
     * @memberof Argv
     */
    static getOriginalOptionNameByQueryName(originalArgv, queryName) {
        const matchArgv = originalArgv.filter(argv => {
            const querys = [`-${queryName}`, `--${queryName}`];
            return querys.indexOf(argv) > -1;
        });
        return matchArgv[0] || queryName;
    }
}
exports.default = Argv;
