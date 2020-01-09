import * as urllib from 'urllib';
/**
 * curl
 * @export
 * @param {string} url
 * @param {...Array<any>} args
 * @returns {(Promise<any> | void)}
 */
export default function curl(url: string, ...args: Array<any>): Promise<urllib.HttpClientResponse<any>>;
