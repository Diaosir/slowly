
import { mergeJSON } from './merge-json';
import { isMiddlesFunction } from '../utils/is'
export default function Before(middlewares: Array<Function>) {
  return function(target: any, functionName?: string) {
    if(!functionName) {
      return;
    }
    if (!Array.isArray(middlewares)) throw new TypeError('before middleware stack must be an array!')
    for(const fn of middlewares) {
      if (typeof fn !== 'function') throw new TypeError('before middleware must be composed of functions!')
    }
    if(isMiddlesFunction(middlewares)) {
      target['commands'] = mergeJSON(target['commands'] || {}, {
        [functionName]: {
          before: middlewares
        }
      });
    }
  }
}
