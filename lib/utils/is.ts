const includes = function (target: string, search: string): boolean {
  if (search.length > target.length) {
    return false;
  } else {
    return target.indexOf(search) !== -1;
  }
}
/**
 *
 * 是否匹配正则
 * @export
 * @param {string} value
 * @param {(RegExp | string)} pattern
 * @returns {boolean}
 */
export function isMatchingPattern(value: string, pattern: RegExp | string): boolean {
  if (isRegExp(pattern)) {
    return (pattern as RegExp).test(value);
  } else if (typeof pattern === 'string') {
    return includes(value, pattern);
  }
}

export function isRegExp(wat: any): boolean {
  return Object.prototype.toString.call(wat) === '[object RegExp]';
}
export function isObject(wat: any): boolean {
  return Object.prototype.toString.call(wat) === '[object Object]';
}
export function isString(wat: any): boolean {
  return Object.prototype.toString.call(wat) === '[object String]';
}
export function isArray(wat: any): boolean {
  return Object.prototype.toString.call(wat) === '[object Array]';
}
export function isNumber(wat: any): boolean {
  return Object.prototype.toString.call(wat) === '[object Number]';
}
export function isFunction(wat: any): boolean {
  return Object.prototype.toString.call(wat) === '[object Function]';
}
export function isAsyncFunction(wat: any): boolean {
  return Object.prototype.toString.call(wat) === '[object AsyncFunction]'
}
export function isHtmlFile(fileName?: any): boolean {
  return /.html$/.test(fileName);
}