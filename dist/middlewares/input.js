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
var keypress = require('keypress');
function default_1(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        process.stdin.on('data', (input) => {
            input = input.toString().trim();
            console.log(input);
            process.stdin.pause();
        });
        yield next();
        // keypress(process.stdin);
        // process.stdin.on('keypress', function (ch, key) {
        //   // console.log('got "keypress"', key);
        //   if (key && key.ctrl && key.name == 'c') {
        //     process.stdin.pause();
        //   }
        //   if (key.name === 'return') {
        //     process.stdin.pause();
        //   }
        //   process.stdout.write(key.name);
        // });
        // process.stdin.setRawMode(true);
        // process.stdin.resume();
    });
}
exports.default = default_1;
