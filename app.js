/**
 * Created by marknorman on 09/09/15.
 */

var lazy = require('./src/Sequence-compiled.js');
var xfr = require('./src/transformers/transformers-compiled.js');

var t1 = new lazy.ArraySequence([1,2,3,4]);
var t2 = new lazy.ArraySequence([5,6,7,8]);
var t3 = new lazy.ArraySequence([9,10,11,12]);

var res = t1
    //.transform(xfr.incXfr)
    .merge(t2, t3)
    .transform(xfr.incXfr)      // map op
    .transform(xfr.isEvenXfr)
    .transform(xfr.debugXfr, 'merged event stream: ')
    .transducer(xfr.aggregateXfr)
    .transform(xfr.debugXfr, 'aggregate event stream: ')
    .toArray();

console.log(res);