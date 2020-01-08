import { IContext } from '../interface/type';
export default class Load {
    commandObjectList: any;
    lazyLoadStack: Array<any>;
    constructor(ctx: IContext);
    dynamicLoad(ctx: IContext, key: string, glob: Array<string>, autoInstantiation?: boolean): void;
    lazyLoad(): void;
    static getOriginalClass(path: string): any;
    static loadAllConfig(configFolder: string, userConfigFile?: string): {};
}
