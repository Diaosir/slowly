
import { mergeJSON } from './merge-json';
import { isMiddlesFunction } from '../utils/is'
export default function After(middlewares: Array<Function>) {
  return function(target: any, functionName?: string) {
    if(!functionName) {
      return;
    }
    if(isMiddlesFunction(middlewares)) {
      target['commands'] = mergeJSON(target['commands'] || {}, {
        [functionName]: {
          after: middlewares
        }
      });
    } 
  }
}
