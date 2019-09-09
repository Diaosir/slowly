import { RouteConfigInterfase, ContextInterface, RouteOptionRuleEnum} from '../interface/type'
import { EMPTY_COMMAND_NAME } from '../utils/contant'
import { generateOptionLine } from '../utils/log'
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
        let message = 'Commands: ';
        let usageMessage = `Usage: ${ctx.name} <command> [options]`
        let optionMessage = `Options: `;
        for(let routeName in routes){
            const { config: { description }, options, path} = routes[routeName];
            if (EMPTY_COMMAND_NAME === routeName) {
                options.forEach(option => {
                    if (option.rule === RouteOptionRuleEnum.QUERY) {
                      optionMessage += generateOptionLine(option.search, option.description)
                    }
                  })
            } else {
                message += generateOptionLine(path, description)
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
    if (command !== undefined && !hasRegisterCommandList.includes(command)) {
        console.log(`${ctx.name}: '${command}' is not a command, See '${ctx.name} --help'`)
        const sortCommandList = hasRegisterCommandList.filter(item => leven(item, command) <= 2 ).sort((a: string, b: string) => {
            return leven(a, command) - leven(b, command);
        })
        if (sortCommandList.length > 0) {
            console.log(`The most similar command is:  ${sortCommandList[0]}`)
        }
    }
}