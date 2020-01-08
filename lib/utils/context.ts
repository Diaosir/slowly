import { IContext, IArgv, IRouteConfig} from '../interface/type';
import EventHandler from '../utils/eventHandler';
import * as is from '../utils/is'
export default class Context implements IContext {
  public services: {
    [propName: string]: any;
  };
  public ctx: any;
  public app: any;
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
  /**
   *Creates an instance of Context.
   * @param {*} app 
   * @memberof Context
   */
  constructor() {
    // this.app = app;
    // this.config = app.config;
  }
}