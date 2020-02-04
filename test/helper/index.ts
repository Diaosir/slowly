import { App } from '../../lib'
import { isObject } from '../../lib/utils/is'
export default function excuteCommand(command: string) {
  if(typeof command !== 'string') {
    return;
  }
  process.argv = ['node'].concat(command.split(/\s+/));
  process.execPath = '/Users/huangzhen/.nvm/versions/node/v8.4.0/bin/node';
}
export function testCommand(testName: string, command: string, ...args: any) {
  if(typeof testName !== 'string' && typeof command !== 'string') {
    return;
  }
  const callback = args.filter((arg: any) => typeof arg === 'function')[0];
  const config = args.filter((arg: any) => isObject(arg))[0];
  test(`${testName}: ${command}`, async done => {
    excuteCommand(command)
    const app = new App({
      version: '1.0.0',
      name: 'test-slowly',
      ...config
    });
    callback.apply(null, [done, app, app.router])
    app.start();
  })
}