/**
 * Created by marknorman on 09/09/15.
 */

let utils = require('../utils/utils-compiled.js');
let predicates = require('../predicates/predicates-compiled.js');

exports.reduceXdr = (newItemFunc, predicate, params) => {

    return function(acc) {

        let x = newItemFunc();
        if (!x)
            return undefined;

        if (predicate(x)) {

            if (x) {
                acc.push(x)
            }
        }
        return acc;
    }
};


// Needs to check the predicate before pulling the next stream item
exports.takeXdr = (newItemFunc, params) => {

    var count = 0;
    let predicate = new predicates.countPdc(params);

    return function(acc) {
        let res = undefined;

        // Check the predicate before pulling the next item
        if (predicate(count)) {

            // only pull the next item if the predicate is true
            let x = newItemFunc();
            if (x) {
                acc.push(x);
                count++;
                res = acc;
            }
        } else {
            res = '<END>';
        }

        return res;
    };
};

// Needs to check the predicate before pulling the next stream item
exports.takeUntilXdr = (newItemFunc, predicate, params) => {

    return function(acc) {
        let res = undefined;

        let x = newItemFunc();

        // Check the predicate before pulling the next item
        if (x && predicate(x)) {

            // only pull the next item if the predicate is true
            acc.push(x);
            res = acc;
        }

        return res;
    };
};

exports.flattenXdr = (newItemFunc, predicate, params) => {


    return function(acc) {

        let x = newItemFunc();

        if (!x)
            return undefined;

        acc = utils.flatten(acc, x);

        return acc;
    }
};

exports.debugXdr = (newItemFunc, y) => {

    return function(acc) {

        let x = newItemFunc(true);

        if (x === undefined || x === utils.END_OF_SEQUENCE) {
            console.log(y + ": "+ acc.toString());
            return undefined;
        }

        acc.push(x);

        return acc;
    };
};

// skip

// skipwhile

// skipduplicates
