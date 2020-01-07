import { Service } from '../../../lib'
export default class TestService extends Service {
  async sayHello() {
    return 'hello world'
  }
}