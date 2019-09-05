"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Routers {
    constructor() {
        this.handlers = {
            a: 'd'
        };
    }
    /**
     *
     * 注册
     * @memberof Routers
     */
    register(path, handler) {
        this.handlers[path] = handler;
    }
    /**
     * slowly middlerware
     * @memberof Routers
     */
    routes() {
        const _this = this;
        return function (ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                yield next();
                const firstParam = ctx.argv.params[0];
                for (const route in _this.handlers) {
                    //Todo 判断route
                    if (route.split(' ').indexOf(firstParam) > -1) {
                        _this.handlers[route](ctx);
                        break;
                    }
                }
            });
        };
    }
}
exports.default = Routers;
