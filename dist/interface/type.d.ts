import App from "../app";
import EventHandler from "../utils/eventHandler";
export interface AppMiddleware {
}
export interface IContext {
    cwd: string;
    service?: {
        [key: string]: any;
    };
    command?: {
        [key: string]: any;
    };
    argv: IArgv;
    routes: {
        [key: string]: IRouteConfig;
    };
    version: string;
    emitter: EventHandler;
    name?: string;
    middleware?: {
        [key: string]: any;
    };
    controller: {
        [key: string]: any;
    };
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
    };
}
export interface IRouteOption {
    rule?: RouteOptionRuleEnum;
    name?: string;
    required: boolean;
    summary_name?: string;
    type?: string;
    search?: string;
    description?: string;
    defaultValue?: any;
    transform?: Function;
}
export declare enum RouteOptionRuleEnum {
    NORMAL = 0,
    PARAM = 1,
    QUERY = 2,
    REST = 3
}
export interface IRouteConfig {
    name: string;
    path: string;
    options: Array<IRouteOption>;
    fn: Function;
    description?: string;
    alias?: string;
    usage?: string;
    config: {
        onHelp?: Function;
        usage: string | Function;
        description: string;
        optionConfig: {
            [key: string]: any;
        };
    };
}
export interface IAppOption {
    version: string;
    name: string;
    userConfigFile?: string;
    useDecorator?: boolean;
}
export interface EventEmitter {
    on(event: string, listener: Function): this;
    prependListener(event: string, listener: Function): this;
    once(event: string, listener: Function): this;
    removeListener(event: string, listener: Function): this;
    off(event: string, listener: Function): this;
    removeAllListeners(event: Array<string>): this;
    setMaxListeners(n: number): this;
    listeners(event: string): Array<any>;
    emit(event: string, ...args: any[]): boolean;
}
