import  { IContext } from '../interface/type'
export function compose(middlewares: Array<Function>): Function {
  if (!Array.isArray(middlewares)) throw new TypeError('Middleware stack must be an array!')
  for(const fn of middlewares) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function(ctx: IContext) {
    function dispatch(index: number) {
      const fn = middlewares[index];
      if (!fn) {
        return Promise.resolve()
      }
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, index + 1)))
      } catch(error) {
        return Promise.reject(error);
      }
    }
    return dispatch(0);
  }
}