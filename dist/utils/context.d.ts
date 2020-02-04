import { IContext, IArgv, IRouteConfig } from '../interface/type';
import EventHandler from '../utils/eventHandler';
import App from '../app';
export default class Context implements IContext {
    app: App;
    routes: {
        [key: string]: IRouteConfig;
    };
    emitter: EventHandler;
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
    readonly params: Array<string>;
    readonly curl: typeof import("./curl").default;
    config: any;
    readonly version: string;
    readonly name: string;
    cwd: string;
    readonly argv: IArgv;
    /**
     *Creates an instance of Context.
     * @param {*} app
     * @memberof Context
     */
    constructor(app: any);
}
