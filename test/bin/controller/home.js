export default class Home {
    async init(ctx) {
        const { test2 } = this.ctx.service;
        const body = await test2.sayHello()
        console.log(body);
    }
}