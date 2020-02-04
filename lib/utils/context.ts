import { IContext, IArgv, IRouteConfig} from '../interface/type';
import EventHandler from '../utils/eventHandler';
import * as is from '../utils/is'
import App from '../app'
export default class Context implements IContext {
  public app: App;
  public routes: {
    [key: string]: IRouteConfig
  } = {}
  public emitter = new EventHandler()
  public middleware?: {
    [key: string]: any
  } = {}
  public controller: String | {
    [key: string]: any
  };
  public service: String | {
    [key: string]: any
  };
  get query() {
    return this.argv.query
  }
  set query(query: { [key: string]: any}) {
    if(is.isObject(query)) {
      this.argv.query = query;
    }
  }
  get params(): Array<string> {
    return this.argv.params
  }
  get curl() {
    return this.app.curl;
  }
  set config(config) {
    if(is.isObject(config)) {
      this.app.config = config;
    }
  }
  get config() {
    return this.app.config;
  }
  get version() {
    return this.app.option ? this.app.option.version : '1.0.0';
  }
  get name() {
    return this.app.option ? this.app.option.name : ''
  }
  get cwd() {
    return this.app.cwd;
  }
  set cwd(cwd) {
    this.app.cwd = cwd;
  }
  get argv(): IArgv {
    return this.app.argv;
  }
  /**
   *Creates an instance of Context.
   * @param {*} app 
   * @memberof Context
   */
  constructor(app: any) {
    this.app = app;
    // this.config = app.config;
  }
}