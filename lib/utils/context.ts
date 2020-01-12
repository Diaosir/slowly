import { IContext, IArgv, IRouteConfig} from '../interface/type';
import EventHandler from '../utils/eventHandler';
import * as is from '../utils/is'
import App from '../app'
export default class Context implements IContext {
  public services: {
    [propName: string]: any;
  };
  public app: App;
  public config: any;
  public argv: IArgv;
  public cwd: string;
  public routes: {
    [key: string]: IRouteConfig
  } = {}
  public version: string = '1.0.0';
  public emitter = new EventHandler()
  public name?: string;
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
  get params() {
    return this.argv.params
  }
  get curl() {
    return this.app.curl;
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