class Test {
  constructor(ctx) {

  }
  async aa() {
    const { test2 } = this.ctx.service;
    const body = await test2.sayHello()
    console.log(body);
  }
}
module.exports = Test