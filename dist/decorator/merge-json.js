// 'use strict';
const jsonC = {}.constructor;
const isJSON = function (json) {
    if (json && json.constructor === jsonC) {
        return true;
    }
    return false;
};
const removeDuplicateJSON = function (arr) {
    const hashTable = {};
    return arr.filter((el) => {
        const key = JSON.stringify(el);
        const match = Boolean(hashTable[key]);
        return (match ? false : hashTable[key] = true);
    });
};
const cloneJSON = function (data) {
    return mergeJSON({}, data);
};
const mergeJSON = function (json1, json2) {
    let result = null;
    if (isJSON(json2)) {
        result = {};
        if (isJSON(json1)) {
            for (const key in json1) {
                if (isJSON(json1[key]) || Array.isArray(json1[key])) {
                    result[key] = cloneJSON(json1[key]);
                }
                else {
                    result[key] = json1[key];
                }
            }
        }
        for (const key in json2) {
            if (isJSON(json2[key]) || Array.isArray(json2[key])) {
                result[key] = mergeJSON(result[key], json2[key]);
            }
            else {
                result[key] = json2[key];
            }
        }
    }
    else if (Array.isArray(json1) && Array.isArray(json2)) {
        const mergedJson = json1.concat(json2);
        result = removeDuplicateJSON(mergedJson);
    }
    else {
        result = json2;
    }
    return result;
};
module.exports = {
    mergeJSON
};
