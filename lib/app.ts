import Context from './utils/context'
import Argv from './core/argv';
import Load from './core/load';
import { AppMiddleware, AppOptionInterface, ContextInterface} from './interface/type'
import * as is from './utils/is'
import { compose } from './utils/compose'
import Router from './router';
import * as defaultMiddlewares from './middlewares/default';
const ora = require('ora');
 
 
// setTimeout(() => {
//     spinner.color = 'yellow';
//     spinner.text = 'Loading rainbows';
// }, 1000);
const router = new Router()
class App {
  public name: string = '';
  public argv: any;
  public ctx: ContextInterface;
  public config: any;
  public cwd: string;
  public allCommands: any;
  public baseLoad: any;
  public middlewares: Array<AppMiddleware> = [];
  public option: AppOptionInterface
  
  constructor(option: AppOptionInterface) {
    // this.argv = require('yargs')
    // .usage('Usage: $0 -w [num] -h [num]')
    // .demandOption(['w','h'])
    // .argv;
    const spinner = ora('slowly start').start();
    if (option.es6) {
      require('babel-register')
      (
        {
          plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
        }
      )
    }
    this.option = option;
    this.argv = new Argv();
    this.cwd = process.cwd();
    //Todo
    this.config = {};
    this.ctx = this.createContext();
    this.baseLoad = new Load(this.ctx);
    Object.keys(defaultMiddlewares).forEach(name => {
      this.use(defaultMiddlewares[name]);
    })
    this.use(router.routes())
    setTimeout(() => {
      this.callback();
      spinner.stop()
    }, 10)
    
  }
  use(fn: Function) {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be a function!')
    }
    this.middlewares.push(fn);
    return this;
  }
  createContext() {
    const ctx = new Context();
    ctx.argv = this.argv;
    ctx.config = this.config;
    ctx.cwd = this.cwd;
    ctx.version = this.option.version || '1.0.0'
    ctx.name = this.option.name
    return ctx;
  }
  callback() {
    const fn = compose(this.middlewares);
    fn(this.ctx);
  }
  help() {
  }
  usage() {}
}
export default App;