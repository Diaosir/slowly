export declare const ROUTE_OPTION_ONE_REG: RegExp;
export declare const ROUTE_OPTION_TWO_REG: RegExp;
export default class Option {
    description: string;
    name: string;
    required: boolean;
    shortNames: Map<string, string>;
    longNames: Map<string, string>;
    type: string;
    search: string;
    defaultValue: any;
    transform: Function;
    validate: Function;
    isArgument: boolean;
    short: string;
    long: string;
    isCollect: boolean;
    constructor(search: string, description: string, ...args: Array<any>);
    private _parse;
    private _matchReg;
    private _isArgument;
    getShortName(): string;
    getLongName(): string;
}
