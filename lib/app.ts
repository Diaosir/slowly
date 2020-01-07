import Context from './utils/context'
import Argv from './core/argv';
import Load from './core/load';
import { IAppOption, IContext} from './interface/type'
import { compose } from './utils/compose'
import Router from './router';
import defaultMiddlewares from './middlewares/default';
import * as path from 'path'
const router = new Router()
class App {
  public name: string = '';
  public argv: any;
  public ctx: IContext;
  public config: any;
  public cwd: string;
  public allCommands: any;
  public baseLoad: any;
  public middlewares: Array<Function> = [];
  public option: IAppOption;
  constructor(option: IAppOption) {
    if (option.es6) {
      require('babel-register')
      (
        {
          plugins: ['babel-plugin-transform-es2015-modules-commonjs']
        }
      )
    }
    const rootModule = this._getRootParentModule(module);
    this.option = option;
    this.argv = new Argv();
    this.cwd = path.dirname(rootModule.filename);
    this.config = Load.loadAllConfig(path.join(this.cwd, '/config/'), option.userConfigFile);
    this.ctx = this.createContext();
    this.baseLoad = new Load(this.ctx);
    Object.keys(defaultMiddlewares).forEach((name: any) => {
      this.use(defaultMiddlewares[name]);
    })
    //default options
    router.register('', '', async() => {}).option('[-V | --version]', 'output version')
      .option('[-h | --help]', 'output usage information')
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
  private _getRootParentModule(module: any): any{
    
    if(!module.parent) {
      return module;
    } else {
      return this._getRootParentModule(module.parent)
    }
  }
}
export default App;