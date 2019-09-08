import { ContextInterface, ArgvInterface, RouteConfigInterfase} from '../interface/type';
export default class Context implements ContextInterface {
  public services: {
    [propName: string]: any;
  };
  public ctx: any;
  public app: any;
  public config: any;
  public argv: ArgvInterface;
  public cwd: string;
  public routes: {
    [key: string]: RouteConfigInterfase
  }
  /**
   *Creates an instance of Context.
   * @param {*} app 
   * @memberof Context
   */
  constructor(app?: any) {
    // this.app = app;
    // this.config = app.config;
  }
}