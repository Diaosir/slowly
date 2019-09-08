import { App, Router} from '../lib'
process.argv = ['node', 'test-slowly', 'init', '-n', 'huangzhen', '--name=huangzhen'];
process.execPath = '/Users/huangzhen/.nvm/versions/node/v8.4.0/bin/node'
process.cwd = function() {
    return 'G:\\github\\slowly\\test\\bin'
    // return '/Users/fengzhihao/Projects/github/slowly/test'
}
const router = new Router()
const app = new App();

describe('app test', () => {
    
    test('router test',  async done => {
        router.register('init <dir> [...otherDirs] [-q | --quiet] <-a | --action>', async (ctx) => {
            console.log(ctx)
            expect(1+1).toBe(2)
            done()
        })
        app.use(router.routes());
        
    })
})