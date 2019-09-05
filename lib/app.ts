import Context from './utils/context'
import Argv from './core/argv';
import Load from './core/load';
import { AppMiddleware } from './interface/type'
import * as is from './utils/is'
import { compose } from './utils/compose'
import Router from './router';
require('babel-register')
(
  {
    plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  }
)
const router = new Router()
class App {
  public argv: any;
  public handle;
  public ctx: any;
  public config: any;
  public cwd: string;
  public allCommands: any;
  public baseLoad: any;
  public middlewares: Array<AppMiddleware> = [];
  constructor(argv?: Array<string>) {
    // this.argv = require('yargs')
    // .usage('Usage: $0 -w [num] -h [num]')
    // .demandOption(['w','h'])
    // .argv;
    this.argv = new Argv(argv)
    this.cwd = process.cwd();
    //Todo
    this.config = {};
    this.ctx = this.createContext();
    this.baseLoad = new Load(this.ctx);
    this.use(router.routes())
    setTimeout(() => {
      this.callback();
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
    return ctx;
  }
  callback() {
    const fn = compose(this.middlewares);
    fn(this.ctx);
  }
  help() {
  }
}
export default App;