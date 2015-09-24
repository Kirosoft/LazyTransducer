var lazy = require('../src/Sequence-compiled.js');
var xfr = require('../src/transformers/transformers-compiled.js');
var xdr = require('../src/transducers/transducers-compiled.js');
var predicates = require('../src/predicates/predicates-compiled.js');

var assert = require("assert");

//describe('SequenceArray', function() {
//    describe('combined filter transforms', function () {
//
//        new lazy.ArraySequence([1, 2, 3, 4,5, 6, 7, 8])
//                .Take(1);
//    });
//});


describe('SequenceArray', function() {
    describe('combined filter transforms', function () {

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
        console.log(res);

        it('should return filtered result', function () {
            assert.equal('10,6,2,12,8,4', res.toString());
        });

    });
});