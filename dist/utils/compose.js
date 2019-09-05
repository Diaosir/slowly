"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compose(middlewares) {
    if (!Array.isArray(middlewares))
        throw new TypeError('Middleware stack must be an array!');
    for (const fn of middlewares) {
        if (typeof fn !== 'function')
            throw new TypeError('Middleware must be composed of functions!');
    }
    return function (ctx) {
        function dispatch(index) {
            const fn = middlewares[index];
            if (!fn) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, index + 1)));
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        return dispatch(0);
    };
}
exports.compose = compose;
