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
var readline = require('readline');
function default_1(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield next();
        const { argv: { query, params } } = ctx;
        const emptyOption = Object.keys(query).filter(key => {
            return query[key] !== undefined;
        });
        if (params.length === 0 && emptyOption.length === 0) {
            // var rl = readline.createInterface(process.stdin, process.stdout);
            // rl.setPrompt(`${ctx.name}>`);
            // rl.prompt();
            // rl.on('line', function(line) {
            //     switch(line.trim()) {
            //         case 'copy':
            //             console.log("复制");
            //             break;
            //         case 'hello':
            //             console.log('world!');
            //             break;
            //         case 'close':
            //             rl.close();
            //             break;
            //         default:
            //             console.log(line.trim())
            //             console.log('没有找到命令！');
            //             break;
            //     }
            //     rl.prompt();
            // });
            // Log.warning(`there is not any command and option, See '${ctx.name} --help'`);
        }
    });
}
exports.default = default_1;
