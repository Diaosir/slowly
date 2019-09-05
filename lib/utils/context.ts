import { ContextInterface, ArgvInterface } from '../interface/type';
export default class Context implements ContextInterface {
  public services: {
    [propName: string]: any;
  };
  public ctx: any;
  public app: any;
  public config: any;
  public argv: ArgvInterface;
  public cwd: string;
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