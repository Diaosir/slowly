
import { mergeJSON } from './merge-json';
export default function Alias(alias: string) {
  return function(target: any, functionName?: string) {
    if(!functionName) {
      return;
    }
    target['commands'] = mergeJSON(target['commands'] || {}, {
      [functionName]: {
        alias
      }
    });
  }
}
