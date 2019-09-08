import { compose } from './utils/compose'
import { ContextInterface, RouteOptionInterface, RouteOptionRuleEnum, RouteConfigInterfase} from './interface/type'
import { ROUTE_OPTION_ONE_REG, ROUTE_OPTION_TWO_REG, ROUTE_OPTION_ENV_REG} from './utils/contant'
import * as is from './utils/is'
export default class Routers {
  public path: any;
  public middlewares: any;
  public handlers: {
    [key: string]: RouteConfigInterfase;
  } = {};
  constructor() {
  }
  public static parseRoute(route: string): {
    command: string;
    options: Array<RouteOptionInterface>
  }{
    function matchReg(search: string, reg, optionName: string, getRegIndex: number = 1) {
      const matchResult = search.match(reg);
      if (matchResult) {
        return {
          [optionName]: matchResult[getRegIndex],
          rule: search.match(ROUTE_OPTION_ENV_REG) ? (matchResult[1] ? RouteOptionRuleEnum.REST : RouteOptionRuleEnum.PARAM) : RouteOptionRuleEnum.QUERY,
          search: search.replace(/^[<\[]([\s\S]+)[>\]]$/,'$1')
        }
      }
      return {

      }
    }
    // let options: Array<string|RouteOptionInterface> = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g);
    let matchResult = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g) || [];
    const command = route.match(/^([\w\S]+)/)[0];
    let options:Array<RouteOptionInterface> = matchResult.map((item: string) => {
      let option = {
        rule: RouteOptionRuleEnum.NORMAL,
        required: item[0] === '<' && item[item.length - 1] === '>',
        ...matchReg(item, ROUTE_OPTION_ONE_REG, 'summary_name'),
        ...matchReg(item, ROUTE_OPTION_TWO_REG, 'name'),
        ...matchReg(item, ROUTE_OPTION_ENV_REG, 'name', 2)
      }
      return option;
    })
    return {
      command,
      options
    }
  }
  /**
   *
   *
   * @memberof Routers
   */
  private generateAutoHelp(commandConfig: RouteConfigInterfase): void {
    const { path, config: { onHelp }, options} = commandConfig;
    let usageMessage = `Usage: ${path}`;
    let optionMessage = 'Options:';
    optionMessage += generateOptionLine('-h | --help', 'output usage information')
    options.forEach(option => {
      if (option.rule === RouteOptionRuleEnum.QUERY) {
        optionMessage += generateOptionLine(option.search, 'dddd')
      }
    })
    console.log(`${usageMessage}\n${optionMessage}\n`);
    typeof onHelp === 'function' && onHelp();
    function generateOptionLine(optionStr: string, description: string): string {
      return `\n  ${optionStr}      ${description}`
    }
  }
  /**
   *
   * verify this route options
   * @param {*} ctx
   * @param {*} options
   * @memberof Routers
   */
  verifyOption(ctx: ContextInterface, comandOptions: Array<RouteOptionInterface>): {
    verify: boolean;
    message: string;
  }{
    const { argv: { params, query }} = ctx;
    const [command, ...restParams] = params;
    let verify = true, message = '';
    comandOptions.forEach((option) => {
      const { rule, name, summary_name, required, search} = option;
      switch(rule) {
        case RouteOptionRuleEnum.QUERY:
          query[name] = query[name] || query[summary_name];
          delete query[summary_name];
          if (required && query[name] === undefined) {
            message += `\noption ${search} is required`;
            verify = false;
          }
          break;
        case RouteOptionRuleEnum.PARAM:
          if (required && restParams[0] === undefined) {
            verify = false;
            message += `\nparam ${search} is required`
          }
          query[name] = restParams.shift();
          break;
        case RouteOptionRuleEnum.REST:
          query[name] = restParams;
          break;
      }
    })
    return {
      verify: verify,
      message: message
    };
  }

  /**
   * init <dir> [...otherDirs] [-q | --quiet] <-a | --action>
   * @param ctx 
   */
  match(ctx: ContextInterface): void {
    const { argv: { params, query }} = ctx;
    const firstParam = params[0];
    for(const command in this.handlers) {
      //Todo 判断route
      if (command === firstParam) {
        const { fn, options } = this.handlers[command];
        if (query.help || query.H) { //on - help
          this.generateAutoHelp(this.handlers[command]);
          break;
        }
        const { verify, message} = this.verifyOption(ctx, options);
        if (verify) {
          fn(ctx);
        } else {
          console.log(message)
        }
        break;
      }
    }
  }
  /**
   *
   * 注册
   * @memberof Routers
   */
  register(path, ...args) {
    const config = args.filter(arg => is.isObject(arg))[0] || {};
    const middlerwares = args.filter(middleware => typeof middleware === 'function');
    const fn = compose(middlerwares);
    const { command, options } = Routers.parseRoute(path);
    this.handlers[command] = {
      path,
      options,
      fn,
      config
    }
    return this;
  }
  /**
   * slowly middlerware
   * @memberof Routers
   */
  routes() {
    const _this = this;
    return async function (ctx: ContextInterface, next) {
      await next();
      ctx.routes = {
        ...ctx.routes,
        ..._this.handlers
      }
      _this.match(ctx);
    }
  }
}