import { App } from '../../lib'
import { testCommand } from '../helper'
import decorator from '../../lib/decorator'
//disable original console  
// console.log = () => {}
describe('template test', () => {
  // testCommand('controller test', 'test-slowly init', async (done: any, app: App, router: Router) => {
  //   const { ctx: { controller, config}} = app;
  //   expect(Object.keys(controller)).toContain('home');
  //   expect(controller.home).toHaveProperty('create')
  //   expect(config).toMatchObject({name: 'test-slowly'});
  //   router.register('init', 'test controller', async (ctx: IContext, next: any) => {
  //     await next();
  //     expect(ctx).toHaveProperty('message', 'hello world')
  //     done()
  //   }, controller.index.init)
  // })
  // testCommand('service test', 'test-slowly init', async (done: any, app: App, router: Router) => {
  //   const { ctx: { service, controller } } = app;
  //   expect(Object.keys(service)).toContain('index');
  //   expect(service.index).toHaveProperty('sayHello')
  //   router.register('init', async (ctx: IContext, next: any) => {
  //     await next();
  //     expect(ctx).toHaveProperty('message', 'hello world')
  //     done()
  //   }, controller.index.getMessage)
  // })
  // testCommand('middleware test', 'test-slowly init', async (done: any, app: App, router: Router) => {
  //   const { ctx: { middleware } } = app;
  //   const inquirerMiddleware = middleware.inquirer([{
  //     type: 'input',
  //     message: 'set name',
  //     name: 'name'
  //   }]);
  //   router.register('init', inquirerMiddleware, async (ctx: IContext) => {
  //     expect(ctx.query).toHaveProperty('name', 'test_user')
  //     done()
  //   })
  // })
  // testCommand('enable decorator', 'test-slowly create -a huangzhen -n ad', async (done: any, app: App) => {
  //   app.use(decorator());
  //   app.ctx.emitter.on('command', (command) => {
  //     if(command === 'create') {
  //       done()
  //     }
  //   })
  // })
  // testCommand('sub command help', 'test-slowly -h', async (done: any, app: App) => {
  //   app.use(decorator());
  //   setTimeout(() => {
  //     done()
  //   }, 2000)
  // })
  testCommand('root command', 'test-slowly', async(done: any, app: App) => {
    app.use(decorator());
    setTimeout(() => {
      done()
    }, 2000)
  })
})