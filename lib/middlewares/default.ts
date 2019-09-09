import { RouteConfigInterfase, ContextInterface, RouteOptionRuleEnum} from '../interface/type'
import { EMPTY_COMMAND_NAME } from '../utils/contant'
import { generateOptionLine } from '../utils/log'
function isGlobalHelp(ctx) {
    const { argv: { params, query }, routes } = ctx;
    return  params.length === 0 && (query.help || query.h)
}
function isGlobalVersion(ctx) {
    const { argv: { params, query }, routes } = ctx;
    return query.version || query.v
}
//TODO
export async function GlobalHelp (ctx: ContextInterface, next) {
    await next();
    const { routes } = ctx;
    if (isGlobalHelp(ctx)) { // handle help
        let message = 'Commands: ';
        let usageMessage = 'Usage: xxx <command> [options]'
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