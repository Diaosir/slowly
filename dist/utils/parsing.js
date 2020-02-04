Object.defineProperty(exports, "__esModule", { value: true });
const is = require("./is");
/**
 * parsing query value
 * @param query
 */
function parseQuery(query) {
    if (!is.isString(query)) {
        return query;
    }
    if (query.match(/^[\w_]+,([\w_]+,?)*$/)) { // is list
        return query.split(',');
    }
    if (query === 'true') {
        return true;
    }
    if (query == 'false') {
        return false;
    }
    if (query.match(/^\d+$/)) {
        return parseFloat(query);
    }
    return query;
}
exports.parseQuery = parseQuery;
