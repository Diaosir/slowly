import { Controller } from '../../../lib'
export default class TestController extends Controller {
  async init() {
    this.ctx.message = 'hello world'
  }
  async getMessage() {
    const { service: { index } } = this.ctx;
    const message = await index.sayHello()
    this.ctx.message = message;
  }
}