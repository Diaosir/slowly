const glob = require('glob');
const path = require('path')
import { ContextInterface } from '../interface/type';
import * as is from '../utils/is'
const FILTER_FUNCTION: Array<string> = ['constructor']
export default class Load {
    public commandObjectList: any;
    constructor(ctx: ContextInterface) {
        this.dynamicLoad(ctx, 'service', glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}')));
        this.dynamicLoad(ctx, 'controller', glob.sync(path.join(ctx.cwd, '/controller/*.{js,ts}')));
    }
    dynamicLoad(ctx: ContextInterface, key: string, glob: Array<string>) {
        let object = {};
        try {
            glob.map((filePath) => {
                const { name }  = path.parse(filePath)
                object[name] = filePath;
            })
        } catch(error) {
            console.log(error)
        }
        ctx[key] = new Proxy(object, {
            get: function(target: Object, name: string) {
                if (typeof target[name] === 'string') {
                    const originalClass = require(target[name]).default || require(target[name]);
                    originalClass.prototype.ctx = ctx;
                    const ownPropertyNames: Array<string> = Object.getOwnPropertyNames(originalClass.prototype).filter((prototyeName: string) => {
                        return FILTER_FUNCTION.indexOf(prototyeName) === -1 && typeof originalClass.prototype[prototyeName] === 'function';
                    });
                    const entry = new originalClass(ctx);
                    ownPropertyNames.forEach((prototyeName: string) => {
                        entry.__proto__[prototyeName] = entry.__proto__[prototyeName].bind(entry);
                    })  
                    return entry
                }
                return target[name]
            }
        })
    }
}