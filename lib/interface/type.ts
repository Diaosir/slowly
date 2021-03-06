import App from "../app";
import EventHandler from "../utils/eventHandler";
import Option from '../core/option'
export interface AppMiddleware {
  
}
export interface IContext {
  cwd: string;
  service?: {
    [key: string]: any
  },
  command?: {
    [key: string]: any
  },
  argv: IArgv,
  routes: {
    [key: string]: IRouteConfig
  }
  version: string;
  emitter: EventHandler;
  name?: string;
  middleware?: {
    [key: string]: any
  };
  controller: {
    [key: string]: any
  },
  query?: {
    [key: string]: any;
  };
  readonly params: Array<string>;
  curl: (url: string, ...args: Array<any>) => Promise<any> | void;
  app: App;
  [key: string]: any;
}
export interface IArgv {
  originalArgv: Array<string>;
  params: Array<any>;
  name: string;
  execPath: string;
  query: {
    [propName: string]: any;
  }
}

export enum RouteOptionRuleEnum {
  NORMAL,
  PARAM,
  QUERY,
  REST
}

export interface IRouteConfig {
  name: string;
  path: string;
  options: Array<Option>;
  fn: Function;
  description?: string;
  alias?: string;
  usage?: string;
  config: {
    onHelp?: Function;
    usage: string | Function;
    description: string;
    optionConfig: {
      [key: string]: any
    }
  }
}
export interface IAppOption {
  version: string; 
  name: string;
  userConfigFile?: string; 
  useDecorator?: boolean
}

export interface EventEmitter{
  on(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;
  off(event: string, listener: Function): this;
  removeAllListeners(event: Array<string>): this
  setMaxListeners(n: number): this;
  listeners(event: string): Array<any>;
  emit(event: string, ...args: any[]): boolean;
}