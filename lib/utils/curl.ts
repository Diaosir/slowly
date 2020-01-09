import * as urllib from 'urllib';
import * as is from './is'
// var httpclient = urllib.create();
/**
 * curl
 * @export
 * @param {string} url
 * @param {...Array<any>} args
 * @returns {(Promise<any> | void)}
 */
export default function curl(url: string, ...args: Array<any>): Promise<urllib.HttpClientResponse<any>>{
  const options = args.filter(arg => is.isObject(arg))[0] || {};
  const callback: urllib.Callback<any> = args.filter(arg => typeof arg === 'function')[0];
  if(callback) {
    urllib
      .request(url, options)
      .then((result: any) => callback(null, result.data, result.res))
      .catch(err => callback(err, null, null))
  }
  return urllib.request(url, options)
}