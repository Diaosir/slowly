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
  version: string
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
}