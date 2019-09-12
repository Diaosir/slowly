const chalk = require('chalk');
function pushBlank( str: string, blankvalue: number): string {
  if (!str) {
    return ''
  }
  if (str.length > blankvalue ){
    return str;
  }
  return str.split('').concat(Array.from(new Array( blankvalue - str.length), (v, k) => ' ')).join('');
}
export function generateOptionLine(optionStr: string, description: string, emptyValue: number = 50): string {
  if (optionStr.length < emptyValue ){
    optionStr = pushBlank(optionStr ,emptyValue)
  }
  return `\n  ${chalk.green(optionStr)}      ${chalk.yellow(description || '')}`
}
export function error(message) {
  console.log(`${chalk.red('[Error]')}: ${chalk.yellow(message)}`)
}
export function warning(message) {
  console.log(`${chalk.yellow('[Warn]')}: ${chalk.yellow(message)}`)
}
export function getInfo(name, message?: string, emptyValue: number = 15) {
  
  return `${chalk.yellow(pushBlank(`${name}:`, emptyValue))} ${chalk.green(message || '')}`
}