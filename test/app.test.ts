import { App, Router } from '../lib'
import { IContext } from '../lib/interface/type'
import { testCommand } from './helper'
//disable original console  
console.log = () => {}
describe('command test', () => {
    testCommand('single router register', 'test-slowly init template1 template2 -q --action=go template3', async (done: any, _: any, router: Router) => {
        router.register('init [...template] [-q | --quiet] <-a | --action>', async (ctx: IContext) => {
            done();
            const { cwd, argv: { query }} = ctx;
            expect(cwd).toBe(__dirname);
            expect(query).toMatchObject({'quiet': true, 'action': 'go', template: ['template1', 'template2', 'template3']});
        })
    })
    testCommand('call help by "--help" options','test-slowly --help', async (done: any, app: App) => {
        app.ctx.emitter.on('help', (name: any) => {
            done()
            expect(name).toBe('global')
        })
    })
    testCommand('call help by "-h" options','test-slowly -h', async (done: any, app: App) => {
        expect.assertions(1);
        app.ctx.emitter.on('help', (name: any) => {
            done()
            expect(name).toBe('global')
        })
    })
    
})