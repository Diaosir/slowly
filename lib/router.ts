import { compose } from './utils/compose'
import { IContext, IRouteConfig} from './interface/type'
import { EMPTY_COMMAND_NAME } from './utils/contant'
import * as is from './utils/is'
import Option from './core/option';
import defaultMiddlewares from './middlewares/default';
const chalk = require('chalk');

const leven = require('leven');
const OPTION_REG = /(\[[:\.\w-\s\|]+\])|(<[:\.\w-\s\|]+>)/g;
export default class Routers {
  public path: any;
  public middlewares: any;
  public currentRouteName?: string = EMPTY_COMMAND_NAME;
  public handlers: {
    [key: string]: IRouteConfig;
  } = {};
  constructor() {
  }
  /**
   * init <dir> [...otherDirs] [-q | --quiet] <-a | --action>
   * @param ctx 
   */
  match(ctx: IContext): void {
    const { argv: { params }} = ctx;
    const handler = Routers.getHandlerByParams(params, this.handlers);
    const hasRegisterCommandList = Object.keys(this.handlers).filter(item => item !== EMPTY_COMMAND_NAME);
    if (handler) {
      handler.fn(ctx);
      ctx.emitter.emit('command', handler.name, handler);
    } else {
      const name = params.join(' ');
      console.log(`${ctx.name}: '${name}' is not a command, See '${ctx.name} --help'`)
      const sortCommandList = hasRegisterCommandList.filter(item => leven(item, name) <= 2 ).sort((a: string, b: string) => {
          return leven(a, name) - leven(b, name);
      })
      if (sortCommandList.length > 0) {
          console.log(`The most similar command is:  ${chalk.cyan(sortCommandList.join(', '))}`)
      }
    }
  }
  async after(_: IContext) {
  }
  /**
   *
   * 注册
   * @memberof Routers
   */
  register(search: string, ...args: any[]) {
    const config = args.filter(arg => is.isObject(arg))[0] || {};
    const description = args.filter(arg => is.isString(arg))[0] || ''
    const middlerwares = args.filter(arg => typeof arg === 'function');
    const fn = compose([].concat(defaultMiddlewares, [...middlerwares, this.after.bind(this)]));
    let commandMatchResult = search.replace(OPTION_REG, '').trim().split(/\s+/).join('__')
    
    const command = !!commandMatchResult && commandMatchResult !== 'index' ? commandMatchResult : EMPTY_COMMAND_NAME;
    this.currentRouteName = command;
    if(!this.handlers[command]) {
      this.handlers[command] = {
        name: command,
        path: search,
        options: [],
        fn,
        description,
        config
      }
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
      ctx.routes = {
        ...ctx.routes,
        ..._this.handlers
      }
      // console.log(ctx)
      // Todo 无命令输入，且没有注册option
      _this.match(ctx);
      await next();
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
    const fn = compose([].concat(defaultMiddlewares, [...middlerwares, this.after.bind(this)]));
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
    const commandHandler = this.handlers[this.currentRouteName]
    const option = new Option(rule, description, ...args);
    if (commandHandler) {
      const { options } = commandHandler;
      const hasRegister = options.filter(opt => opt.name === option.name).length > 0;
      if(!hasRegister) {
        options.push(option);
      }
      const path = `${commandHandler.path}`;
      this.handlers[this.currentRouteName] = {
        ...commandHandler,
        options,
        path,
      }
    }
    return this;
  }
  public static getHandlerByParams(params: Array<string> = [], commandHandlers: { [key: string]: IRouteConfig}) {
    if(params.length > 1) {
      for(let i = params.length - 1; i >= 0; i--) {
        let name = params.slice(0, i + 1).join('__');
        if(commandHandlers[name]) {
          return commandHandlers[name];
        }
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