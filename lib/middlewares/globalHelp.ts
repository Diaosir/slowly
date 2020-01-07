import { RouteOptionRuleEnum, IContext} from '../interface/type'
import * as Log from '../utils/log'
import { EMPTY_COMMAND_NAME } from '../utils/contant'
function isGlobalHelp(ctx: IContext) {
  const { argv: { params, query } } = ctx;
  return  params.length === 0 && (query.help || query.h)
}
export default async function GlobalHelp (ctx: IContext, next: Function) {
  await next();
  const { routes } = ctx;
  if (isGlobalHelp(ctx)) { // handle help
      let message = Log.getInfo('Commands');
      let usageMessage = Log.getInfo('Usage', `${ctx.name} <command> [options]`);
      let optionMessage = Log.getInfo('Options');
      let registerCommandNumber = 0;
      for(let routeName in routes){
        const {description, options, path} = routes[routeName];
        if (EMPTY_COMMAND_NAME === routeName) {
            options.forEach(option => {
              if (option.rule === RouteOptionRuleEnum.QUERY) {
                optionMessage += Log.generateOptionLine(option.search, option.description)
              }
            })
        } else {
          registerCommandNumber++ 
          message += Log.generateOptionLine(path, description)
        }
      }
      if(registerCommandNumber === 0) {
        message += `${ctx.name} haven't register any command`
      } 
      console.log(`${usageMessage}\n\n${message}\n\n${optionMessage}`)
      ctx.emitter.emit('help', 'global')
  } 
}