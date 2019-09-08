"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is = require("./is");
/**
 * parsing query value
 * @param queryValue
 */
function parseQueryValue(queryValue) {
    if (!is.isString(queryValue)) {
        return queryValue;
    }
    if (queryValue.match(/^[\w_]+,([\w_]+,?)*$/)) { // is list
        return queryValue.split(',');
    }
    if (queryValue === 'true') {
        return true;
    }
    if (queryValue == 'false') {
        return false;
    }
    if (queryValue.match(/^\d+$/)) {
        return parseFloat(queryValue);
    }
    return queryValue;
}
exports.parseQueryValue = parseQueryValue;
