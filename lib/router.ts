import { compose } from './utils/compose'
import { IContext, IRouteOption, RouteOptionRuleEnum, IRouteConfig} from './interface/type'
import { ROUTE_OPTION_ONE_REG, ROUTE_OPTION_TWO_REG, ROUTE_OPTION_REST_REG, EMPTY_COMMAND_NAME} from './utils/contant'
import * as is from './utils/is'
import * as Log from './utils/log'
import Argv from './core/argv'
/**
 *
 * find Illegality Route Option
 * @param {Object} [query]
 * @param {Array<IRouteOption>} [comandOptions]
 * @returns {Array<string>}
 */
function getIllegalityRouteOption(ctx: IContext, comandOptions?: Array<IRouteOption>): Array<string> {
  let { argv: { query, originalArgv} } = ctx;
  let illegalityRouteOptions: string[] = [];
  Object.keys(query).forEach(queryName => {
    let targetOption = comandOptions.filter(option => {
      return [option.name, option.summary_name].indexOf(queryName) > -1
    })
    targetOption.length === 0 && illegalityRouteOptions.push(`'${Argv.getOriginalOptionNameByQueryName(originalArgv, queryName)}'`)
  })
  return illegalityRouteOptions
}
export default class Routers {
  public path: any;
  public middlewares: any;
  public currentRouteName?: string = '';
  public handlers: {
    [key: string]: IRouteConfig;
  } = {};
  constructor() {
  }
  public static parseRoute(route: string, config: { [key: string]: any} = {}): {
    command: string;
    options: Array<IRouteOption>
  }{
    function matchReg(search: string, reg: RegExp, optionName: string, getRegIndex: number = 1) {
      const matchResult = search.match(reg);
      if (matchResult) {
        return {
          [optionName]: matchResult[getRegIndex],
          rule: search.match(ROUTE_OPTION_REST_REG) ? (matchResult[1] ? RouteOptionRuleEnum.REST : RouteOptionRuleEnum.PARAM) : RouteOptionRuleEnum.QUERY,
          // search: search.replace(/^[<\[]([\s\S]+)[>\]]$/,'$1')
          search
        }
      }
      return {

      }
    }
    // let options: Array<string|IRouteOption> = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g);
    let optionMatchResult = route.match(/(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g) || [];
    
    let commandMatchResult = route.match(/^(\w+)/) || []
    const command = commandMatchResult[0] || EMPTY_COMMAND_NAME;
    let options:Array<IRouteOption> = optionMatchResult.map((item: string) => {
      let option: IRouteOption = {
        rule: RouteOptionRuleEnum.NORMAL,
        required: item[0] === '<' && item[item.length - 1] === '>',
        ...matchReg(item, ROUTE_OPTION_ONE_REG, 'summary_name'),
        ...matchReg(item, ROUTE_OPTION_TWO_REG, 'name'),
        ...matchReg(item, ROUTE_OPTION_REST_REG, 'name', 2),
        description: config.description
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
  private generateAutoHelp(commandConfig: IRouteConfig): void {
    const { path, config: { onHelp }, options, usage, description } = commandConfig;
    let usageMessage = Log.getInfo('Usage', usage || path);
    let descriptionMessage = Log.getInfo('Description', description);
    let optionMessage = Log.getInfo('Options', '');
    optionMessage += Log.generateOptionLine('-h | --help', 'output usage information')
    options.forEach(option => {
      if (option.rule === RouteOptionRuleEnum.QUERY) {
        optionMessage += Log.generateOptionLine(option.search, option.description)
      }
    })
    console.log(`${usageMessage}\n\n${descriptionMessage}\n\n${optionMessage}\n\n`);
    typeof onHelp === 'function' && onHelp();
  }
  /**
   *
   * verify this route options
   * @param {*} ctx
   * @param {*} options
   * @memberof Routers
   */
  verifyOption(ctx: IContext, comandOptions: Array<IRouteOption>): {
    verify: boolean;
    message: string;
  }{
    const { argv: { params, query }} = ctx;
    const [command, ...restParams] = params;
    let verify = true, message = '';
    const illegalityRouteOptions = getIllegalityRouteOption(ctx, comandOptions);
    if (illegalityRouteOptions.length > 0) {
      verify = false;
      message = `illegality option ${illegalityRouteOptions.join('、')}`
      ctx.emitter.emit('illegality:option', command, illegalityRouteOptions);
      return {
        verify,
        message
      }
    } 
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
          if (required && restParams[0] === undefined) {
            verify = false;
            message += `\nparam ${search} is required`
          }
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
  match(ctx: IContext): void {
    const { argv: { params }} = ctx;
    const command = params[0] || EMPTY_COMMAND_NAME;
    const handler = Routers.getHandlerByCommandName(command, this.handlers);
    if (handler) {
      handler.fn(ctx);
      ctx.emitter.emit('command:*', handler.name, handler);
    }
  }
  async before(ctx: IContext, next: Function) {
    const { argv: { params, query }} = ctx;
    const command = params[0] || EMPTY_COMMAND_NAME;
    const handler = Routers.getHandlerByCommandName(command, this.handlers);
    const { options } = handler;
    if (query.help || query.h) {
      if (command !== EMPTY_COMMAND_NAME) {
        this.generateAutoHelp(handler);
        ctx.emitter.emit('command:help', command);
      }
      return;
    }
    const { verify, message} = this.verifyOption(ctx, options);

    if (verify) {
      await next()
    } else {
      ctx.emitter.emit('verifyOption:fail', command, options)
      Log.error(message);
    }
  }
  async after(_: IContext) {
  }
  /**
   *
   * 注册
   * @memberof Routers
   */
  register(path: string, ...args: any[]) {
    const config = args.filter(arg => is.isObject(arg))[0] || {};
    const description = args.filter(arg => is.isString(arg))[0] || ''
    const middlerwares = args.filter(arg => typeof arg === 'function');
    const fn = compose([this.before.bind(this), ...middlerwares, this.after.bind(this)]);
    const { command, options } = Routers.parseRoute(path, config);
    this.currentRouteName = command;
    // Json.render(options)
    this.handlers[command] = {
      name: command,
      path,
      options,
      fn,
      description,
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
    return async function (ctx: IContext, next: Function) {
      await next();
      ctx.routes = {
        ...ctx.routes,
        ..._this.handlers
      }
      // console.log(ctx)
      // Todo 无命令输入，且没有注册option
      _this.match(ctx);
    }
  }
  public alias(aliasName: string) {
    if (this.handlers[this.currentRouteName]) {
      this.handlers[this.currentRouteName] = {
        ...this.handlers[this.currentRouteName],
        alias: aliasName
      }
    }
    return this;
  }
  /**
   * register action
   * @param {*} middlerwares
   * @returns
   * @memberof Routers
   */
  public action(...middlerwares: Array<Function>) {
    const fn = compose([this.before.bind(this), ...middlerwares, this.after.bind(this)]);
    if (this.handlers[this.currentRouteName]) {
      this.handlers[this.currentRouteName] = {
        ...this.handlers[this.currentRouteName],
        fn: fn
      }
    }
    return this;
  }
  public usage(description: string){
    if (this.handlers[this.currentRouteName]) {
      this.handlers[this.currentRouteName] = {
        ...this.handlers[this.currentRouteName],
        usage: description
      }
    }
    return this;
  }
  public option(name: string, description?: string) {
    const commandHandler = this.handlers[this.currentRouteName]
    if (commandHandler) {
      const { options } = commandHandler;
      const { options: newOptions } = Routers.parseRoute(name, { description });
      const path = `${commandHandler.path} ${newOptions.map(item => item.search).join(' ')}`
      this.handlers[this.currentRouteName] = {
        ...commandHandler,
        options: options.concat(newOptions),
        path
      }
    }
    return this;
  }
  public static getHandlerByCommandName(commandName: string, commandHandlers: { [key: string]: IRouteConfig}) {
    if (commandHandlers[commandName]) {
      return commandHandlers[commandName]
    }
    for (let key in commandHandlers) {
      if (commandHandlers[key].alias === commandName) {
        return commandHandlers[key]
      }
    }
    return null
  }
}