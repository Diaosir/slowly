import { RouteConfigInterfase, ContextInterface, RouteOptionRuleEnum} from '../interface/type'
import { EMPTY_COMMAND_NAME } from '../utils/contant'
import * as Log from '../utils/log'
import Routers from '../router'
const leven = require('leven');
function isGlobalHelp(ctx) {
    const { argv: { params, query }, routes } = ctx;
    return  params.length === 0 && (query.help || query.h)
}
function isGlobalVersion(ctx) {
    const { argv: { query } } = ctx;
    return query.version || query.v
}
//TODO
export async function GlobalHelp (ctx: ContextInterface, next) {
    await next();
    const { routes } = ctx;
    if (isGlobalHelp(ctx)) { // handle help
        let message = Log.getInfo('Commands: ');
        let usageMessage = Log.getInfo('Usage:', `${ctx.name} <command> [options]`);
        let optionMessage = Log.getInfo('Options: ');
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
export async function GlobalVesion(ctx, next) {
    const { version } = ctx;
    if (isGlobalVersion(ctx)) {
        console.log(version);
        return;
    }
    await next();
}
/**
 *
 *
 * @export
 * @param {*} ctx
 * @param {*} next
 */
export async function GlobalCheckCommand(ctx, next) {
    await next();
    const { argv: { params }, routes} = ctx;
    const [command, ...resetParams] = params;
    const hasRegisterCommandList = Object.keys(routes).filter(item => item !== EMPTY_COMMAND_NAME);
    if (command !== undefined && !Routers.getHandlerByCommandName(command, routes)) {
        console.log(`${ctx.name}: '${command}' is not a command, See '${ctx.name} --help'`)
        const sortCommandList = hasRegisterCommandList.filter(item => leven(item, command) <= 2 ).sort((a: string, b: string) => {
            return leven(a, command) - leven(b, command);
        })
        if (sortCommandList.length > 0) {
            console.log(`The most similar command is:  ${sortCommandList[0]}`)
        }
    }
}
export async function GlobEmptyArgv(ctx, next) {
    await next()
    const { argv: { query, params}} = ctx;
    const emptyOption = Object.keys(query).filter(key => {
        return query[key] !== undefined;
    })
    if (params.length === 0 && emptyOption.length === 0) {
        Log.warning(`there is not any command and option, See '${ctx.name} --help'`)
    }
}