import { syntaxError } from '../utils/log'
import * as is from '../utils/is'
export const ROUTE_OPTION_ONE_REG = /-(\w+)/
export const ROUTE_OPTION_TWO_REG = /--(\w+)/

const REQUIRED_OPTION = /^<(\w+)(\.\.\.)?>$/
const OPTIONAL_OPTION = /^\[(\w+)(\.\.\.)?\]$/

export default class Option {
  public description: string;
  public name: string;
  public required: boolean;
  public shortNames: Map<string, string> = new Map();
  public longNames: Map<string, string> = new Map();
  public type: string;
  public search: string;
  public defaultValue: any;
  public transform: Function;
  public validate: Function;
  public isArgument: boolean = false;
  public short: string;
  public long: string;
  public isCollect: boolean = false;
  constructor(search: string, description: string, ...args: Array<any>) {
    const defaultValue = args.filter((arg) => !is.isFunction(arg))[0];
    const transform = args.filter((arg) => is.isFunction(arg))[0];
    this.search = search;
    this.description = description;
    const parseData = this._parse();
    this.longNames = parseData.longNames
    this.shortNames = parseData.shortNames;
    this.required = parseData.required;
    this.defaultValue = defaultValue;
    this.transform = transform;
    this.isArgument = this._isArgument();
    this.short = this.getShortName();
    this.long = this.getLongName()
    this.isCollect = parseData.isCollect
    this.name = this.long || this.short || parseData.name;
  }
  private _parse() {
    let result: any = {
      shortNames: new Map(),
      longNames: new Map(),
      isArgument: false
    };
    this.search.split(/[\s\t,]+/).forEach((value) => {
      if(ROUTE_OPTION_TWO_REG.test(value)) {
        result.longNames.set(this._matchReg(value, ROUTE_OPTION_TWO_REG), value)
      } else if(ROUTE_OPTION_ONE_REG.test(value)) {
        result.shortNames.set(this._matchReg(value, ROUTE_OPTION_ONE_REG), value)
      } else if(REQUIRED_OPTION.test(value)) {
        result.required = true;
        result.name = this._matchReg(value, REQUIRED_OPTION)
        result.isCollect = value.substr(-4, 3) === '...';
      } else if(OPTIONAL_OPTION.test(value)) {
        result.required = false;
        result.name = this._matchReg(value, OPTIONAL_OPTION);
        result.isCollect = value.substr(-4, 3) === '...';
      } else {
        syntaxError(this.search)
      }
    })
    return result;
  }
  private _matchReg(search: string, reg: RegExp, getRegIndex: number = 1) {
    const matchResult = search.match(reg);
    if (matchResult) {
      return matchResult[getRegIndex]
    }
    return ''
  }
  private _isArgument() {
    return !!this.search.trim().match(/^[\[|<](.*?)[\]|>]$/)
  }
  public getShortName() {
    const shortNames = Array.from(this.shortNames.keys());
    return shortNames[0]
  }
  public getLongName() {
    const longNames = Array.from(this.longNames.keys());
    return longNames[0]
  }
}