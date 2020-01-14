
export default function BeforeAll(beforeAll: (ctx: any) => any) {
  return function(target: any, name?: string) {
    if(!!name) {
      return;
    }
    target.prototype['beforeAll'] = async function BeforeAll(ctx, next) {
      await beforeAll(ctx);
      await next()
    };
  }
}
