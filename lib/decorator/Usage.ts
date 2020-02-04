
import { mergeJSON } from './merge-json';
export default function Usage(usage: string) {
  return function(target: any, functionName?: string) {
    if(!functionName) {
      target.prototype['usage'] = usage;
      return;
    }
    target['commands'] = mergeJSON(target['commands'] || {}, {
      [functionName]: {
        usage
      }
    });
  }
}
