import { Prefix  } from '../../lib/decorator'
@Prefix('init')
class Test {
  async action() {

  }
}
describe('decorator prefix', () => {
  test('prefix class', () => {
     const test: any = new Test()
     expect(test.__proto__).toHaveProperty('classPrefixs', 'init')
  })
})