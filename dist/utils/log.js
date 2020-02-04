Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
function pushBlank(str, blankvalue) {
    if (!str) {
        return '';
    }
    if (str.length > blankvalue) {
        return str;
    }
    return str.split('').concat(Array.from(new Array(blankvalue - str.length), () => ' ')).join('');
}
function generateOptionLine(optionStr, description, emptyValue = 30) {
    if (optionStr.length < emptyValue) {
        optionStr = pushBlank(optionStr, emptyValue);
    }
    return `\n  ${chalk.green(optionStr)}      ${chalk.yellow(description || '')}`;
}
exports.generateOptionLine = generateOptionLine;
function error(message) {
    console.log(`${chalk.red('[Error]')}: ${chalk.yellow(message)}`);
}
exports.error = error;
function warning(message) {
    console.log(`${chalk.yellow('[Warn]')}: ${chalk.yellow(message)}`);
}
exports.warning = warning;
function getInfo(name, message, emptyValue = 15) {
    return `${chalk.yellow(pushBlank(`${name}:`, emptyValue))} ${chalk.green(message || '')}`;
}
exports.getInfo = getInfo;
function syntaxError(search) {
    let msg = `syntax error in option search: ${search}`;
    error(msg);
}
exports.syntaxError = syntaxError;
