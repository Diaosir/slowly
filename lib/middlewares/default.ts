import { IContext } from '../interface/type'
import { EMPTY_COMMAND_NAME } from '../utils/contant'
import * as Log from '../utils/log'
import Routers from '../router'
import GlobalHelp from './globalHelp'
const leven = require('leven');

function isGlobalVersion(ctx: IContext) {
    const { argv: { query } } = ctx;
    return query.version || query.v || query.V
}
export async function GlobalVesion(ctx: IContext, next: Function) {
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
export async function GlobalCheckCommand(ctx: IContext, next: Function) {
    await next();
    const { argv: { params }, routes} = ctx;
    const [ command ] = params;
    const hasRegisterCommandList = Object.keys(routes).filter(item => item !== EMPTY_COMMAND_NAME);
    const matchRouter = Routers.getHandlerByParams(params, routes)
    if (!matchRouter) {
        console.log(`${ctx.name}: '${command}' is not a command, See '${ctx.name} --help'`)
        const sortCommandList = hasRegisterCommandList.filter(item => leven(item, command) <= 2 ).sort((a: string, b: string) => {
            return leven(a, command) - leven(b, command);
        })
        if (sortCommandList.length > 0) {
            console.log(`The most similar command is:  ${sortCommandList[0]}`)
        }
    }
}
export async function GlobEmptyArgv(ctx: IContext, next: Function) {
    await next()
    const { argv: { query, params}} = ctx;
    const emptyOption = Object.keys(query);
    if (params.length === 0 && emptyOption.length === 0) {
        Log.warning(`there is not any command and option, See '${ctx.name} --help'`)
    }
}

export default [
    GlobEmptyArgv,
    GlobalVesion,
    GlobalCheckCommand,
    GlobalHelp
]