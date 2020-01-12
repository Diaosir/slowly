var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const is = require("../utils/is");
var prefix_1 = require("./prefix");
exports.Prefix = prefix_1.default;
var Option_1 = require("./Option");
exports.Option = Option_1.default;
// export { default as Help } from './help'
function decorator() {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const { app: { router }, controller } = ctx;
        Object.keys(controller).forEach((controllerName) => {
            const { commands } = controller[controllerName].__proto__;
            if (is.isObject(commands) && Object.keys(commands).length > 0) {
                for (let commandName in commands) {
                    const { usage, options, actions } = commands[commandName];
                    if (commandName === 'index') {
                        router.register(controllerName, usage);
                        if (is.isArray(options)) {
                            options.forEach((option) => {
                                router.option.apply(router, option);
                            });
                        }
                        if (usage) {
                            router.usage(usage);
                        }
                        if (Array.isArray(actions) && actions.length > 0) {
                            router.action.apply(router, actions);
                        }
                    }
                }
            }
        });
        yield next();
    });
}
exports.default = decorator;
