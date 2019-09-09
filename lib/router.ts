import { compose } from './utils/compose'
import { ContextInterface, RouteOptionInterface, RouteOptionRuleEnum, RouteConfigInterfase} from './interface/type'
import { ROUTE_OPTION_ONE_REG, ROUTE_OPTION_TWO_REG, ROUTE_OPTION_ENV_REG, EMPTY_COMMAND_NAME} from './utils/contant'
import * as is from './utils/is'
import { generateOptionLine } from './utils/log'
/**
 *
 * find Illegality Route Option
 * @param {Object} [query]
 * @param {Array<RouteOptionInterface>} [comandOptions]
 * @returns {Array<string>}
 */
function getIllegalityRouteOption(query?: Object, comandOptions?: Array<RouteOptionInterface>): Array<string> {
  let illegalityRouteOptions = []
  Object.keys(query).forEach(queryName => {
    let targetOption = comandOptions.filter(option => {
      return [option.name, option.summary_name].includes(queryName)
    })
    targetOption.length === 0 && illegalityRouteOptions.push(queryName)
  })
  return illegalityRouteOptions
}

export default class Routers {
  public path: any;
  public middlewares: any;
  public handlers: {
    [key: string]: RouteConfigInterfase;
  } = {};
  constructor() {
  }
  public static parseRoute(route: string, config: { [key: string]: any}): {
    command: string;
    options: Array<RouteOptionInterface>
  }{
    function getOptionDescription(optionName: string): string {
      const { optionConfig } = config;
      return optionConfig[optionName] || ''
    }
    function matchReg(search: string, reg, optionName: string, getRegIndex: number = 1) {
      const matchResult = search.match(reg);
      if (matchResult) {
        return {
          [optionName]: matchResult[getRegIndex],
          rule: search.match(ROUTE_OPTION_ENV_REG) ? (matchResult[1] ? RouteOptionRuleEnum.REST : RouteOptionRuleEnum.PARAM) : RouteOptionRuleEnum.QUERY,
          // search: search.replace(/^[<\[]([\s\S]+)[>\]]$/,'$1')
          search
        }
      }
      return {

      }
    }
    // let options: Array<string|RouteOptionInterface> = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g);
    let optionMatchResult = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g) || [];
    
    let commandMatchResult = route.match(/^(\w+)/) || []
    const command = commandMatchResult[0] || EMPTY_COMMAND_NAME;
    let options:Array<RouteOptionInterface> = optionMatchResult.map((item: string) => {
      let option: RouteOptionInterface = {
        rule: RouteOptionRuleEnum.NORMAL,
        required: item[0] === '<' && item[item.length - 1] === '>',
        ...matchReg(item, ROUTE_OPTION_ONE_REG, 'summary_name'),
        ...matchReg(item, ROUTE_OPTION_TWO_REG, 'name'),
        ...matchReg(item, ROUTE_OPTION_ENV_REG, 'name', 2)
      }
      option.description = getOptionDescription(option.name);
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
        optionMessage += generateOptionLine(option.search, option.description)
      }
    })
    console.log(`${usageMessage}\n\n${optionMessage}\n\n`);
    typeof onHelp === 'function' && onHelp();
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
    const illegalityRouteOptions = getIllegalityRouteOption(query, comandOptions);
    if (illegalityRouteOptions.length > 0) {
      verify = false;
      message = `error: illegality option ${illegalityRouteOptions.join(` | `)}`
      ctx.emitter.emit('illegality:option', illegalityRouteOptions)
    } else {
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
    }

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
    const command = params[0] || EMPTY_COMMAND_NAME;
    if (this.handlers[command]) {
      const { fn, options } = this.handlers[command];
        if ((query.help || query.h) &&  command !== EMPTY_COMMAND_NAME) { //on - help
          this.generateAutoHelp(this.handlers[command]);
          ctx.emitter.emit('help', command);
          return;
        }
        const { verify, message} = this.verifyOption(ctx, options);
        if (verify) {
          fn(ctx);
        } else {
          if (!verify) {
            ctx.emitter.emit('verifyOptionFailed', command, options)
          }
          console.log(message)
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
    const { command, options } = Routers.parseRoute(path, config);
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