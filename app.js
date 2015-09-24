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
    //.incXfr()
    .merge(t2, t3)
    .debugXdr('merged event stream')
    //.reduceXdr(predicates.everythingPdc)    // everything aggregated
    //.debugXfr('aggregate event stream: ')
    .takeXdr(3)
    //.takeUntilXdr(5)
    .debugXdr('chunked stream')
    .flattenXdr()
    //.reduceXdr(predicates.notNullPdc)    // filter nulls
    //.isEvenXfr()
    //.debugXdr('take event stream: ')
    .toArray(false);

var base1 = new lazy.ArraySequence([]);

var t4 = base1
        //.incXfr()
        //.isEvenXfr()
        .merge(t3);


t4.subscribe(function(data) {
    //
    console.log("data: "+data.toString());
    console.log("via stream: "+t4.toArray(false));
});

console.log(res);



base1.add([1,4,6]);
base1.add([2,5,7]);
