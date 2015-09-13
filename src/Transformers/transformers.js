/**
 * Created by marknorman on 04/09/15.
 */

// XFR rules
// 1) Must be pure functions
// 2) They always return a result, where null indicates the result was filtered out

var utils = require('../utils/utils-compiled.js');
var predicates = require('../predicates/predicates-compiled.js');


exports.incXfr = x => x + 1;

exports.isEvenXfr = function(x) {
    let res = predicates.isEvenPdc(x) ? x : null;
    return res;
};

exports.debugXfr = (x,y) => {
    if (x) {
        var str = '';
        if (utils.isArray(x) && x.length > 0) {
            str = utils.flatten(x).join(',');
        } else {
            str = ''+ x;
        }
        console.log(y + str)
    }
    return x;
};


exports.take = (x, max) => x;
