import { IContext, IArgv, IRouteConfig } from '../interface/type';
import EventHandler from '../utils/eventHandler';
import App from '../app';
export default class Context implements IContext {
    services: {
        [propName: string]: any;
    };
    app: App;
    config: any;
    argv: IArgv;
    cwd: string;
    routes: {
        [key: string]: IRouteConfig;
    };
    version: string;
    emitter: EventHandler;
    name?: string;
    middleware?: {
        [key: string]: any;
    };
    controller: String | {
        [key: string]: any;
    };
    service: String | {
        [key: string]: any;
    };
    query: {
        [key: string]: any;
    };
    readonly params: any[];
    readonly curl: typeof import("./curl").default;
    /**
     *Creates an instance of Context.
     * @param {*} app
     * @memberof Context
     */
    constructor(app: any);
}
