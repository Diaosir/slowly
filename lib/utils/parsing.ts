import * as is from './is'
/**
 * parsing query value
 * @param query 
 */
export function parseQuery(query: string): any{
    if(!is.isString(query)) {
        return query;
    }
    if (query.match(/^[\w_]+,([\w_]+,?)*$/)) { // is list
        return query.split(',')
    }
    if (query === 'true') {
        return true;
    }
    if (query == 'false') {
        return false;
    }
    if (query.match(/^\d+$/)) {
        return parseFloat(query)
    }
    return query;
}