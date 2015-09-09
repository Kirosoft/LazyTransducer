/**
 * Created by marknorman on 09/09/15.
 */

var utils = require('../utils/utils-compiled.js');

exports.reduceXdr = (acc, x, predicate) => {
    if (predicate(x)) {
        acc.push(x)
    }
    return acc;
};

exports.take2Xdr = (acc, x, predicate) => {
    if (acc.length >= 2) {
        return undefined;
    } else {
        if (predicate(x)) {
            acc.push(x)
        }
    }
    return acc;
};


