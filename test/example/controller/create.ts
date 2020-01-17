import { Controller } from '../../../lib'
import { Option, Description, Before, After, BeforeAll, AfterAll, Help} from '../../../lib/decorator';
@BeforeAll([async(_, next) => {
  console.log('all before')
  await next()
}])
@AfterAll([async(_, next) => {
  console.log('all after')
  await next();
}])
@Option('-f, --float <float>', 'please and and', value => parseFloat(value) * 10, 1.0)
@Option('-a, --aa', 'please and dsd')
@Option('-n, --name', 'init the template of project and relate the project to the remote repository')
export default class CreateController extends Controller {
  @Description('init the template of project and relate the project to the remote repository')
  @Before([
    async (_, next) => {
      console.log('before');
      await next()
    }
  ])
  @After([
    async(_, next) => {
      console.log('after');
      await next()
    }
  ])
  @Option('[folders...]', 'please and dsd')
  @Option('<dir>', 'please and dsd')
  async index(_, next) {
    console.log('create');
    const { service: { index } } = this.ctx;
    const message = await index.sayHello('name')
    this.ctx.message = message;
    await next();
  }
  @Option('-l <list>', 'comma separated list', (value) => value.split(','))
  @Option('[folders...]', 'please and dsd')
  @Description('this is sentry')
  @Help(() => {
    console.log('Example: create sentry aaa')
  })
  async sentry() {
    console.log(this.ctx.query)
  }
}