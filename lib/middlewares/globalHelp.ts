import { RouteOptionRuleEnum, IContext, IRouteConfig } from '../interface/type'
import { EMPTY_COMMAND_NAME} from '../utils/contant'
import UI from '../ui'
function isGlobalHelp(ctx: IContext) {
  const { argv: { params, query } } = ctx;
  return  params.length === 0 && (query.help || query.h)
}
function getCommandMessage(route: IRouteConfig) {
  const { options, name } = route;
  const hasQuery = options.filter(option => option.rule === RouteOptionRuleEnum.QUERY).length > 0;
  let message = `${name.replace('__', ' ')}`;
  let commandMessage = `${options.filter(option => option.rule !== RouteOptionRuleEnum.QUERY).reduce((preValue, curOption) => `${preValue}${curOption.search}`, '')}`
  if(commandMessage) {
    message += ` ${commandMessage}`
  }
  if(hasQuery) {
    message += ` [options]`
  }
  return message
}
export default async function GlobalHelp (ctx: IContext, next: Function) {
  await next();
  const { routes } = ctx;
  if (isGlobalHelp(ctx)) { // handle help
    const ui = UI()
    ui.div(
      `Usage: ${ctx.name} <command> [options]\n`
    )
    let hasRegisterRouteNames = Object.keys(routes).filter(routeName => routeName !== EMPTY_COMMAND_NAME);
    let emptyCommand = routes[EMPTY_COMMAND_NAME];
    if(hasRegisterRouteNames.length === 0) {
      ui.div(
        `Commands: haven't register any command\n`
      )
    } else {
      ui.div({
        text: 'Commands:',
        padding: [0, 0, 1, 0],
      })
      hasRegisterRouteNames.forEach((routeName) => {
        ui.div(
          {
            text: getCommandMessage(routes[routeName]),
            width: 50,
            padding: [0, 4, 0, 4]
          },
          {
            text: routes[routeName].description,
            width: 100
          }
        )
      })
    } 
    if(emptyCommand) {
      ui.div({
        text: '\nOptions:',
        padding: [0, 0, 1, 0]
      })
      emptyCommand.options.forEach(option => {
        if (option.rule === RouteOptionRuleEnum.QUERY) {
          ui.div(
            {
              text: option.search,
              width: 50,
              padding: [0, 4, 0, 4]
            },
            {
              text: `${option.description}`,
              width: 100
            },
            {
              text: option.required ? '[required]' : '',
              align: 'right'
            }
          )
        }
      })
    }
    console.log(ui.toString())
    ctx.emitter.emit('help', 'global')
  } 
}