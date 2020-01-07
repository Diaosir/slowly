import { App, Router } from '../../lib'
export default function excuteCommand(command: string) {
  if(typeof command !== 'string') {
    return;
  }
  process.argv = ['node'].concat(command.split(/\s+/));
  process.execPath = '/Users/huangzhen/.nvm/versions/node/v8.4.0/bin/node';
}
export function testCommand(testName: string, command: string, callback: Function) {
  if(typeof testName !== 'string' && typeof command !== 'string') {
    return;
  }
  test(`${testName}: ${command}`, async done => {
    excuteCommand(command)
    const router = new Router();
    const app = new App({
      version: '1.0.0',
      name: 'test-slowly'
    });
    callback.apply(null, [done, app, router])
    app.use(router.routes());
  })
}