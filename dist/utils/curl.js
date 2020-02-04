Object.defineProperty(exports, "__esModule", { value: true });
const urllib = require("urllib");
const is = require("./is");
// var httpclient = urllib.create();
/**
 * curl
 * @export
 * @param {string} url
 * @param {...Array<any>} args
 * @returns {(Promise<any> | void)}
 */
function curl(url, ...args) {
    const options = args.filter(arg => is.isObject(arg))[0] || {};
    const callback = args.filter(arg => typeof arg === 'function')[0];
    if (callback) {
        urllib
            .request(url, options)
            .then((result) => callback(null, result.data, result.res))
            .catch(err => callback(err, null, null));
    }
    return urllib.request(url, options);
}
exports.default = curl;
