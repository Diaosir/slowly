import * as is from './is'
/**
 * parsing query value
 * @param queryValue 
 */
export function parseQueryValue(queryValue: string): any{
    if(!is.isString(queryValue)) {
        return queryValue;
    }
    if (queryValue.match(/^[\w_]+,([\w_]+,?)*$/)) { // is list
        return queryValue.split(',')
    }
    if (queryValue === 'true') {
        return true;
    }
    if (queryValue == 'false') {
        return false;
    }
    if (queryValue.match(/^\d+$/)) {
        return parseFloat(queryValue)
    }
    return queryValue;
}