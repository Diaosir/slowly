"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contant_1 = require("../utils/contant");
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
        // console.log(process.execPath)
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
        const value = parsing_1.parseQueryValue(queryValue);
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
        for (let i = 0; i < effectiveArgv.length;) {
            const matchOne_ = effectiveArgv[i].match(contant_1.OPTION_ONE_REG);
            const matchTow_ = effectiveArgv[i].match(contant_1.OPTION_TWO_REG);
            if (matchOne_) {
                if (effectiveArgv[i + 1] === undefined) {
                    this.setObject(this.query, matchOne_[1], true);
                    break;
                }
                //如果下一个参数是带有'-' 或者 '--' 符合的则给上一个设置为true
                if (effectiveArgv[i + 1].match(contant_1.OPTION_ONE_REG) || effectiveArgv[i + 1].match(contant_1.OPTION_TWO_REG)) {
                    this.setObject(this.query, matchOne_[1], true);
                    i++;
                    continue;
                }
                this.setObject(this.query, matchOne_[1], effectiveArgv[i + 1]);
                i = i + 2;
                continue;
            }
            //如果为'--'时
            if (matchTow_) {
                this.setObject(this.query, matchTow_[1], matchTow_[3] === undefined ? true : matchTow_[3]);
                i++;
                continue;
            }
            this.params.push(effectiveArgv[i]);
            i++;
        }
    }
}
exports.default = Argv;
