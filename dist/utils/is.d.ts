/**
 *
 * 是否匹配正则
 * @export
 * @param {string} value
 * @param {(RegExp | string)} pattern
 * @returns {boolean}
 */
export declare function isMatchingPattern(value: string, pattern: RegExp | string): boolean;
export declare function isRegExp(wat: any): boolean;
export declare function isObject(wat: any): boolean;
export declare function isString(wat: any): boolean;
export declare function isArray(wat: any): boolean;
export declare function isNumber(wat: any): boolean;
export declare function isFunction(wat: any): boolean;
export declare function isAsyncFunction(wat: any): boolean;
export declare function isHtmlFile(fileName?: any): boolean;
