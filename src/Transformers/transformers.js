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
    console.log("res: "+x+ " = "+res);
    return res;
};


exports.take = (x, max) => x;
