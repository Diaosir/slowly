import { Controller } from '../../../lib'
import { Option, Prefix, Usage, Alias } from '../../../lib/decorator';
@Prefix('hh')
export default class CreateController extends Controller {
  @Option('<-n | --name>', 'please and and ')
  @Option('[-a | --aa]', 'please and and ')
  @Usage('create <-n | --name> [-a | --aa]')
  @Alias('c')
  async index() {
    console.log(this.ctx.query)
  }
  async sentry() {

  }
}