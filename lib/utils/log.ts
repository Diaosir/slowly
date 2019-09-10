const chalk = require('chalk');
export function generateOptionLine(optionStr: string, description: string): string {
  return `\n  ${chalk.green(optionStr)}      ${chalk.yellow(description || '')}`
}
export function error(message) {
  console.log(`${chalk.red('[Error]')}: ${chalk.yellow(message)}`)
}
export function warning(message) {
  console.log(`${chalk.yellow('[Warn]')}: ${chalk.yellow(message)}`)
}
export function getInfo(name, message?: string) {
  return `${chalk.yellow(name)}: ${chalk.green(message || '')}`
}