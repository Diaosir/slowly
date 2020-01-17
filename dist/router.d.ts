import { IContext, IRouteConfig } from './interface/type';
export default class Routers {
    path: any;
    middlewares: any;
    currentRouteName?: string;
    handlers: {
        [key: string]: IRouteConfig;
    };
    constructor();
    /**
     * init <dir> [...otherDirs] [-q | --quiet] <-a | --action>
     * @param ctx
     */
    match(ctx: IContext): void;
    after(_: IContext): Promise<void>;
    /**
     *
     * 注册
     * @memberof Routers
     */
    register(search: string, ...args: any[]): this;
    /**
     * slowly middlerware
     * @memberof Routers
     */
    routes(): (ctx: IContext, next: Function) => Promise<void>;
    alias(alias: string): this;
    /**
     * register action
     * @param {*} middlerwares
     * @returns
     * @memberof Routers
     */
    action(...middlerwares: Array<Function>): this;
    usage(usage: string): this;
    description(description: string): this;
    /**
     *
     * This method can only register one option
     * @param {string} rule the rule of option
     * @param {string} [description]
     * @param {...Array<any>} args
     * @returns
     * @memberof Routers
     */
    option(rule: string, description?: string, ...args: Array<any>): this;
    static getHandlerByParams(params: Array<string>, commandHandlers: {
        [key: string]: IRouteConfig;
    }): IRouteConfig;
}
