
export default function AfterAll(afterAll: (ctx: any) => any) {
  return function(target: any, name?: string) {
    if(!!name) {
      return;
    }
    target.prototype['afterAll'] = async function AfterAll(ctx, next) {
      await afterAll(ctx);
      await next()
    };
  }
}
