import { Controller } from '../../../lib'
import { Option, Prefix, Alias, Description, Before, After} from '../../../lib/decorator';
@Prefix('hh')
export default class CreateController extends Controller {
  @Option('<-n | --name>', 'please and and ')
  @Option('[-a | --aa]', 'please and dsd')
  @Alias('c')
  @Description('阿斯顿是对的')
  @Before(async () => {
    console.log('before');
  })
  @After(async() => {
    console.log('after');
  })
  async index(_, next) {
    console.log('create');
    const { service: { index } } = this.ctx;
    const message = await index.sayHello('name')
    this.ctx.message = message;
    await next();
  }
  async sentry() {

  }
}