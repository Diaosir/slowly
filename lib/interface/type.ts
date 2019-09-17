export interface AppMiddleware {
  
}
export interface ContextInterface {
  cwd: string;
  service?: String | {
    [key: string]: any
  },
  command?: {
    [key: string]: any
  },
  argv: any,
  routes: {
    [key: string]: RouteConfigInterfase
  }
  version: string;
  emitter: any;
  name?: string;
  middleware?: {
    [key: string]: any
  };
  [key: string]: any
}
export interface ArgvInterface {
  originalArgv: Array<string>;
  params: Array<any>;
  name: string;
  execPath: string;
  query: {
    [propName: string]: any;
  }
}

export interface RouteOptionInterface {
  rule?: RouteOptionRuleEnum;
  name?: string;
  required: boolean;
  summary_name?: string;
  type?: string;
  search?: string;
  description?: string;
}
export enum RouteOptionRuleEnum {
  NORMAL,
  PARAM,
  QUERY,
  REST
}

export interface RouteConfigInterfase {
  path: string;
  options: Array<RouteOptionInterface>;
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
export interface AppOptionInterface {
  es6?: boolean;
  version: string; 
  name: string;
  dirname: string;
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