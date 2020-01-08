import { IContext, IRouteOption, IRouteConfig } from './interface/type';
export default class Routers {
    path: any;
    middlewares: any;
    currentRouteName?: string;
    handlers: {
        [key: string]: IRouteConfig;
    };
    constructor();
    static parseRoute(route: string, config?: {
        [key: string]: any;
    }): {
        command: string;
        options: Array<IRouteOption>;
    };
    /**
     *
     *
     * @memberof Routers
     */
    private generateAutoHelp;
    /**
     *
     * verify this route options
     * @param {*} ctx
     * @param {*} options
     * @memberof Routers
     */
    verifyOption(ctx: IContext, comandOptions: Array<IRouteOption>): {
        verify: boolean;
        message: string;
    };
    /**
     * init <dir> [...otherDirs] [-q | --quiet] <-a | --action>
     * @param ctx
     */
    match(ctx: IContext): void;
    before(ctx: IContext, next: Function): Promise<void>;
    after(_: IContext): Promise<void>;
    /**
     *
     * 注册
     * @memberof Routers
     */
    register(path: string, ...args: any[]): this;
    /**
     * slowly middlerware
     * @memberof Routers
     */
    routes(): (ctx: IContext, next: Function) => Promise<void>;
    alias(aliasName: string): this;
    /**
     * register action
     * @param {*} middlerwares
     * @returns
     * @memberof Routers
     */
    action(...middlerwares: Array<Function>): this;
    usage(description: string): this;
    option(name: string, description?: string): this;
    static getHandlerByCommandName(commandName: string, commandHandlers: {
        [key: string]: IRouteConfig;
    }): IRouteConfig;
}
