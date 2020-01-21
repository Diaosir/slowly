import { IContext } from '../interface/type'
import * as Log from '../utils/log'
import GlobalHelp from './globalHelp'
import ValidateOption from './validateOption'
import { EMPTY_COMMAND_NAME } from '../utils/contant';


function isGlobalVersion(ctx: IContext) {
    const { argv: { query } } = ctx;
    return query.version || query.v || query.V
}
export async function GlobalVesion(ctx: IContext, next: Function) {
    const { version } = ctx;
    if (isGlobalVersion(ctx)) {
        console.log(version);
        return;
    } else {
        await next();
    }
}
export async function GlobEmptyArgv(ctx: IContext, next: Function) {
    const { argv: { query, params }, routes } = ctx;
    const emptyOption = Object.keys(query);
    const emptyHandler = routes[EMPTY_COMMAND_NAME];
    if (params.length === 0 && emptyOption.length === 0 && (!emptyHandler || !emptyHandler.fn)) {
        Log.warning(`there is not any command and option, See '${ctx.name} --help'`);
    } else {
        await next()
    }
}
export default [
    GlobEmptyArgv,
    GlobalVesion,
    GlobalHelp,
    ValidateOption
]