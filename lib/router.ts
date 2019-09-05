export default class Routers {
  public path: any;
  public handlers: {
    [key: string]: any;
  } = {
    a: 'd'
  };
  constructor() {
  }
  /**
   *
   * 注册
   * @memberof Routers
   */
  register(path, handler) {
    this.handlers[path] = handler;
  }
  /**
   * slowly middlerware
   * @memberof Routers
   */
  routes() {
    const _this = this;
    return async function (ctx, next) {
      await next();
      const firstParam = ctx.argv.params[0];
      for(const route in _this.handlers) {
        //Todo 判断route
        if (route.split(' ').indexOf(firstParam) > -1) {
          _this.handlers[route](ctx)
          break;
        }
      }
    }
  }
}