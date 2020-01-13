
import { mergeJSON } from './merge-json';
export default function Before(before: Function) {
  return function(target: any, functionName?: string) {
    if(!functionName || typeof before !== 'function') {
      return;
    }
    target['commands'] = mergeJSON(target['commands'] || {}, {
      [functionName]: {
        before: async (ctx, next) => {
          await before(ctx);
          await next()
        }
      }
    });
  }
}
