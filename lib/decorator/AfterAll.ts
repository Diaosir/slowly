
import { isMiddlesFunction } from '../utils/is'
export default function AfterAll(middlewares:  Array<Function>) {
  return function(target: any, name?: string) {
    if(!!name) {
      return;
    }
    if(isMiddlesFunction(middlewares)) {
      target.prototype['afterAll'] = middlewares
    }
    
  }
}
