import { App } from '../lib'

describe('app test', () => {
    test('app argv', () => {
        process.argv = ['node', 'slowly', 'init', '-n', 'huangzhen', '--name=huangzhen'];
        process.execPath = '/Users/huangzhen/.nvm/versions/node/v8.4.0/bin/node'
        // console.log(process.cwd())
        process.cwd = function() {
            return '/Users/fengzhihao/Projects/ironman/slowly/test/'
        }
        const app = new App();
        
    })
})