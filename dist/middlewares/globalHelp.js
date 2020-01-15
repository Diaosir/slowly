var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../interface/type");
const contant_1 = require("../utils/contant");
const ui_1 = require("../../lib/ui");
function isGlobalHelp(ctx) {
    const { argv: { params, query } } = ctx;
    return params.length === 0 && (query.help || query.h);
}
function getCommandMessage(route) {
    const { options, name } = route;
    const hasQuery = options.filter(option => option.rule === type_1.RouteOptionRuleEnum.QUERY).length > 0;
    let message = `${name.replace('__', ' ')}`;
    let commandMessage = `${options.filter(option => option.rule !== type_1.RouteOptionRuleEnum.QUERY).reduce((preValue, curOption) => `${preValue}${curOption.search}`, '')}`;
    if (commandMessage) {
        message += ` ${commandMessage}`;
    }
    if (hasQuery) {
        message += ` [options]`;
    }
    return message;
}
function GlobalHelp(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield next();
        const { routes } = ctx;
        if (isGlobalHelp(ctx)) { // handle help
            const ui = ui_1.default();
            ui.div(`Usage: ${ctx.name} <command> [options]\n`);
            let hasRegisterRouteNames = Object.keys(routes).filter(routeName => routeName !== contant_1.EMPTY_COMMAND_NAME);
            let emptyCommand = routes[contant_1.EMPTY_COMMAND_NAME];
            if (hasRegisterRouteNames.length === 0) {
                ui.div(`Commands: haven't register any command\n`);
            }
            else {
                ui.div({
                    text: 'Commands:',
                    padding: [0, 0, 1, 0],
                });
                hasRegisterRouteNames.forEach((routeName) => {
                    ui.div({
                        text: getCommandMessage(routes[routeName]),
                        width: 50,
                        padding: [0, 4, 0, 4]
                    }, {
                        text: routes[routeName].description,
                        width: 100
                    });
                });
            }
            if (emptyCommand) {
                ui.div({
                    text: '\nOptions:',
                    padding: [0, 0, 1, 0]
                });
                emptyCommand.options.forEach(option => {
                    if (option.rule === type_1.RouteOptionRuleEnum.QUERY) {
                        ui.div({
                            text: option.search,
                            width: 50,
                            padding: [0, 4, 0, 4]
                        }, {
                            text: `${option.description}`,
                            width: 100
                        }, {
                            text: option.required ? '[required]' : '',
                            align: 'right'
                        });
                    }
                });
            }
            console.log(ui.toString());
            ctx.emitter.emit('help', 'global');
        }
    });
}
exports.default = GlobalHelp;
