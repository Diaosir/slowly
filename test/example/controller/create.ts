import { Controller } from '../../../lib'
import { Option, Prefix, Description, Before, After, BeforeAll, AfterAll, Help} from '../../../lib/decorator';
@Prefix('hh')
@BeforeAll(async() => {
  console.log('all before')
})
@AfterAll(async() => {
  console.log('all after')
})
@Option('<-n | --name>', 'please and and', 'defaultValue')
@Option('[-a | --aa]', 'please and dsd', )
export default class CreateController extends Controller {
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
  @Option('[...folders]', 'please and dsd')
  @Description('this is sentry')
  @Help(() => {
    console.log('Example: create sentry aaa')
  })
  async sentry() {
    console.log(this.ctx.query)
  }
}