import { IContext } from '../interface/type'
import { EMPTY_COMMAND_NAME } from '../utils/contant'
import * as Log from '../utils/log'
import Router from '../router'
import Option from '../core/option'
import Argv from '../core/argv'
import { showCommandHelp } from '../ui/help'
import * as is from '../utils/is'
/**
 *
 * find Illegality Route Option
 * @param {Object} [query]
 * @param {Array<Option>} [comandOptions]
 * @returns {Array<string>}
 */
function getIllegalityRouteOption(ctx: IContext, comandOptions?: Array<Option>): Array<string> {
  let { argv: { query, originalArgv} } = ctx;
  let illegalityRouteOptions: string[] = [];
  Object.keys(query).forEach(queryName => {
    let targetOption = comandOptions.filter(option => {
      return [option.long, option.short].indexOf(queryName) > -1
    })
    targetOption.length === 0 && illegalityRouteOptions.push(`'${Argv.getOriginalOptionNameByQueryName(originalArgv, queryName)}'`)
  })
  return illegalityRouteOptions
}
function verifyOption(ctx: IContext, comandOptions: Array<Option>, commandName: string): {
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
    const { name, short, required, search, defaultValue, transform, long, isCollect, isArgument } = option;
    if(isArgument && isCollect) {
      if (required && restParams[0] === undefined) {
        verify = false;
        message += `\nArgument ${search} is required`
      }
      query[name] = restParams;
    }
    if(isArgument && !isCollect) {
      if (required && restParams[0] === undefined) {
        verify = false;
        message += `\nArgument ${search} is required`
      }
      query[name] = restParams.shift();
    }
    if(!isArgument){
      const longValue = query[long], shortValue = query[short];
      delete query[short];
      delete query[long];
      query[name] = longValue || shortValue || defaultValue;
      if (required && query[name] === undefined) {
        message += `\nOption ${search} is required`;
        verify = false;
      } else if(is.isFunction(transform)) {
        try{
          query[name] = transform(query[name]);
        } catch(err) {
          Log.warning(err)
        }
      }
    }
  })
  return {
    verify: verify,
    message: message
  };
}
export default async function ValidateOption(ctx: IContext, next: Function) {
  const { argv: { params, query }, routes } = ctx;
  const handler = Router.getHandlerByParams(params, routes);
  const { options } = handler;
  if (query.help || query.h) {
    if (handler.name !== EMPTY_COMMAND_NAME) {
      showCommandHelp(handler)
      ctx.emitter.emit('command:help', handler.name);
    }
    return;
  }
  const { verify, message} = verifyOption(ctx, options, handler.name);
  if (verify) {
    await next()
  } else {
    ctx.emitter.emit('verifyOption:fail', handler.name, options)
    Log.error(message);
  }
}