Object.defineProperty(exports, "__esModule", { value: true });
const includes = function (target, search) {
    if (search.length > target.length) {
        return false;
    }
    else {
        return target.indexOf(search) !== -1;
    }
};
/**
 *
 * 是否匹配正则
 * @export
 * @param {string} value
 * @param {(RegExp | string)} pattern
 * @returns {boolean}
 */
function isMatchingPattern(value, pattern) {
    if (isRegExp(pattern)) {
        return pattern.test(value);
    }
    else if (typeof pattern === 'string') {
        return includes(value, pattern);
    }
    else {
        return false;
    }
}
exports.isMatchingPattern = isMatchingPattern;
function isRegExp(wat) {
    return Object.prototype.toString.call(wat) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
function isObject(wat) {
    return Object.prototype.toString.call(wat) === '[object Object]';
}
exports.isObject = isObject;
function isString(wat) {
    return Object.prototype.toString.call(wat) === '[object String]';
}
exports.isString = isString;
function isArray(wat) {
    return Object.prototype.toString.call(wat) === '[object Array]';
}
exports.isArray = isArray;
function isNumber(wat) {
    return Object.prototype.toString.call(wat) === '[object Number]';
}
exports.isNumber = isNumber;
function isFunction(wat) {
    return Object.prototype.toString.call(wat) === '[object Function]';
}
exports.isFunction = isFunction;
function isAsyncFunction(wat) {
    return Object.prototype.toString.call(wat) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;
function isHtmlFile(fileName) {
    return /.html$/.test(fileName);
}
exports.isHtmlFile = isHtmlFile;
