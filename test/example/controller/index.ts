import { Controller } from '../../../lib'
import { Description, Option } from '../../../lib/decorator';
export default class IndexController extends Controller {
  @Description('this is sentry')
  @Option('-c, --config', 'dsdd')
  async index() {
    console.log('1323')
  }
  async init() {
    this.ctx.message = 'hello world'
  }
  async getMessage() {
    const { service: { index } } = this.ctx;
    const message = await index.sayHello()
    this.ctx.message = message;
  }
}