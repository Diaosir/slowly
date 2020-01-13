
import { mergeJSON } from './merge-json';
export default function Desc(description: string) {
  return function(target: any, functionName?: string) {
    if(!functionName) {
      return;
    }
    target['commands'] = mergeJSON(target['commands'] || {}, {
      [functionName]: {
        description
      }
    });
  }
}
