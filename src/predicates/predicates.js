/**
 * Created by marknorman on 09/09/15.
 */


var utils = require('../utils/utils-compiled.js');

exports.isEvenPdc =(x) => x % 2 === 0;
exports.everythingPdc =(x) => true;
exports.notNullPdc =(x) =>  x !== null;

exports.countPdc = (maxItems) => {
    var max = maxItems;
    return function(count) {
        var res =  count < max;
        return res;
    }
};

exports.notEqualsPdc = (targetItem) => {
    return function(item) {
        return  targetItem !== item;
    }
};
