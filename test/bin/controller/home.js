export default class Home {
    async init(ctx) {
        // console.log(ctx)
        const { argv } = this.ctx;
        // console.log(this.ctx)
        const body = await this.ctx.service.test2.sayHello()
        console.log(body);
    }
}