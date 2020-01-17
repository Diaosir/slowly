import Context from './utils/context'
import Argv from './core/argv';
import Load from './core/load';
import { IAppOption, IContext} from './interface/type'
import { compose } from './utils/compose'
import Router from './router';
import * as path from 'path'
import curl from './utils/curl'
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
  public curl = curl;
  public router: Router = new Router();
  constructor(option: IAppOption) {
    const rootModule = this._getRootParentModule(module);
    this.option = option;
    this.argv = new Argv();
    this.cwd = path.dirname(rootModule.filename);
    this.config = Load.loadAllConfig(path.join(this.cwd, '/config/'), option.userConfigFile);
    this.ctx = this.createContext();
    this.baseLoad = new Load(this.ctx);
    this.router.register('').option('-V, --version', 'output version')
      .option('-h, --help', 'output usage information')
  }
  start() {
    if(Object.keys(this.router.handlers).length > 0) {
      this.use(this.router.routes());
    }
    this.callback();
  }
  use(fn: Function) {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be a function!')
    }
    this.middlewares.push(fn);
    return this;
  }
  createContext() {
    return new Context(this);
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