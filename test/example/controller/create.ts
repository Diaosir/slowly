import { Controller } from '../../../lib'
import { Option, Description, Before, After, BeforeAll, AfterAll, Help} from '../../../lib/decorator';
@BeforeAll(async() => {
  console.log('all before')
})
@AfterAll(async() => {
  console.log('all after')
})
@Option('[-f | --float]', 'please and and', value => parseFloat(value) * 10, 1.0)
@Option('[-a | --aa]', 'please and dsd')
@Option('[-n | --name]', 'init the template of project and relate the project to the remote repository')
export default class CreateController extends Controller {
  @Description('init the template of project and relate the project to the remote repository')
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
  @Option('<-l | --list>', 'comma separated list', (value) => value.split(','))
  @Option('[...folders]', 'please and dsd')
  @Description('this is sentry')
  @Help(() => {
    console.log('Example: create sentry aaa')
  })
  async sentry() {
    console.log(this.ctx.query)
  }
}