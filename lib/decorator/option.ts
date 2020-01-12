
import { mergeJSON } from './merge-json';
export default function Option(...args: any) {
  return function(target: any, functionName?: string) {
    const [name] = args;
    if(!name) {
      return;
    }
    const data = {
      [functionName]: {
        options: [args]
      }
    }
    target['commands'] = mergeJSON(target['commands'] || {}, data);
  }
}