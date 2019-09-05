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
  argv: any
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