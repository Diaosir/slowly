export default class Routers {
  public path: any;
  constructor() {
    
  }
  /**
   *
   * 注册
   * @memberof Routers
   */
  register() {
  }
  /**
   * slowly middlerware
   * @memberof Routers
   */
  routes() {
    return async function(ctx, next) {
      await next();
      console.log(ctx.service.test.aa)
    }
  }
}