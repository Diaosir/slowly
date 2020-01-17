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
var Usage_1 = require("./Usage");
exports.Usage = Usage_1.default;
var Alias_1 = require("./Alias");
exports.Alias = Alias_1.default;
var Description_1 = require("./Description");
exports.Description = Description_1.default;
var Help_1 = require("./Help");
exports.Help = Help_1.default;
var After_1 = require("./After");
exports.After = After_1.default;
var Before_1 = require("./Before");
exports.Before = Before_1.default;
var BeforeAll_1 = require("./BeforeAll");
exports.BeforeAll = BeforeAll_1.default;
var AfterAll_1 = require("./AfterAll");
exports.AfterAll = AfterAll_1.default;
function decorator() {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const { app: { router }, controller } = ctx;
        Object.keys(controller).forEach((controllerName) => {
            const { commands, beforeAll, afterAll, optionAll } = controller[controllerName];
            if (is.isObject(commands) && Object.keys(commands).length > 0) {
                for (let commandName in commands) {
                    const { usage, options, actions, alias, config = {}, description, before, after } = commands[commandName];
                    router.register(commandName === 'index' ? controllerName : `${controllerName} ${commandName}`, usage, config);
                    if (is.isArray(options)) {
                        options.forEach((option) => {
                            router.option.apply(router, option);
                        });
                    }
                    if (is.isArray(optionAll)) {
                        optionAll.forEach((option) => {
                            router.option.apply(router, option);
                        });
                    }
                    if (alias) {
                        router.alias(alias);
                    }
                    if (usage) {
                        router.usage(usage);
                    }
                    if (description) {
                        router.description(description);
                    }
                    let fn = [controller[controllerName][commandName]].concat(actions || []);
                    if (Array.isArray(before)) {
                        fn.unshift(...before);
                    }
                    if (Array.isArray(after)) {
                        fn.push(...after);
                    }
                    if (Array.isArray(beforeAll)) {
                        fn.unshift(...beforeAll);
                    }
                    if (Array.isArray(afterAll)) {
                        fn.push(...afterAll);
                    }
                    router.action.apply(router, fn);
                }
            }
        });
        yield next();
    });
}
exports.default = decorator;
