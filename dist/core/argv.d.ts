import { IArgv } from '../interface/type';
export default class Argv implements IArgv {
    originalArgv: Array<string>;
    params: Array<any>;
    name: string;
    execPath: string;
    query: {
        [prop: string]: any;
    };
    constructor(argv?: Array<string>);
    parseArgv(): void;
    /**
     * add a params in argv params
     * @param object
     * @param name
     * @param value
     */
    setObject(object: {
        [key: string]: any;
    }, name: string, queryValue: any): {
        [key: string]: any;
    };
    /**
     * 格式化参数
     * @memberof Argv
     */
    generateParams(): void;
    /**
     *
     * @param {*} queryName
     * @memberof Argv
     */
    static getOriginalOptionNameByQueryName(originalArgv: Array<string>, queryName: string): string;
}
