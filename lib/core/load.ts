const glob = require('glob');
const path = require('path')
import { IContext } from '../interface/type';
import { isString } from 'util';
const FILTER_FUNCTION: Array<string> = ['constructor']
export default class Load {
    public commandObjectList: any;
    public lazyLoadStack: Array<any> = [];
    constructor(ctx: IContext) {
        this.dynamicLoad(ctx, 'service', Load._filterGlobs(glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}'))));
        this.dynamicLoad(ctx, 'controller', Load._filterGlobs(glob.sync(path.join(ctx.cwd, '/controller/*.{js,ts}'))));
        this.dynamicLoad(ctx, 'middleware', Load._filterGlobs(glob.sync(path.join(ctx.cwd, '/middleware/*.{js,ts}'))), false);
        this.dynamicLoad(ctx, null, Load._filterGlobs(glob.sync(path.join(__dirname, '../plugins/**/*.{js,ts}'))));
        this.lazyLoad();
    }
    dynamicLoad(ctx: IContext, key: string, glob: Array<string>, autoInstantiation: boolean = true) {
        const _this = this;
        let object: { [key: string] : any} = {};
        try {
            glob.map((filePath) => {
                const { name }  = path.parse(filePath)
                object[name] = filePath;
                _this.lazyLoadStack.push({
                    name,
                    filePath,
                    objectName: key,
                    autoInstantiation
                });
            })
        } catch(error) {
            console.log(error)
        }
        if (!!key) {
            ctx[key] = new Proxy(object, {
                get: function(target: {[key: string]: any}, name: string) {
                    if (typeof target[name] === 'string') {
                        const originalClass = Load.getOriginalClass(target[name])
                        if (autoInstantiation) {
                            originalClass.prototype.ctx = ctx;
                            const entry = new originalClass(ctx);
                            Object.getOwnPropertyNames(originalClass.prototype).forEach((prototyeName: string) => {
                                if(FILTER_FUNCTION.indexOf(prototyeName) === -1 && typeof originalClass.prototype[prototyeName] === 'function') {
                                    entry.__proto__[prototyeName] = entry.__proto__[prototyeName].bind(entry);
                                }
                                return ;
                            });
                            return entry
                        } else {
                            return originalClass;
                        }

                    }
                    return target[name]
                }
            })
        } else {
            Object.keys(object).forEach(name => {
                const originalClass =  Load.getOriginalClass(object[name]);
                ctx[name] = new originalClass(ctx)
            })
        }
    }
    //TODO
    public lazyLoad() {
        // console.log(this.lazyLoadStack)
    }
    public static getOriginalClass(path: string){
        return require(path).default || require(path);
    }
    public static loadAllConfig(configFolder: string, userConfigFile?: string) {
        const configGlob: string[] = Load._filterGlobs(glob.sync(path.join(configFolder, '*.{js,ts}')));
        if(!!userConfigFile && isString(userConfigFile)) {
            configGlob.push(userConfigFile);
        }
        let config = {}
        try{
            configGlob.forEach(filepath => {
                const fileContext = require(filepath).default || require(filepath)
                config = {
                    ...config,
                    ...fileContext
                }
            })
        }catch(error) {
        }
        return config
    }
    private static _filterGlobs(globs: Array<string>) {
        return globs.filter((glob) => {
            return !glob.match(/\.d\.ts$/)
        })
    }
}