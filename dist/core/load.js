"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require('glob');
const path = require('path');
const is = require("../utils/is");
class Load {
    constructor(ctx) {
        this.commandObjectList = {};
        // this.loadCommand(ctx);
        // this.loadServices(ctx);
        this.dynamicLoad(ctx, 'service', glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}')));
        this.dynamicLoad(ctx, 'controller', glob.sync(path.join(ctx.cwd, '/controller/*.{js,ts}')));
        // this.matchCommandByArgv();
    }
    dynamicLoad(ctx, key, glob) {
        let object = {};
        try {
            glob.map((filePath) => {
                const { name } = path.parse(filePath);
                console.log(name);
                // const service = require(serviceFile).default;
                // service.prototype.ctx = ctx;
                object[name] = filePath;
            });
        }
        catch (error) {
            console.log(error);
        }
        ctx[key] = new Proxy(object, {
            get: function (target, name) {
                if (typeof target[name] === 'string') {
                    const constructor = require(target[name]);
                    return new constructor(ctx);
                }
                return target[name];
            }
        });
    }
    loadCommand(ctx) {
        const commandFileList = glob.sync(path.join(ctx.cwd, '/command/*.{js,ts}'));
        try {
            commandFileList.map((commandFile) => {
                const { name } = path.parse(commandFile);
                const command = require(commandFile).default;
                command.prototype.ctx = ctx;
                this.commandObjectList[name] = new command(ctx);
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    loadServices(ctx) {
        let services = {};
        try {
            const serviceFileList = glob.sync(path.join(ctx.cwd, '/service/*.{js,ts}'));
            serviceFileList.map((serviceFile) => {
                const { name } = path.parse(serviceFile);
                // const service = require(serviceFile).default;
                // service.prototype.ctx = ctx;
                services[name] = serviceFile;
            });
        }
        catch (error) {
            console.log(error);
        }
        ctx.service = services;
        return services;
    }
    formatParams() {
    }
    matchCommandByArgv(ctx) {
        const argv = ctx.argv;
        const [commandName, secondCommand, ...resetCommand] = argv.params;
        try {
            let action = function (...args) { };
            const { commands } = this.commandObjectList[commandName];
            if (!secondCommand) {
                is.isFunction(this.commandObjectList[commandName][commandName]) && this.commandObjectList[commandName][commandName](argv);
            }
            else {
                action = commands[secondCommand].action;
                action(argv);
            }
        }
        catch (error) {
            // console.log(error)
        }
    }
    valitatorCommandOption() {
    }
}
exports.default = Load;
