import { IContext } from '../interface/type'
import { showHelp } from '../ui/help'
function isGlobalHelp(ctx: IContext) {
  const { argv: { params, query } } = ctx;
  return  params.length === 0 && (query.help || query.h)
}

export default async function GlobalHelp (ctx: IContext, next: Function) {
  if (isGlobalHelp(ctx)) { // handle help
    showHelp(ctx);
    ctx.emitter.emit('help', 'global')
  } else {
    await next();
  } 
}