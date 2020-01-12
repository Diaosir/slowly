import { Option } from '../../lib/decorator'
class Test {
  async action() {
  }
  @Option('[-u | --uri]', 'ddddsafdff')
  @Option('[-d | --dist]', 'huangzhen')
  async create() {

  }
}
describe('decorator prefix', () => {
  test('prefix class', () => {
     const test: any = new Test()
     console.log(test.__proto__)
  })
})