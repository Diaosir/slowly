
import { mergeJSON } from './merge-json';
export default function After(after: Function) {
  return function(target: any, functionName?: string) {
    if(!functionName || typeof after !== 'function') {
      return;
    }
    target['commands'] = mergeJSON(target['commands'] || {}, {
      [functionName]: {
        after: async (ctx, next) => {
          await next()
          await after(ctx);
        }
      }
    });
  }
}
