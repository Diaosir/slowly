import { App, Router } from '../lib'
import commandHelper from './helper/command'
describe('app test', () => {
    test('router test',  async done => {
        commandHelper('test-slowly init template -q true --action=go')
        const router = new Router()
        const app = new App({
            version: '1.0.0',
            name: 'test-slowly'
        });
        router.register('init <dir> [...otherDirs] [-q | --quiet] <-a | --action>', async () => {
            done()
        })
        app.use(router.routes());
    })
    test('app -version', async () => {
        
    })
})