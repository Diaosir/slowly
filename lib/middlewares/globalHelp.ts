import { RouteConfigInterfase, ContextInterface, RouteOptionRuleEnum } from '../interface/type'
import * as Log from '../utils/log'
import { EMPTY_COMMAND_NAME } from '../utils/contant'
function isGlobalHelp(ctx) {
  const { argv: { params, query }, routes } = ctx;
  return  params.length === 0 && (query.help || query.h)
}
export default async function GlobalHelp (ctx, next) {
  await next();
  const { routes } = ctx;
  if (isGlobalHelp(ctx)) { // handle help
      let message = Log.getInfo('Commands');
      let usageMessage = Log.getInfo('Usage', `${ctx.name} <command> [options]`);
      let optionMessage = Log.getInfo('Options');
      for(let routeName in routes){
          const {description, options, path} = routes[routeName];
          if (EMPTY_COMMAND_NAME === routeName) {
              options.forEach(option => {
                  if (option.rule === RouteOptionRuleEnum.QUERY) {
                    optionMessage += Log.generateOptionLine(option.search, option.description)
                  }
                })
          } else {
              message += Log.generateOptionLine(path, description)
          }
      }
      console.log(`${usageMessage}\n\n${message}\n\n${optionMessage}`)
      ctx.emitter.emit('help', 'global')
     
  } 
}