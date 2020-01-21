import { IRouteConfig , IContext } from '../interface/type'
import UI from './index'
import { EMPTY_COMMAND_NAME} from '../utils/contant'
const chalk = require('chalk')
function getCommandMessage(route: IRouteConfig) {
  const { options, name, alias } = route;
  const hasQuery = options.filter(option => !option.isArgument).length > 0;
  let message = `${name.replace('__', ' ')}`;
  if(!!alias) {
    let aliasName = alias.split('__').reverse()[0];
    message += chalk.green(`(${aliasName})`)
  }
  let commandMessage = `${options.filter(option => option.isArgument).reduce((preValue, curOption) => chalk.cyan(`${preValue} ${curOption.search}`), '')}`
  if(commandMessage) {
    message += ` ${commandMessage}`
  }
  if(hasQuery) {
    message += ` ${chalk.yellow('[options]')}`
  }
  return message
}

export function showCommandHelp(route: IRouteConfig) {
  const { path, config: { onHelp }, options, usage, description } = route;
  const ui = UI({
    width: 150
  })
  const args = options.filter(option => option.isArgument);
  const querys = options.filter(option => !option.isArgument)
  const autoUsage = args.reduce((preValue, curValue) => {
    return chalk.cyan(`${preValue} ${curValue.search}`)
  }, '')

  ui.div(
    {
      text: 'USAGE:',
      width: 15,
      padding: [1, 0, 0, 0],
    },{
      text: `${usage || `${path} ${autoUsage}${querys.length > 0 ? chalk.yellow(` [options]`) : ''}`}`,
      padding: [1, 0, 0, 0],
    }
  )
  if(args.length > 0) {
    ui.div({
      text: '\nARGUMENTS:\n',
      width: 15
    })
    args.forEach(option => {
      ui.div(
        {
          text: chalk.green(option.search),
          padding: [0, 4, 0, 4],
          width: 30
        },
        {
          text: `${option.description}`,
          width: 100
        },
        {
          text: option.required ? chalk.yellow('[required]') : chalk.gray('[optional]'),
          align: 'right'
        }
      )
    })
  }

  ui.div({
    text: '\nOPTIONS:\n',
    width: 15
  })
  ui.div(
    {
      text: chalk.green('-h, --help'),
      width: 30,
      padding: [0, 4, 0, 4]
    },
    {
      text: `output usage information`
    }
  )
  querys.forEach(option => {
    ui.div(
      {
        text: chalk.green(option.search),
        padding: [0, 4, 0, 4],
        width: 30
      },
      {
        text: `${option.description}`,
        width: 100
      },
      {
        text: option.required ? chalk.yellow('[required]') : chalk.gray('[optional]'),
        align: 'right'
      }
    )
  })
  ui.div(
    {
      text: '\nDESCRIPTION:',
      width: 15
    },{
      text: `\n${description}`
    }
  )
  console.log(ui.toString())
  typeof onHelp === 'function' && onHelp();
}
export function showHelp(ctx: IContext) {
  const { routes } = ctx;
  const ui = UI();
  ui.div({
    text: `${ctx.name}：${ctx.version}`,
    padding: [2, 0, 2, 0],
  })
  ui.div(
    `USAGE: ${ctx.name} <command> [options]\n`
  )
  let aliasRouteNames = Object.keys(routes).map(routeName => routes[routeName].alias).filter(routeName => !!routeName);
  let hasRegisterRouteNames = Object.keys(routes).filter(routeName => routeName !== EMPTY_COMMAND_NAME && aliasRouteNames.indexOf(routeName) === -1);
  let emptyCommand = routes[EMPTY_COMMAND_NAME];
  if(hasRegisterRouteNames.length === 0) {
    ui.div(
      `Commands: haven't register any command\n`
    )
  } else {
    ui.div({
      text: 'COMMANDS:',
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
      text: '\nOPTIONS:',
      padding: [0, 0, 1, 0]
    })
    emptyCommand.options.forEach(option => {
      if (!option.isArgument) {
        ui.div(
          {
            text: chalk.green(option.search),
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
}