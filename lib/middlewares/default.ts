import { RouteConfigInterfase, ContextInterface} from '../interface/type'
export async function GlobalHelp (ctx: ContextInterface, next) {
    await next();
    const { argv: { params, query }, routes} = ctx;
    let message = 'Introduction: ';
    let usageMessage = 'Usage: ironman <command> [option]'
    if (query.help || query.h) { // handle help
        for(let routeName in routes){
            const { config: { description } } = routes[routeName];
            message += `\n    ${routeName}   ${description}`
        }
        console.log(`${usageMessage}\n${message}`)
    }

}