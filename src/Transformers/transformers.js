/**
 * Created by marknorman on 04/09/15.
 */

// XFR rules
// 1) Must be pure functions
// 2) They always return a result, where null indicates the result was filtered out

var utils = require('../utils/utils-compiled.js');

exports.aggregateXfr = x => x;

exports.incXfr = x => x + 1;

exports.isEvenXfr = x => x % 2 == 0 ? x : null;

exports.debugXfr = (x,y) => {
    if (x) {
        var str = '';
        if (utils.isArray(x) && x.length > 0) {
            str = utils.flatten(x).join(',');
        } else {
            str = ''+ x;
        }
        console.log(y + str)
    };
    return x;
};


