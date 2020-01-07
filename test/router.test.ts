import { testCommand } from './helper'
import { Router } from '../lib'
describe('router test', () => {
  test('router register', () => {
    const router = new Router();
    router.register('init <name>', 'router register test', { "message": 'hello word'})
    .option('[-a | --action]', 'this is action')
    
    expect(router.currentRouteName).toBe('init');
    expect(router.handlers['init'].options.length).toBe(2)
    expect(router.handlers['init'].options[1]).toMatchObject({ 
      rule: 2,
      required: false,
      summary_name: 'a',
      search: '[-a | --action]',
      name: 'action',
      description: 'this is action' }
    )
    expect(router.handlers['init'].config).toMatchObject({"message": 'hello word'})
  })
  test('router alias', () => {
    const router = new Router();
    router.register('init').alias('i');
    const command = router.handlers['init'];
    expect(command.alias).toBe('i')
  })
  testCommand('router action', 'test-slowly init', async ( done: any, __: any, router: Router) => {
    router.register('init', "init test", async(_: any, next: any) => {
      await next()
    }, async (_: any, next:any) => {
      await next();
      done()
    }, async() => {
    })
  })
})