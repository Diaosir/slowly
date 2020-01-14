import { compose } from './utils/compose'
import { IContext, IRouteOption, RouteOptionRuleEnum, IRouteConfig} from './interface/type'
import { ROUTE_OPTION_ONE_REG, ROUTE_OPTION_TWO_REG, ROUTE_OPTION_REST_REG, EMPTY_COMMAND_NAME} from './utils/contant'
import * as is from './utils/is'
import * as Log from './utils/log'
import Argv from './core/argv'
const OPTION_REG = /(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g;
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
    let optionMatchResult = route.match(OPTION_REG) || [];
    let commandMatchResult = route.replace(OPTION_REG, '').trim().split(/\s+/).join('__')
    const command = commandMatchResult || EMPTY_COMMAND_NAME;
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
  verifyOption(ctx: IContext, comandOptions: Array<IRouteOption>, commandName: string): {
    verify: boolean;
    message: string;
  }{
    const { argv: { params, query }} = ctx;
    const restParams = params.filter((param) => {
      return commandName.split('__').indexOf(param) === -1;
    })
    let verify = true, message = '';
    const illegalityRouteOptions = getIllegalityRouteOption(ctx, comandOptions);
    if (illegalityRouteOptions.length > 0) {
      verify = false;
      message = `illegality option ${illegalityRouteOptions.join('、')}`
      ctx.emitter.emit('illegality:option', commandName, illegalityRouteOptions);
      return {
        verify,
        message
      }
    } 
    comandOptions.forEach((option) => {
      const { rule, name, summary_name, required, search, defaultValue, transform } = option;
      switch(rule) {
        case RouteOptionRuleEnum.QUERY:
          query[name] = query[name] || query[summary_name] || defaultValue;
          delete query[summary_name];
          if (required && query[name] === undefined) {
            message += `\noption ${search} is required`;
            verify = false;
          } else if(is.isFunction(transform)) {
            try{
              query[name] = transform(query[name]);
            } catch(err) {
              Log.warning(err)
            }
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
    const handler = Routers.getHandlerByParams(params, this.handlers);
    if (handler) {
      handler.fn(ctx);
      ctx.emitter.emit('command', handler.name, handler);
    }
  }
  async before(ctx: IContext, next: Function) {
    const { argv: { params, query }} = ctx;
    const handler = Routers.getHandlerByParams(params, this.handlers);
    const { options } = handler;
    if (query.help || query.h) {
      if (handler.name !== EMPTY_COMMAND_NAME) {
        this.generateAutoHelp(handler);
        ctx.emitter.emit('command:help', handler.name);
      }
      return;
    }
    const { verify, message} = this.verifyOption(ctx, options, handler.name);
    if (verify) {
      await next()
    } else {
      ctx.emitter.emit('verifyOption:fail', handler.name, options)
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
  public alias(alias: string) {
    if (this.handlers[this.currentRouteName]) {
      this.handlers[this.currentRouteName] = {
        ...this.handlers[this.currentRouteName],
        alias: alias
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
  public usage(usage: string){
    if (this.handlers[this.currentRouteName]) {
      this.handlers[this.currentRouteName] = {
        ...this.handlers[this.currentRouteName],
        usage: usage
      }
    }
    return this;
  }
  public description(description: string){
    if (this.handlers[this.currentRouteName]) {
      this.handlers[this.currentRouteName] = {
        ...this.handlers[this.currentRouteName],
        description: description
      }
    }
    return this;
  }
  /**
   *
   * This method can only register one option
   * @param {string} rule the rule of option 
   * @param {string} [description]
   * @param {...Array<any>} args 
   * @returns
   * @memberof Routers
   */
  public option(rule: string, description?: string, ...args: Array<any>) {
    const defaultValue = args.filter((arg) => !is.isFunction(arg))[0];
    const transform = args.filter((arg) => is.isFunction(arg))[0];
    const commandHandler = this.handlers[this.currentRouteName]
    if (commandHandler) {
      const { options } = commandHandler;
      const { options: newOptions } = Routers.parseRoute(rule, { description });
      const option = {
        ...newOptions[0],
        defaultValue,
        transform
      }
      options.push(option);
      const path = `${commandHandler.path} ${newOptions.map(item => item.search).join(' ')}`;
      this.handlers[this.currentRouteName] = {
        ...commandHandler,
        options,
        path,
      }
    }
    return this;
  }
  public static getHandlerByParams(params: Array<string> = [], commandHandlers: { [key: string]: IRouteConfig}) {
    for(let i = params.length - 1; i >= 0; i--) {
      let name = params.slice(0, i + 1).join('__');
      if(commandHandlers[name]) {
        return commandHandlers[name];
      }
    }
    let name = params[0] || EMPTY_COMMAND_NAME;
    if (commandHandlers[name]) {
      return commandHandlers[name]
    }
    for (let key in commandHandlers) {
      if (commandHandlers[key].alias === name) {
        return commandHandlers[key]
      }
    }
    return null
  }
}