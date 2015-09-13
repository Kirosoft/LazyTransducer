/**
 * Created by marknorman on 09/09/15.
 */

var lazy = require('./src/Sequence-compiled.js');
var xfr = require('./src/transformers/transformers-compiled.js');
var xdr = require('./src/transducers/transducers-compiled.js');
var predicates = require('./src/predicates/predicates-compiled.js');

var t1 = new lazy.ArraySequence([1,2,3,4]);
var t2 = new lazy.ArraySequence([5,6,7,8]);
var t3 = new lazy.ArraySequence([9,10,11,12]);

var res = t1
    .incXfr()
    .merge(t2, t3)
    .debugXfr('merged event stream: ')
    //.reduceXdr(predicates.everythingPdc)    // everything aggregated
    //.debugXfr('aggregate event stream: ')
    //.takeXdr(3)
    .takeUntilXdr(5)
    .debugXfr('chunked stream: ')
    .flattenXdr()
    //.reduceXdr(predicates.notNullPdc)    // filter nulls
    //.isEvenXfr()
    .debugXfr('take event stream: ')
    .toArray(false);

console.log(res);

