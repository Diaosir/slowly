import { IContext, IArgv, IRouteConfig } from '../interface/type';
import EventHandler from '../utils/eventHandler';
export default class Context implements IContext {
    services: {
        [propName: string]: any;
    };
    app: any;
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
    readonly curl: any;
    /**
     *Creates an instance of Context.
     * @param {*} app
     * @memberof Context
     */
    constructor(app: any);
}
