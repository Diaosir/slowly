const glob = require('glob');
const path = require('path')
import { ContextInterface } from '../interface/type';

import * as is from '../utils/is'
export default class Load {
    public commandObjectList: any;
    constructor(ctx: ContextInterface) {
        this.commandObjectList = {};
        // this.loadCommand(ctx);
        // this.loadServices(ctx);
        this.dynamicLoad(ctx, 'service', glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}')));
        this.dynamicLoad(ctx, 'controller', glob.sync(path.join(ctx.cwd, '/controller/*.{js,ts}')));
        // this.matchCommandByArgv();
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
                    const constructor = require(target[name]).default || require(target[name]);
                    constructor.prototype.ctx = ctx;
                    // constructor.prototype.constructor
                    // if ( typeof constructor.constructor !== 'function') {
                    //     constructor.constructor = function() {}
                    // }
                    const entry = new constructor(ctx);
                    if (entry.init) {
                        entry.init = entry.init.bind(entry)
                    }
                    
                    return entry
                }
                return target[name]
            }
        })
    }
    loadCommand(ctx: ContextInterface) {
        const commandFileList = glob.sync(path.join(ctx.cwd, '/command/*.{js,ts}'));
        try{
            commandFileList.map((commandFile) => {
                const { name }  = path.parse(commandFile)
                const command = require(commandFile).default;
                command.prototype.ctx = ctx;
                this.commandObjectList[name] = new command(ctx);
            })
        } catch(error) {
            console.log(error)
        }
    }
    loadServices(ctx: ContextInterface): any {
        let services = {};
        try {
            const serviceFileList = glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}'));
            serviceFileList.map((serviceFile) => {
                const { name }  = path.parse(serviceFile)
                // const service = require(serviceFile).default;
                // service.prototype.ctx = ctx;
                services[name] = serviceFile;
            })
        } catch(error) {
            console.log(error)
        }
        ctx.service = services;
        return services
    }
    formatParams() {
        
    }
    matchCommandByArgv(ctx: ContextInterface) {
        const argv = ctx.argv;
        const [ commandName, secondCommand, ...resetCommand] = argv.params;
        try {
            let action = function(...args) {};
            const { commands } = this.commandObjectList[commandName];
            if (!secondCommand) {
                is.isFunction(this.commandObjectList[commandName][commandName]) && this.commandObjectList[commandName][commandName](argv)
            } else {
                action = commands[secondCommand].action;
                action(argv)
            }
            
        } catch(error) {
            // console.log(error)
        }
    }
    valitatorCommandOption() {
    }
}