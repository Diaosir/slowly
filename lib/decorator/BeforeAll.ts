import { isMiddlesFunction } from '../utils/is'
export default function BeforeAll(middlewares:  Array<Function>) {
  return function(target: any, name?: string) {
    if(!!name) {
      return;
    }
    if(isMiddlesFunction(middlewares)) {
      target.prototype['beforeAll'] = middlewares
    }
  }
}
